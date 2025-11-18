/**
 * TaskService - 任务服务
 * 负责任务的 CRUD 操作和业务逻辑
 */

import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'react-native-sqlite-storage';
import DatabaseService from './DatabaseService';
import NotificationService from './NotificationService';
import { Task, SubTask, Priority, AppError, ErrorType } from '../models/types';

class TaskService {
  /**
   * 创建新任务
   * @param taskData 任务数据（不包含 id、createdAt、updatedAt）
   */
  async createTask(
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Task> {
    const id = uuidv4();
    const now = Date.now();

    const newTask: Task = {
      ...taskData,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    try {
      await DatabaseService.transaction(async (tx) => {
        await tx.executeSql(
          `INSERT INTO tasks (
            id, title, description, priority, tags, subtasks,
            due_date, reminder_time, completed, completed_at,
            created_at, updated_at, task_order, archived
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newTask.id,
            newTask.title,
            newTask.description || null,
            newTask.priority,
            JSON.stringify(newTask.tags),
            JSON.stringify(newTask.subtasks),
            newTask.dueDate.getTime(),
            newTask.reminderTime?.getTime() || null,
            newTask.completed ? 1 : 0,
            newTask.completedAt?.getTime() || null,
            newTask.createdAt.getTime(),
            newTask.updatedAt.getTime(),
            newTask.order,
            newTask.archived ? 1 : 0,
          ]
        );
      });

      // 如果任务有提醒时间，调度通知
      if (newTask.reminderTime) {
        await NotificationService.scheduleTaskReminder(
          newTask.id,
          newTask.title,
          newTask.reminderTime
        );
      }

      console.log('Task created:', newTask.id);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '创建任务失败',
        error
      );
    }
  }

  /**
   * 根据日期获取任务
   * @param date 日期
   */
  async getTasksByDate(date: Date): Promise<Task[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const [results] = await DatabaseService.executeSql(
        `SELECT * FROM tasks
         WHERE due_date >= ? AND due_date <= ? AND archived = 0
         ORDER BY priority, task_order`,
        [startOfDay.getTime(), endOfDay.getTime()]
      );

      const tasks = this.mapResultsToTasks(results.rows.raw());
      console.log(`Found ${tasks.length} tasks for date:`, date.toDateString());
      return tasks;
    } catch (error) {
      console.error('Error getting tasks by date:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取任务失败',
        error
      );
    }
  }

  /**
   * 获取已完成的任务
   * @param limit 限制返回数量（可选）
   */
  async getCompletedTasks(limit?: number): Promise<Task[]> {
    try {
      const sql = `
        SELECT * FROM tasks
        WHERE completed = 1
        ORDER BY completed_at DESC
        ${limit ? `LIMIT ${limit}` : ''}
      `;

      const [results] = await DatabaseService.executeSql(sql);
      const tasks = this.mapResultsToTasks(results.rows.raw());
      console.log(`Found ${tasks.length} completed tasks`);
      return tasks;
    } catch (error) {
      console.error('Error getting completed tasks:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取已完成任务失败',
        error
      );
    }
  }

  /**
   * 根据 ID 获取任务
   * @param taskId 任务 ID
   */
  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const [results] = await DatabaseService.executeSql(
        'SELECT * FROM tasks WHERE id = ?',
        [taskId]
      );

      if (results.rows.length === 0) {
        return null;
      }

      const tasks = this.mapResultsToTasks(results.rows.raw());
      return tasks[0];
    } catch (error) {
      console.error('Error getting task by id:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取任务失败',
        error
      );
    }
  }

  /**
   * 更新任务
   * @param task 任务对象
   */
  async updateTask(task: Task): Promise<void> {
    const now = Date.now();

    try {
      await DatabaseService.transaction(async (tx) => {
        await tx.executeSql(
          `UPDATE tasks SET
            title = ?, description = ?, priority = ?, tags = ?,
            subtasks = ?, due_date = ?, reminder_time = ?,
            completed = ?, completed_at = ?, updated_at = ?,
            task_order = ?, archived = ?
           WHERE id = ?`,
          [
            task.title,
            task.description || null,
            task.priority,
            JSON.stringify(task.tags),
            JSON.stringify(task.subtasks),
            task.dueDate.getTime(),
            task.reminderTime?.getTime() || null,
            task.completed ? 1 : 0,
            task.completedAt?.getTime() || null,
            now,
            task.order,
            task.archived ? 1 : 0,
            task.id,
          ]
        );
      });

      // 更新通知：先取消旧的，如果有新的提醒时间则重新调度
      await NotificationService.cancelTaskReminder(task.id);
      if (task.reminderTime && !task.completed) {
        await NotificationService.scheduleTaskReminder(
          task.id,
          task.title,
          task.reminderTime
        );
      }

      console.log('Task updated:', task.id);
    } catch (error) {
      console.error('Error updating task:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '更新任务失败',
        error
      );
    }
  }

  /**
   * 批量更新任务顺序
   * @param updates 任务 ID 和顺序的数组
   */
  async updateTaskOrders(
    updates: Array<{ id: string; order: number }>
  ): Promise<void> {
    try {
      await DatabaseService.transaction(async (tx) => {
        for (const { id, order } of updates) {
          await tx.executeSql(
            'UPDATE tasks SET task_order = ?, updated_at = ? WHERE id = ?',
            [order, Date.now(), id]
          );
        }
      });

      console.log(`Updated order for ${updates.length} tasks`);
    } catch (error) {
      console.error('Error updating task orders:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '更新任务顺序失败',
        error
      );
    }
  }

  /**
   * 删除任务
   * @param taskId 任务 ID
   */
  async deleteTask(taskId: string): Promise<void> {
    try {
      await DatabaseService.transaction(async (tx) => {
        // 先删除关联的复盘笔记（如果有）
        await tx.executeSql('DELETE FROM reflections WHERE task_id = ?', [taskId]);
        // 删除任务
        await tx.executeSql('DELETE FROM tasks WHERE id = ?', [taskId]);
      });

      // 取消任务的通知
      await NotificationService.cancelTaskReminder(taskId);

      console.log('Task deleted:', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '删除任务失败',
        error
      );
    }
  }

  /**
   * 归档任务
   * @param taskId 任务 ID
   */
  async archiveTask(taskId: string): Promise<void> {
    try {
      await DatabaseService.executeSql(
        'UPDATE tasks SET archived = 1, updated_at = ? WHERE id = ?',
        [Date.now(), taskId]
      );

      console.log('Task archived:', taskId);
    } catch (error) {
      console.error('Error archiving task:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '归档任务失败',
        error
      );
    }
  }

  /**
   * 标记任务为已完成
   * @param taskId 任务 ID
   */
  async completeTask(taskId: string): Promise<void> {
    const now = Date.now();

    try {
      await DatabaseService.executeSql(
        'UPDATE tasks SET completed = 1, completed_at = ?, updated_at = ? WHERE id = ?',
        [now, now, taskId]
      );

      // 取消任务的提醒通知（已完成的任务不需要提醒）
      await NotificationService.cancelTaskReminder(taskId);

      console.log('Task completed:', taskId);
    } catch (error) {
      console.error('Error completing task:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '完成任务失败',
        error
      );
    }
  }

  /**
   * 取消完成任务
   * @param taskId 任务 ID
   */
  async uncompleteTask(taskId: string): Promise<void> {
    try {
      await DatabaseService.executeSql(
        'UPDATE tasks SET completed = 0, completed_at = NULL, updated_at = ? WHERE id = ?',
        [Date.now(), taskId]
      );

      console.log('Task uncompleted:', taskId);
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '取消完成任务失败',
        error
      );
    }
  }

  /**
   * 获取所有任务（用于数据导出）
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const [results] = await DatabaseService.executeSql(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );

      const tasks = this.mapResultsToTasks(results.rows.raw());
      console.log(`Found ${tasks.length} total tasks`);
      return tasks;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取所有任务失败',
        error
      );
    }
  }

  /**
   * 根据优先级获取任务
   * @param date 日期
   * @param priority 优先级
   */
  async getTasksByPriority(date: Date, priority: Priority): Promise<Task[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const [results] = await DatabaseService.executeSql(
        `SELECT * FROM tasks
         WHERE due_date >= ? AND due_date <= ?
         AND priority = ? AND archived = 0
         ORDER BY task_order`,
        [startOfDay.getTime(), endOfDay.getTime(), priority]
      );

      const tasks = this.mapResultsToTasks(results.rows.raw());
      return tasks;
    } catch (error) {
      console.error('Error getting tasks by priority:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取任务失败',
        error
      );
    }
  }

  /**
   * 搜索任务
   * @param keyword 关键词
   */
  async searchTasks(keyword: string): Promise<Task[]> {
    try {
      const searchPattern = `%${keyword}%`;
      const [results] = await DatabaseService.executeSql(
        `SELECT * FROM tasks
         WHERE (title LIKE ? OR description LIKE ? OR tags LIKE ?)
         AND archived = 0
         ORDER BY created_at DESC`,
        [searchPattern, searchPattern, searchPattern]
      );

      const tasks = this.mapResultsToTasks(results.rows.raw());
      console.log(`Found ${tasks.length} tasks matching keyword:`, keyword);
      return tasks;
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '搜索任务失败',
        error
      );
    }
  }

  /**
   * 获取所有已使用的标签
   */
  async getAllTags(): Promise<string[]> {
    try {
      const [results] = await DatabaseService.executeSql(
        'SELECT DISTINCT tags FROM tasks WHERE tags != "[]" AND archived = 0'
      );

      const allTags = new Set<string>();
      results.rows.raw().forEach((row) => {
        const tags = JSON.parse(row.tags || '[]');
        tags.forEach((tag: string) => allTags.add(tag));
      });

      const uniqueTags = Array.from(allTags).sort();
      console.log(`Found ${uniqueTags.length} unique tags`);
      return uniqueTags;
    } catch (error) {
      console.error('Error getting all tags:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取标签失败',
        error
      );
    }
  }

  /**
   * 将数据库查询结果映射为 Task 对象数组
   * @param rows 数据库查询结果
   */
  private mapResultsToTasks(rows: any[]): Task[] {
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority as Priority,
      tags: JSON.parse(row.tags || '[]'),
      subtasks: JSON.parse(row.subtasks || '[]'),
      dueDate: new Date(row.due_date),
      reminderTime: row.reminder_time ? new Date(row.reminder_time) : undefined,
      completed: row.completed === 1,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      order: row.task_order,
      archived: row.archived === 1,
    }));
  }
}

// 导出单例实例
export default new TaskService();
