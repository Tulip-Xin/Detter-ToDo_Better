/**
 * DatabaseService - 数据库服务
 * 负责数据库初始化、表创建、事务管理和错误处理
 */

import SQLite, {
  SQLiteDatabase,
  Transaction,
  ResultSet,
} from 'react-native-sqlite-storage';
import { AppError, ErrorType } from '../models/types';

// 启用调试模式（开发环境）
SQLite.DEBUG(__DEV__);
SQLite.enablePromise(true);

class DatabaseService {
  private db: SQLiteDatabase | null = null;
  private readonly DB_NAME = 'detter.db';
  private readonly DB_LOCATION = 'default';

  /**
   * 初始化数据库
   * 打开数据库连接并创建表结构
   */
  async init(): Promise<void> {
    try {
      if (this.db) {
        console.log('Database already initialized');
        return;
      }

      console.log('Initializing database...');
      this.db = await SQLite.openDatabase({
        name: this.DB_NAME,
        location: this.DB_LOCATION,
      });

      console.log('Database opened successfully');
      await this.createTables();
      console.log('Database initialization complete');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '数据库初始化失败',
        error
      );
    }
  }

  /**
   * 创建数据库表和索引
   */
  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '数据库未初始化'
      );
    }

    try {
      // 创建 tasks 表
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          priority TEXT NOT NULL,
          tags TEXT,
          subtasks TEXT,
          due_date INTEGER NOT NULL,
          reminder_time INTEGER,
          completed INTEGER DEFAULT 0,
          completed_at INTEGER,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          task_order INTEGER NOT NULL,
          archived INTEGER DEFAULT 0
        );
      `);

      console.log('Tasks table created');

      // 创建 reflections 表
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS reflections (
          id TEXT PRIMARY KEY,
          task_id TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        );
      `);

      console.log('Reflections table created');

      // 创建索引以优化查询性能
      await this.createIndexes();
    } catch (error) {
      console.error('Error creating tables:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '创建数据库表失败',
        error
      );
    }
  }

  /**
   * 创建数据库索引
   */
  private async createIndexes(): Promise<void> {
    if (!this.db) {
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '数据库未初始化'
      );
    }

    try {
      // tasks 表索引
      await this.db.executeSql(
        'CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);'
      );

      await this.db.executeSql(
        'CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);'
      );

      await this.db.executeSql(
        'CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);'
      );

      // reflections 表索引
      await this.db.executeSql(
        'CREATE INDEX IF NOT EXISTS idx_reflections_task_id ON reflections(task_id);'
      );

      console.log('Database indexes created');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '创建数据库索引失败',
        error
      );
    }
  }

  /**
   * 执行事务
   * @param callback 事务回调函数
   */
  async transaction(
    callback: (tx: Transaction) => Promise<void>
  ): Promise<void> {
    if (!this.db) {
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '数据库未初始化'
      );
    }

    return new Promise((resolve, reject) => {
      this.db!.transaction(
        async (tx: Transaction) => {
          try {
            await callback(tx);
          } catch (error) {
            console.error('Transaction error:', error);
            throw error;
          }
        },
        (error: any) => {
          console.error('Transaction failed:', error);
          reject(
            new AppError(
              ErrorType.DATABASE_ERROR,
              '数据库事务失败',
              error
            )
          );
        },
        () => {
          resolve();
        }
      );
    });
  }

  /**
   * 执行 SQL 查询
   * @param sql SQL 语句
   * @param params 参数
   */
  async executeSql(
    sql: string,
    params: any[] = []
  ): Promise<[ResultSet]> {
    if (!this.db) {
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '数据库未初始化'
      );
    }

    try {
      return await this.db.executeSql(sql, params);
    } catch (error) {
      console.error('SQL execution error:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        'SQL 执行失败',
        { sql, params, error }
      );
    }
  }

  /**
   * 获取数据库实例
   */
  getDatabase(): SQLiteDatabase {
    if (!this.db) {
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '数据库未初始化'
      );
    }
    return this.db;
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    if (this.db) {
      try {
        await this.db.close();
        this.db = null;
        console.log('Database closed');
      } catch (error) {
        console.error('Error closing database:', error);
        throw new AppError(
          ErrorType.DATABASE_ERROR,
          '关闭数据库失败',
          error
        );
      }
    }
  }

  /**
   * 清空所有数据（用于数据清空功能）
   */
  async clearAllData(): Promise<void> {
    if (!this.db) {
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '数据库未初始化'
      );
    }

    try {
      await this.transaction(async (tx) => {
        await tx.executeSql('DELETE FROM reflections;');
        await tx.executeSql('DELETE FROM tasks;');
      });
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '清空数据失败',
        error
      );
    }
  }

  /**
   * 删除数据库（用于测试或重置）
   */
  async deleteDatabase(): Promise<void> {
    try {
      await this.close();
      await SQLite.deleteDatabase({ name: this.DB_NAME, location: this.DB_LOCATION });
      console.log('Database deleted');
    } catch (error) {
      console.error('Error deleting database:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '删除数据库失败',
        error
      );
    }
  }
}

// 导出单例实例
export default new DatabaseService();
