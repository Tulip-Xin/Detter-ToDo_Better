/**
 * 搜索和筛选工具函数
 */
import { TaskWithReflection, FilterOptions } from '../models/types';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

/**
 * 根据关键词搜索任务
 * 搜索范围：标题、描述、标签、复盘内容
 */
export const searchTasks = (
  tasks: TaskWithReflection[],
  keyword: string
): TaskWithReflection[] => {
  if (!keyword || keyword.trim() === '') {
    return tasks;
  }

  const lowerKeyword = keyword.toLowerCase().trim();

  return tasks.filter(task => {
    // 搜索标题
    if (task.title.toLowerCase().includes(lowerKeyword)) {
      return true;
    }

    // 搜索描述
    if (task.description?.toLowerCase().includes(lowerKeyword)) {
      return true;
    }

    // 搜索标签
    if (task.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))) {
      return true;
    }

    // 搜索复盘内容
    if (task.reflection?.content.toLowerCase().includes(lowerKeyword)) {
      return true;
    }

    return false;
  });
};

/**
 * 根据筛选条件过滤任务
 */
export const filterTasks = (
  tasks: TaskWithReflection[],
  filters: FilterOptions
): TaskWithReflection[] => {
  return tasks.filter(task => {
    // 日期范围筛选
    if (filters.dateRange && task.completedAt) {
      const isInRange = isWithinInterval(task.completedAt, {
        start: startOfDay(filters.dateRange.start),
        end: endOfDay(filters.dateRange.end),
      });
      if (!isInRange) {
        return false;
      }
    }

    // 标签筛选（多选，任意匹配）
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag =>
        task.tags.includes(filterTag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // 复盘状态筛选
    if (filters.hasReflection !== undefined) {
      const hasReflection = !!task.reflection;
      if (hasReflection !== filters.hasReflection) {
        return false;
      }
    }

    return true;
  });
};

/**
 * 组合搜索和筛选
 */
export const searchAndFilterTasks = (
  tasks: TaskWithReflection[],
  keyword: string,
  filters: FilterOptions
): TaskWithReflection[] => {
  // 先应用搜索
  let result = searchTasks(tasks, keyword);

  // 再应用筛选
  result = filterTasks(result, filters);

  return result;
};

/**
 * 从任务列表中提取所有唯一标签
 */
export const extractUniqueTags = (tasks: TaskWithReflection[]): string[] => {
  const tagsSet = new Set<string>();

  tasks.forEach(task => {
    task.tags.forEach(tag => {
      if (tag.trim()) {
        tagsSet.add(tag.trim());
      }
    });
  });

  return Array.from(tagsSet).sort();
};

/**
 * 检查是否有活动的筛选条件
 */
export const hasActiveFilters = (filters: FilterOptions): boolean => {
  return !!(
    filters.dateRange ||
    (filters.tags && filters.tags.length > 0) ||
    filters.hasReflection !== undefined
  );
};
