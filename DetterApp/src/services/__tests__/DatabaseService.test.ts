/**
 * DatabaseService 单元测试
 */

import DatabaseService from '../DatabaseService';
import SQLite from 'react-native-sqlite-storage';

// Mock SQLite
jest.mock('react-native-sqlite-storage');

describe('DatabaseService', () => {
  let mockDb: any;
  let mockTransaction: jest.Mock;
  let mockExecuteSql: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockExecuteSql = jest.fn((sql, params, success) => {
      if (success) {
        success(null, { rows: { raw: () => [], length: 0 } });
      }
      return Promise.resolve({ rows: { raw: () => [], length: 0 } });
    });

    mockTransaction = jest.fn((callback, error, success) => {
      const tx = { executeSql: mockExecuteSql };
      callback(tx);
      if (success) success();
      return Promise.resolve();
    });

    mockDb = {
      transaction: mockTransaction,
      executeSql: mockExecuteSql,
      close: jest.fn(() => Promise.resolve()),
    };

    (SQLite.openDatabase as jest.Mock).mockReturnValue(mockDb);
    (SQLite.enablePromise as jest.Mock).mockReturnValue(undefined);
  });

  describe('init', () => {
    it('should initialize database successfully', async () => {
      await DatabaseService.init();

      expect(SQLite.enablePromise).toHaveBeenCalledWith(true);
      expect(SQLite.openDatabase).toHaveBeenCalledWith({
        name: 'detter.db',
        location: 'default',
      });
    });

    it('should create tables on initialization', async () => {
      await DatabaseService.init();

      expect(mockExecuteSql).toHaveBeenCalled();
      const calls = mockExecuteSql.mock.calls;
      const sqlStatements = calls.map(call => call[0]);

      // Check if tasks table is created
      expect(sqlStatements.some((sql: string) => sql.includes('CREATE TABLE IF NOT EXISTS tasks'))).toBe(true);
      // Check if reflections table is created
      expect(sqlStatements.some((sql: string) => sql.includes('CREATE TABLE IF NOT EXISTS reflections'))).toBe(true);
    });

    it('should create indexes on initialization', async () => {
      await DatabaseService.init();

      const calls = mockExecuteSql.mock.calls;
      const sqlStatements = calls.map(call => call[0]);

      // Check if indexes are created
      expect(sqlStatements.some((sql: string) => sql.includes('CREATE INDEX'))).toBe(true);
    });
  });

  describe('getDatabase', () => {
    it('should return database instance after initialization', async () => {
      await DatabaseService.init();
      const db = DatabaseService.getDatabase();

      expect(db).toBeDefined();
      expect(db).toBe(mockDb);
    });

    it('should throw error if database not initialized', () => {
      expect(() => DatabaseService.getDatabase()).toThrow('Database not initialized');
    });
  });

  describe('transaction', () => {
    it('should execute transaction successfully', async () => {
      await DatabaseService.init();

      const callback = jest.fn();
      await DatabaseService.transaction(callback);

      expect(mockTransaction).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
    });

    it('should handle transaction errors', async () => {
      await DatabaseService.init();

      const error = new Error('Transaction failed');
      mockTransaction.mockImplementation((callback, errorCallback) => {
        if (errorCallback) errorCallback(error);
        return Promise.reject(error);
      });

      const callback = jest.fn();

      await expect(DatabaseService.transaction(callback)).rejects.toThrow('Transaction failed');
    });
  });

  describe('executeSql', () => {
    it('should execute SQL query successfully', async () => {
      await DatabaseService.init();

      const mockResults = {
        rows: {
          raw: () => [{ id: '1', title: 'Test' }],
          length: 1,
        },
      };

      mockExecuteSql.mockImplementation((sql, params, success) => {
        if (success) success(null, mockResults);
        return Promise.resolve(mockResults);
      });

      const results = await DatabaseService.executeSql('SELECT * FROM tasks', []);

      expect(results).toBeDefined();
      expect(mockExecuteSql).toHaveBeenCalledWith('SELECT * FROM tasks', [], expect.any(Function), expect.any(Function));
    });

    it('should handle SQL execution errors', async () => {
      await DatabaseService.init();

      const error = new Error('SQL execution failed');
      mockExecuteSql.mockImplementation((sql, params, success, errorCallback) => {
        if (errorCallback) errorCallback(null, error);
        return Promise.reject(error);
      });

      await expect(DatabaseService.executeSql('INVALID SQL', [])).rejects.toThrow();
    });
  });

  describe('clearAllData', () => {
    it('should clear all data from tables', async () => {
      await DatabaseService.init();

      await DatabaseService.clearAllData();

      const calls = mockExecuteSql.mock.calls;
      const sqlStatements = calls.map(call => call[0]);

      expect(sqlStatements.some((sql: string) => sql.includes('DELETE FROM tasks'))).toBe(true);
      expect(sqlStatements.some((sql: string) => sql.includes('DELETE FROM reflections'))).toBe(true);
    });
  });

  describe('close', () => {
    it('should close database connection', async () => {
      await DatabaseService.init();
      await DatabaseService.close();

      expect(mockDb.close).toHaveBeenCalled();
    });

    it('should handle close when database not initialized', async () => {
      await expect(DatabaseService.close()).resolves.not.toThrow();
    });
  });
});
