/**
 * filterUtils 单元测试
 */

import { filterTasks, FilterOptions } from '../filterUtils';
import { Task } from '../../models/types';

describe('filterUtils', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: '重要任务',
      description: '这是一个重要的任务',
      priority: 'important',
      tags: ['工作', '紧�?],
      subtasks: [],
      dueDate: new Date('2025-01-15'),
      completed: true,
      completedAt: new Date('2025-01-15'),
      archived: false,
      order: 1,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-15'),
      reflection: {
        id: 'r1',
        taskId: '1',
        content: '完成得很�?,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-15'),
      },
    },
    {
      id: '2',
      title: '紧急任�?,
      description: '需要立即处�?,
      priority: 'urgent',
      tags: ['工作'],
      subtasks: [],
      dueDate: new Date('2025-01-16'),
      completed: true,
      completedAt: new Date('2025-01-16'),
      archived: false,
      order: 1,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-16'),
    },
    {
      id: '3',
      title: '琐事',
      description: '小事�?,
      priority: 'trivial',
      tags: ['生活'],
      subtasks: [],
      dueDate: new Date('2025-01-20'),
      completed: false,
      archived: false,
      order: 1,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10'),
    },
  ];

  describe('filterTasks', () => {
    it('should return all tasks when no filters applied', () => {
      const filtered = filterTasks(mockTasks, '', {});
      expect(filtered).toHaveLength(3);
    });

    it('should filter by keyword in title', () => {
      const filtered = filterTasks(mockTasks, '重要', {});
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('重要任务');
    });

    it('should filter by keyword in description', () => {
      const filtered = filterTasks(mockTasks, '立即', {});
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('紧急任�?);
    });

    it('should filter by keyword in tags', () => {
      const filtered = filterTasks(mockTasks, '工作', {});
      expect(filtered).toHaveLength(2);
    });

    it('should filter by keyword in reflection content', () => {
      const filtered = filterTasks(mockTasks, '完成得很�?, {});
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should filter by date range', () => {
      const filters: FilterOptions = {
        dateRange: {
          start: new Date('2025-01-15'),
          end: new Date('2025-01-16'),
        },
      };
      const filtered = filterTasks(mockTasks, '', filters);
      expect(filtered).toHaveLength(2);
    });

    it('should filter by tags', () => {
      const filters: FilterOptions = {
        tags: ['工作'],
      };
      const filtered = filterTasks(mockTasks, '', filters);
      expect(filtered).toHaveLength(2);
    });

    it('should filter by multiple tags', () => {
      const filters: FilterOptions = {
        tags: ['工作', '紧�?],
      };
      const filtered = filterTasks(mockTasks, '', filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should filter by reflection status - has reflection', () => {
      const filters: FilterOptions = {
        hasReflection: true,
      };
      const filtered = filterTasks(mockTasks, '', filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should filter by reflection status - no reflection', () => {
      const filters: FilterOptions = {
        hasReflection: false,
      };
      const filtered = filterTasks(mockTasks, '', filters);
      expect(filtered).toHaveLength(2);
    });

    it('should combine multiple filters', () => {
      const filters: FilterOptions = {
        tags: ['工作'],
        hasReflection: true,
      };
      const filtered = filterTasks(mockTasks, '重要', filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should be case insensitive for keyword search', () => {
      const filtered = filterTasks(mockTasks, '重要', {});
      expect(filtered).toHaveLength(1);
    });

    it('should return empty array when no matches', () => {
      const filtered = filterTasks(mockTasks, '不存在的关键�?, {});
      expect(filtered).toHaveLength(0);
    });
  });
});
