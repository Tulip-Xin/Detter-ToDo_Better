/**
 * ReflectionService 单元测试
 */

import ReflectionService from '../ReflectionService';
import DatabaseService from '../DatabaseService';
import { Reflection } from '../../models/types';

// Mock DatabaseService
jest.mock('../DatabaseService');

describe('ReflectionService', () => {
  let mockExecuteSql: jest.Mock;
  let mockTransaction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockExecuteSql = jest.fn();
    mockTransaction = jest.fn((callback) => {
      const tx = { executeSql: mockExecuteSql };
      return callback(tx);
    });

    (DatabaseService.getDatabase as jest.Mock).mockReturnValue({
      transaction: mockTransaction,
      executeSql: mockExecuteSql,
    });
    (DatabaseService.transaction as jest.Mock).mockImplementation(callback => {
      const tx = { executeSql: mockExecuteSql };
      return callback(tx);
    });
    (DatabaseService.executeSql as jest.Mock).mockImplementation(mockExecuteSql);
  });

  describe('createReflection', () => {
    it('should create a new reflection successfully', async () => {
      const reflectionData = {
        taskId: 'task-1',
        content: '这次做得很好，下次可以更快完�?,
      };

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      const reflection = await ReflectionService.createReflection(reflectionData);

      expect(reflection.id).toBeDefined();
      expect(reflection.taskId).toBe('task-1');
      expect(reflection.content).toBe('这次做得很好，下次可以更快完�?);
      expect(reflection.createdAt).toBeInstanceOf(Date);
      expect(reflection.updatedAt).toBeInstanceOf(Date);
      expect(mockExecuteSql).toHaveBeenCalled();
    });

    it('should handle empty content', async () => {
      const reflectionData = {
        taskId: 'task-1',
        content: '',
      };

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      const reflection = await ReflectionService.createReflection(reflectionData);

      expect(reflection.content).toBe('');
    });
  });

  describe('getReflectionByTaskId', () => {
    it('should retrieve reflection for a specific task', async () => {
      const mockReflection = {
        id: 'r1',
        task_id: 'task-1',
        content: '复盘内容',
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [mockReflection],
          length: 1,
        },
      });

      const reflection = await ReflectionService.getReflectionByTaskId('task-1');

      expect(reflection).toBeDefined();
      expect(reflection?.taskId).toBe('task-1');
      expect(reflection?.content).toBe('复盘内容');
      expect(mockExecuteSql).toHaveBeenCalled();
    });

    it('should return null when no reflection found', async () => {
      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [],
          length: 0,
        },
      });

      const reflection = await ReflectionService.getReflectionByTaskId('nonexistent');

      expect(reflection).toBeNull();
    });
  });

  describe('updateReflection', () => {
    it('should update an existing reflection', async () => {
      const reflection: Reflection = {
        id: 'r1',
        taskId: 'task-1',
        content: '更新后的复盘内容',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      await ReflectionService.updateReflection(reflection);

      expect(mockExecuteSql).toHaveBeenCalled();
      const call = mockExecuteSql.mock.calls[0];
      expect(call[0]).toContain('UPDATE reflections');
      expect(call[1]).toContain('更新后的复盘内容');
    });
  });

  describe('deleteReflection', () => {
    it('should delete a reflection by id', async () => {
      const reflectionId = 'r1';

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      await ReflectionService.deleteReflection(reflectionId);

      expect(mockExecuteSql).toHaveBeenCalled();
      const call = mockExecuteSql.mock.calls[0];
      expect(call[0]).toContain('DELETE FROM reflections');
      expect(call[1]).toContain(reflectionId);
    });
  });

  describe('getAllReflections', () => {
    it('should retrieve all reflections', async () => {
      const mockReflections = [
        {
          id: 'r1',
          task_id: 'task-1',
          content: '复盘1',
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 'r2',
          task_id: 'task-2',
          content: '复盘2',
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ];

      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => mockReflections,
          length: mockReflections.length,
        },
      });

      const reflections = await ReflectionService.getAllReflections();

      expect(reflections).toHaveLength(2);
      expect(reflections[0].content).toBe('复盘1');
      expect(reflections[1].content).toBe('复盘2');
    });

    it('should return empty array when no reflections found', async () => {
      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [],
          length: 0,
        },
      });

      const reflections = await ReflectionService.getAllReflections();

      expect(reflections).toEqual([]);
    });
  });

  describe('saveOrUpdateReflection', () => {
    it('should create new reflection if none exists', async () => {
      mockExecuteSql
        .mockResolvedValueOnce({
          rows: { raw: () => [], length: 0 },
        })
        .mockResolvedValueOnce({
          rows: { raw: () => [], length: 0 },
        });

      const reflection = await ReflectionService.saveOrUpdateReflection('task-1', '新复�?);

      expect(reflection.taskId).toBe('task-1');
      expect(reflection.content).toBe('新复�?);
      expect(mockExecuteSql).toHaveBeenCalled();
    });

    it('should update existing reflection', async () => {
      const existingReflection = {
        id: 'r1',
        task_id: 'task-1',
        content: '旧复�?,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      mockExecuteSql
        .mockResolvedValueOnce({
          rows: {
            raw: () => [existingReflection],
            length: 1,
          },
        })
        .mockResolvedValueOnce({
          rows: { raw: () => [], length: 0 },
        });

      const reflection = await ReflectionService.saveOrUpdateReflection('task-1', '更新的复�?);

      expect(reflection.id).toBe('r1');
      expect(reflection.content).toBe('更新的复�?);
    });
  });

  describe('getReflectionById', () => {
    it('should retrieve a reflection by id', async () => {
      const mockReflection = {
        id: 'r1',
        task_id: 'task-1',
        content: '复盘内容',
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [mockReflection],
          length: 1,
        },
      });

      const reflection = await ReflectionService.getReflectionById('r1');

      expect(reflection).toBeDefined();
      expect(reflection?.id).toBe('r1');
      expect(reflection?.content).toBe('复盘内容');
    });

    it('should return null when reflection not found', async () => {
      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [],
          length: 0,
        },
      });

      const reflection = await ReflectionService.getReflectionById('nonexistent');

      expect(reflection).toBeNull();
    });
  });
});
