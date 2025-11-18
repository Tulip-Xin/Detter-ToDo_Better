/**
 * ReflectionService - 复盘服务
 * 负责复盘笔记的 CRUD 操作和关联查询
 */

import { v4 as uuidv4 } from 'uuid';
import DatabaseService from './DatabaseService';
import {
  Reflection,
  Task,
  TaskWithReflection,
  Priority,
  AppError,
  ErrorType,
} from '../models/types';

class ReflectionService {
  /**
   * 创建复盘笔记
   * @param reflectionData 复盘数据（不包含 id、createdAt、updatedAt）
   */
  async createReflection(
    reflectionData: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Reflection> {
    const id = uuidv4();
    const now = Date.now();

    const newReflection: Reflection = {
      ...reflectionData,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    try {
      await DatabaseService.transaction(async (tx) => {
        await tx.executeSql(
          `INSERT INTO reflections (
            id, task_id, content, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            newReflection.id,
            newReflection.taskId,
            newReflection.content,
            newReflection.createdAt.getTime(),
            newReflection.updatedAt.getTime(),
          ]
        );
      });

      console.log('Reflection created:', newReflection.id);
      return newReflection;
    } catch (error) {
      console.error('Error creating reflection:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '创建复盘笔记失败',
        error
      );
    }
  }

  /**
   * 根据任务 ID 获取复盘笔记
   * @param taskId 任务 ID
   */
  async getReflectionByTaskId(taskId: string): Promise<Reflection | null> {
    try {
      const [results] = await DatabaseService.executeSql(
        'SELECT * FROM reflections WHERE task_id = ?',
        [taskId]
      );

      if (results.rows.length === 0) {
        return null;
      }

      const reflection = this.mapResultToReflection(results.rows.item(0));
      return reflection;
    } catch (error) {
      console.error('Error getting reflection by task id:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取复盘笔记失败',
        error
      );
    }
  }

  /**
   * 根据 ID 获取复盘笔记
   * @param reflectionId 复盘笔记 ID
   */
  async getReflectionById(reflectionId: string): Promise<Reflection | null> {
    try {
      const [results] = await DatabaseService.executeSql(
        'SELECT * FROM reflections WHERE id = ?',
        [reflectionId]
      );

      if (results.rows.length === 0) {
        return null;
      }

      const reflection = this.mapResultToReflection(results.rows.item(0));
      return reflection;
    } catch (error) {
      console.error('Error getting reflection by id:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取复盘笔记失败',
        error
      );
    }
  }

  /**
   * 更新复盘笔记
   * @param reflection 复盘笔记对象
   */
  async updateReflection(reflection: Reflection): Promise<void> {
    const now = Date.now();

    try {
      await DatabaseService.transaction(async (tx) => {
        await tx.executeSql(
          `UPDATE reflections SET
            content = ?, updated_at = ?
           WHERE id = ?`,
          [reflection.content, now, reflection.id]
        );
      });

      console.log('Reflection updated:', reflection.id);
    } catch (error) {
      console.error('Error updating reflection:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '更新复盘笔记失败',
        error
      );
    }
  }

  /**
   * 删除复盘笔记
   * @param reflectionId 复盘笔记 ID
   */
  async deleteReflection(reflectionId: string): Promise<void> {
    try {
      await DatabaseService.transaction(async (tx) => {
        await tx.executeSql('DELETE FROM reflections WHERE id = ?', [
          reflectionId,
        ]);
      });

      console.log('Reflection deleted:', reflectionId);
    } catch (error) {
      console.error('Error deleting reflection:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '删除复盘笔记失败',
        error
      );
    }
  }

  /**
   * 根据任务 ID 删除复盘笔记
   * @param taskId 任务 ID
   */
  async deleteReflectionByTaskId(taskId: string): Promise<void> {
    try {
      await DatabaseService.transaction(async (tx) => {
        await tx.executeSql('DELETE FROM reflections WHERE task_id = ?', [
          taskId,
        ]);
      });

      console.log('Reflection deleted for task:', taskId);
    } catch (error) {
      console.error('Error deleting reflection by task id:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '删除复盘笔记失败',
        error
      );
    }
  }

  /**
   * 获取所有复盘笔记（用于数据导出）
   */
  async getAllReflections(): Promise<Reflection[]> {
    try {
      const [results] = await DatabaseService.executeSql(
        'SELECT * FROM reflections ORDER BY created_at DESC'
      );

      const reflections = this.mapResultsToReflections(results.rows.raw());
      console.log(`Found ${reflections.length} total reflections`);
      return reflections;
    } catch (error) {
      console.error('Error getting all reflections:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取所有复盘笔记失败',
        error
      );
    }
  }

  /**
   * 获取已完成任务及其复盘笔记（关联查询）
   * @param limit 限制返回数量（可选）
   */
  async getCompletedTasksWithReflections(
    limit?: number
  ): Promise<TaskWithReflection[]> {
    try {
      const sql = `
        SELECT
          t.*,
          r.id as reflection_id,
          r.content as reflection_content,
          r.created_at as reflection_created_at,
          r.updated_at as reflection_updated_at
        FROM tasks t
        LEFT JOIN reflections r ON t.id = r.task_id
        WHERE t.completed = 1
        ORDER BY t.completed_at DESC
        ${limit ? `LIMIT ${limit}` : ''}
      `;

      const [results] = await DatabaseService.executeSql(sql);
      const tasks = this.mapResultsToTasksWithReflections(results.rows.raw());
      console.log(`Found ${tasks.length} completed tasks with reflections`);
      return tasks;
    } catch (error) {
      console.error('Error getting completed tasks with reflections:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取已完成任务及复盘笔记失败',
        error
      );
    }
  }

  /**
   * 根据任务 ID 获取任务及其复盘笔记
   * @param taskId 任务 ID
   */
  async getTaskWithReflection(
    taskId: string
  ): Promise<TaskWithReflection | null> {
    try {
      const sql = `
        SELECT
          t.*,
          r.id as reflection_id,
          r.content as reflection_content,
          r.created_at as reflection_created_at,
          r.updated_at as reflection_updated_at
        FROM tasks t
        LEFT JOIN reflections r ON t.id = r.task_id
        WHERE t.id = ?
      `;

      const [results] = await DatabaseService.executeSql(sql, [taskId]);

      if (results.rows.length === 0) {
        return null;
      }

      const tasks = this.mapResultsToTasksWithReflections(results.rows.raw());
      return tasks[0];
    } catch (error) {
      console.error('Error getting task with reflection:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取任务及复盘笔记失败',
        error
      );
    }
  }

  /**
   * 搜索复盘笔记
   * @param keyword 关键词
   */
  async searchReflections(keyword: string): Promise<TaskWithReflection[]> {
    try {
      const searchPattern = `%${keyword}%`;
      const sql = `
        SELECT
          t.*,
          r.id as reflection_id,
          r.content as reflection_content,
          r.created_at as reflection_created_at,
          r.updated_at as reflection_updated_at
        FROM tasks t
        INNER JOIN reflections r ON t.id = r.task_id
        WHERE r.content LIKE ?
        ORDER BY r.created_at DESC
      `;

      const [results] = await DatabaseService.executeSql(sql, [searchPattern]);
      const tasks = this.mapResultsToTasksWithReflections(results.rows.raw());
      console.log(
        `Found ${tasks.length} reflections matching keyword:`,
        keyword
      );
      return tasks;
    } catch (error) {
      console.error('Error searching reflections:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '搜索复盘笔记失败',
        error
      );
    }
  }

  /**
   * 获取有复盘笔记的任务数量
   */
  async getReflectionCount(): Promise<number> {
    try {
      const [results] = await DatabaseService.executeSql(
        'SELECT COUNT(*) as count FROM reflections'
      );

      const count = results.rows.item(0).count;
      return count;
    } catch (error) {
      console.error('Error getting reflection count:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取复盘笔记数量失败',
        error
      );
    }
  }

  /**
   * 将数据库查询结果映射为 Reflection 对象
   * @param row 数据库查询结果行
   */
  private mapResultToReflection(row: any): Reflection {
    return {
      id: row.id,
      taskId: row.task_id,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * 将数据库查询结果映射为 Reflection 对象数组
   * @param rows 数据库查询结果
   */
  private mapResultsToReflections(rows: any[]): Reflection[] {
    return rows.map((row) => this.mapResultToReflection(row));
  }

  /**
   * 将数据库查询结果映射为 TaskWithReflection 对象数组
   * @param rows 数据库查询结果
   */
  private mapResultsToTasksWithReflections(rows: any[]): TaskWithReflection[] {
    return rows.map((row) => {
      const task: TaskWithReflection = {
        id: row.id,
        title: row.title,
        description: row.description,
        priority: row.priority as Priority,
        tags: JSON.parse(row.tags || '[]'),
        subtasks: JSON.parse(row.subtasks || '[]'),
        dueDate: new Date(row.due_date),
        reminderTime: row.reminder_time
          ? new Date(row.reminder_time)
          : undefined,
        completed: row.completed === 1,
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        order: row.task_order,
        archived: row.archived === 1,
      };

      // 如果有复盘笔记，添加到任务对象中
      if (row.reflection_id) {
        task.reflection = {
          id: row.reflection_id,
          taskId: row.id,
          content: row.reflection_content,
          createdAt: new Date(row.reflection_created_at),
          updatedAt: new Date(row.reflection_updated_at),
        };
      }

      return task;
    });
  }
}

// 导出单例实例
export default new ReflectionService();
