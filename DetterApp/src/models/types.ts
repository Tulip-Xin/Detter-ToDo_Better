/**
 * 核心数据类型定义
 */

export type Priority = 'important' | 'urgent' | 'trivial';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  tags: string[];
  subtasks: SubTask[];
  dueDate: Date;
  reminderTime?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  archived: boolean;
}

export interface Reflection {
  id: string;
  taskId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskWithReflection extends Task {
  reflection?: Reflection;
}

export type SwipeAction = 'archive' | 'delete' | 'moveUp' | 'moveDown';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  border: string;
  card: string;
  cardBackground: string;
  error: string;
  success: string;
  warning: string;
}

export interface FilterOptions {
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  hasReflection?: boolean;
}

export enum ErrorType {
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  type: ErrorType;
  details?: any;

  constructor(type: ErrorType, message: string, details?: any) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = 'AppError';
  }
}
