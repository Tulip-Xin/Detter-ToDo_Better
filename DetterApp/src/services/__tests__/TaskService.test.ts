/**
 * TaskService 单元测试
 */

import TaskService from '../TaskService';
import DatabaseService from '../DatabaseService';
import { Task } from '../../models/types';

// Mock DatabaseService
jest.mock('../DatabaseService');

describe('TaskService', () => {
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

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: '测试任务',
        description: '这是一个测试任�?,
        priority: 'important' as const,
        tags: ['工作'],
        subtasks: [],
        dueDate: new Date('2025-01-01'),
        completed: false,
        archived: false,
        order: 1,
      };

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      const task = await TaskService.createTask(taskData);

      expect(task.id).toBeDefined();
      expect(task.title).toBe('测试任务');
      expect(task.priority).toBe('important');
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
      expect(mockExecuteSql).toHaveBeenCalled();
    });

    it('should handle task creation with optional fields', async () => {
      const taskData = {
        title: '简单任�?,
        priority: 'trivial' as const,
        tags: [],
        subtasks: [],
        dueDate: new Date(),
        completed: false,
        archived: false,
        order: 1,
      };

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      const task = await TaskService.createTask(taskData);

      expect(task.description).toBeUndefined();
      expect(task.reminderTime).toBeUndefined();
    });
  });

  describe('getTasksByDate', () => {
    it('should retrieve tasks for a specific date', async () => {
      const date = new Date('2025-01-01');
      const mockTasks = [
        {
          id: '1',
          title: '任务1',
          description: '描述1',
          priority: 'important',
          tags: '["工作"]',
          subtasks: '[]',
          due_date: date.getTime(),
          reminder_time: null,
          completed: 0,
          completed_at: null,
          created_at: date.getTime(),
          updated_at: date.getTime(),
          task_order: 1,
          archived: 0,
        },
      ];

      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => mockTasks,
          length: mockTasks.length,
        },
      });

      const tasks = await TaskService.getTasksByDate(date);

      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('任务1');
      expect(tasks[0].priority).toBe('important');
      expect(tasks[0].tags).toEqual(['工作']);
      expect(mockExecuteSql).toHaveBeenCalled();
    });

    it('should return empty array when no tasks found', async () => {
      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [],
          length: 0,
        },
      });

      const tasks = await TaskService.getTasksByDate(new Date());

      expect(tasks).toEqual([]);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const task: Task = {
        id: '1',
        title: '更新的任�?,
        description: '更新的描�?,
        priority: 'urgent',
        tags: ['紧�?],
        subtasks: [],
        dueDate: new Date(),
        completed: false,
        archived: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      await TaskService.updateTask(task);

      expect(mockExecuteSql).toHaveBeenCalled();
      const call = mockExecuteSql.mock.calls[0];
      expect(call[0]).toContain('UPDATE tasks');
    });

    it('should update task completion status', async () => {
      const task: Task = {
        id: '1',
        title: '已完成任�?,
        priority: 'important',
        tags: [],
        subtasks: [],
        dueDate: new Date(),
        completed: true,
        completedAt: new Date(),
        archived: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      await TaskService.updateTask(task);

      expect(mockExecuteSql).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by id', async () => {
      const taskId = '1';

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      await TaskService.deleteTask(taskId);

      expect(mockExecuteSql).toHaveBeenCalled();
      const call = mockExecuteSql.mock.calls[0];
      expect(call[0]).toContain('DELETE FROM tasks');
      expect(call[1]).toContain(taskId);
    });
  });

  describe('getCompletedTasks', () => {
    it('should retrieve all completed tasks', async () => {
      const mockTasks = [
        {
          id: '1',
          title: '已完成任�?,
          description: null,
          priority: 'important',
          tags: '[]',
          subtasks: '[]',
          due_date: Date.now(),
          reminder_time: null,
          completed: 1,
          completed_at: Date.now(),
          created_at: Date.now(),
          updated_at: Date.now(),
          task_order: 1,
          archived: 0,
          reflection_content: '复盘内容',
          reflection_id: 'r1',
        },
      ];

      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => mockTasks,
          length: mockTasks.length,
        },
      });

      const tasks = await TaskService.getCompletedTasks();

      expect(tasks).toHaveLength(1);
      expect(tasks[0].completed).toBe(true);
      expect(tasks[0].reflection).toBeDefined();
      expect(tasks[0].reflection?.content).toBe('复盘内容');
    });
  });

  describe('updateTaskOrder', () => {
    it('should update task order', async () => {
      const taskId = '1';
      const newOrder = 5;

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      await TaskService.updateTaskOrder(taskId, newOrder);

      expect(mockExecuteSql).toHaveBeenCalled();
      const call = mockExecuteSql.mock.calls[0];
      expect(call[0]).toContain('UPDATE tasks');
      expect(call[0]).toContain('task_order');
    });
  });

  describe('archiveTask', () => {
    it('should archive a task', async () => {
      const taskId = '1';

      mockExecuteSql.mockResolvedValue({ rows: { raw: () => [], length: 0 } });

      await TaskService.archiveTask(taskId);

      expect(mockExecuteSql).toHaveBeenCalled();
      const call = mockExecuteSql.mock.calls[0];
      expect(call[0]).toContain('UPDATE tasks');
      expect(call[0]).toContain('archived');
    });
  });

  describe('getAllTasks', () => {
    it('should retrieve all tasks', async () => {
      const mockTasks = [
        {
          id: '1',
          title: '任务1',
          description: null,
          priority: 'important',
          tags: '[]',
          subtasks: '[]',
          due_date: Date.now(),
          reminder_time: null,
          completed: 0,
          completed_at: null,
          created_at: Date.now(),
          updated_at: Date.now(),
          task_order: 1,
          archived: 0,
        },
      ];

      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => mockTasks,
          length: mockTasks.length,
        },
      });

      const tasks = await TaskService.getAllTasks();

      expect(tasks).toHaveLength(1);
      expect(mockExecuteSql).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should retrieve a task by id', async () => {
      const mockTask = {
        id: '1',
        title: '任务1',
        description: null,
        priority: 'important',
        tags: '[]',
        subtasks: '[]',
        due_date: Date.now(),
        reminder_time: null,
        completed: 0,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
        task_order: 1,
        archived: 0,
      };

      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [mockTask],
          length: 1,
        },
      });

      const task = await TaskService.getTaskById('1');

      expect(task).toBeDefined();
      expect(task?.id).toBe('1');
      expect(task?.title).toBe('任务1');
    });

    it('should return null when task not found', async () => {
      mockExecuteSql.mockResolvedValue({
        rows: {
          raw: () => [],
          length: 0,
        },
      });

      const task = await TaskService.getTaskById('nonexistent');

      expect(task).toBeNull();
    });
  });
});
