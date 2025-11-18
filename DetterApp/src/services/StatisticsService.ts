/**
 * StatisticsService - 统计服务
 * 负责计算各种统计数据
 */

import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, format } from 'date-fns';
import DatabaseService from './DatabaseService';
import { Task, Priority, AppError, ErrorType } from '../models/types';

export interface CompletionRateData {
  date: string;
  completed: number;
  total: number;
  rate: number;
}

export interface TaskDistribution {
  important: number;
  urgent: number;
  trivial: number;
}

export interface ReflectionStats {
  withReflection: number;
  completed: number;
  rate: number;
}

class StatisticsService {
  /**
   * 计算每日完成率
   * @param days 天数（默认7天）
   */
  async getDailyCompletionRate(days: number = 7): Promise<CompletionRateData[]> {
    try {
      const result: CompletionRateData[] = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const start = startOfDay(date).getTime();
        const end = endOfDay(date).getTime();

        const [totalResults] = await DatabaseService.executeSql(
          `SELECT COUNT(*) as count FROM tasks 
           WHERE due_date >= ? AND due_date <= ? AND archived = 0`,
          [start, end]
        );

        const [completedResults] = await DatabaseService.executeSql(
          `SELECT COUNT(*) as count FROM tasks 
           WHERE due_date >= ? AND due_date <= ? AND completed = 1 AND archived = 0`,
          [start, end]
        );

        const total = totalResults.rows.item(0).count;
        const completed = completedResults.rows.item(0).count;

        result.push({
          date: format(date, 'MM/dd'),
          completed,
          total,
          rate: total > 0 ? completed / total : 0,
        });
      }

      return result;
    } catch (error) {
      console.error('Error calculating daily completion rate:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '计算每日完成率失败',
        error
      );
    }
  }

  /**
   * 计算每周完成率
   * @param weeks 周数（默认4周）
   */
  async getWeeklyCompletionRate(weeks: number = 4): Promise<CompletionRateData[]> {
    try {
      const result: CompletionRateData[] = [];
      const today = new Date();

      for (let i = weeks - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i * 7);
        
        const start = startOfWeek(date, { weekStartsOn: 1 }).getTime();
        const end = endOfWeek(date, { weekStartsOn: 1 }).getTime();

        const [totalResults] = await DatabaseService.executeSql(
          `SELECT COUNT(*) as count FROM tasks 
           WHERE due_date >= ? AND due_date <= ? AND archived = 0`,
          [start, end]
        );

        const [completedResults] = await DatabaseService.executeSql(
          `SELECT COUNT(*) as count FROM tasks 
           WHERE due_date >= ? AND due_date <= ? AND completed = 1 AND archived = 0`,
          [start, end]
        );

        const total = totalResults.rows.item(0).count;
        const completed = completedResults.rows.item(0).count;

        result.push({
          date: format(startOfWeek(date, { weekStartsOn: 1 }), 'MM/dd'),
          completed,
          total,
          rate: total > 0 ? completed / total : 0,
        });
      }

      return result;
    } catch (error) {
      console.error('Error calculating weekly completion rate:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '计算每周完成率失败',
        error
      );
    }
  }

  /**
   * 计算每月完成率
   * @param months 月数（默认6个月）
   */
  async getMonthlyCompletionRate(months: number = 6): Promise<CompletionRateData[]> {
    try {
      const result: CompletionRateData[] = [];
      const today = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        
        const start = startOfMonth(date).getTime();
        const end = endOfMonth(date).getTime();

        const [totalResults] = await DatabaseService.executeSql(
          `SELECT COUNT(*) as count FROM tasks 
           WHERE due_date >= ? AND due_date <= ? AND archived = 0`,
          [start, end]
        );

        const [completedResults] = await DatabaseService.executeSql(
          `SELECT COUNT(*) as count FROM tasks 
           WHERE due_date >= ? AND due_date <= ? AND completed = 1 AND archived = 0`,
          [start, end]
        );

        const total = totalResults.rows.item(0).count;
        const completed = completedResults.rows.item(0).count;

        result.push({
          date: format(date, 'yyyy/MM'),
          completed,
          total,
          rate: total > 0 ? completed / total : 0,
        });
      }

      return result;
    } catch (error) {
      console.error('Error calculating monthly completion rate:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '计算每月完成率失败',
        error
      );
    }
  }

  /**
   * 获取任务分布统计
   */
  async getTaskDistribution(): Promise<TaskDistribution> {
    try {
      const [results] = await DatabaseService.executeSql(
        `SELECT priority, COUNT(*) as count FROM tasks 
         WHERE archived = 0 
         GROUP BY priority`
      );

      const distribution: TaskDistribution = {
        important: 0,
        urgent: 0,
        trivial: 0,
      };

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        const priority = row.priority as Priority;
        distribution[priority] = row.count;
      }

      return distribution;
    } catch (error) {
      console.error('Error getting task distribution:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取任务分布失败',
        error
      );
    }
  }

  /**
   * 获取复盘习惯统计
   */
  async getReflectionStats(): Promise<ReflectionStats> {
    try {
      // 获取已完成任务总数
      const [completedResults] = await DatabaseService.executeSql(
        `SELECT COUNT(*) as count FROM tasks WHERE completed = 1`
      );

      // 获取有复盘笔记的任务数
      const [reflectionResults] = await DatabaseService.executeSql(
        `SELECT COUNT(DISTINCT task_id) as count FROM reflections`
      );

      const completed = completedResults.rows.item(0).count;
      const withReflection = reflectionResults.rows.item(0).count;

      return {
        withReflection,
        completed,
        rate: completed > 0 ? withReflection / completed : 0,
      };
    } catch (error) {
      console.error('Error getting reflection stats:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取复盘统计失败',
        error
      );
    }
  }

  /**
   * 获取总体统计数据
   */
  async getOverallStats() {
    try {
      const [totalResults] = await DatabaseService.executeSql(
        `SELECT COUNT(*) as count FROM tasks WHERE archived = 0`
      );

      const [completedResults] = await DatabaseService.executeSql(
        `SELECT COUNT(*) as count FROM tasks WHERE completed = 1 AND archived = 0`
      );

      const [todayResults] = await DatabaseService.executeSql(
        `SELECT COUNT(*) as count FROM tasks 
         WHERE due_date >= ? AND due_date <= ? AND archived = 0`,
        [startOfDay(new Date()).getTime(), endOfDay(new Date()).getTime()]
      );

      const [todayCompletedResults] = await DatabaseService.executeSql(
        `SELECT COUNT(*) as count FROM tasks 
         WHERE due_date >= ? AND due_date <= ? AND completed = 1 AND archived = 0`,
        [startOfDay(new Date()).getTime(), endOfDay(new Date()).getTime()]
      );

      return {
        totalTasks: totalResults.rows.item(0).count,
        completedTasks: completedResults.rows.item(0).count,
        todayTasks: todayResults.rows.item(0).count,
        todayCompleted: todayCompletedResults.rows.item(0).count,
      };
    } catch (error) {
      console.error('Error getting overall stats:', error);
      throw new AppError(
        ErrorType.DATABASE_ERROR,
        '获取总体统计失败',
        error
      );
    }
  }
}

export default new StatisticsService();
