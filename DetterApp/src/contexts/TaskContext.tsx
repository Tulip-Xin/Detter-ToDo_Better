/**
 * TaskContext - 任务状态管理
 * 使用 Context API + useReducer 管理任务状态
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import { Task, AppError, ErrorType } from '../models/types';
import TaskService from '../services/TaskService';

// 状态接口
interface TaskState {
  tasks: Task[];
  selectedDate: Date;
  loading: boolean;
  error: string | null;
}

// Action 类型
type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Context 接口
interface TaskContextType {
  state: TaskState;
  loadTasks: (date: Date) => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  uncompleteTask: (taskId: string) => Promise<void>;
  archiveTask: (taskId: string) => Promise<void>;
  updateTaskOrders: (updates: Array<{ id: string; order: number }>) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  clearError: () => void;
}

// 初始状态
const initialState: TaskState = {
  tasks: [],
  selectedDate: new Date(),
  loading: false,
  error: null,
};

// Reducer 函数
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        error: null,
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        error: null,
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        error: null,
      };

    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// 创建 Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider Props
interface TaskProviderProps {
  children: ReactNode;
}

// Provider 组件
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  /**
   * 加载指定日期的任务
   */
  const loadTasks = useCallback(async (date: Date) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await TaskService.getTasksByDate(date);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      const errorMessage =
        error instanceof AppError ? error.message : '加载任务失败';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading tasks:', error);
    }
  }, []);

  /**
   * 添加新任务
   */
  const addTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
      try {
        const newTask = await TaskService.createTask(taskData);
        dispatch({ type: 'ADD_TASK', payload: newTask });
        return newTask;
      } catch (error) {
        const errorMessage =
          error instanceof AppError ? error.message : '添加任务失败';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        console.error('Error adding task:', error);
        throw error;
      }
    },
    []
  );

  /**
   * 更新任务
   */
  const updateTask = useCallback(async (task: Task) => {
    try {
      await TaskService.updateTask(task);
      dispatch({ type: 'UPDATE_TASK', payload: task });
    } catch (error) {
      const errorMessage =
        error instanceof AppError ? error.message : '更新任务失败';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error updating task:', error);
      throw error;
    }
  }, []);

  /**
   * 删除任务
   */
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      const errorMessage =
        error instanceof AppError ? error.message : '删除任务失败';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error deleting task:', error);
      throw error;
    }
  }, []);

  /**
   * 完成任务
   */
  const completeTask = useCallback(
    async (taskId: string) => {
      try {
        await TaskService.completeTask(taskId);
        // 重新加载任务以获取最新状态
        const updatedTask = await TaskService.getTaskById(taskId);
        if (updatedTask) {
          dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
        }
      } catch (error) {
        const errorMessage =
          error instanceof AppError ? error.message : '完成任务失败';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        console.error('Error completing task:', error);
        throw error;
      }
    },
    []
  );

  /**
   * 取消完成任务
   */
  const uncompleteTask = useCallback(async (taskId: string) => {
    try {
      await TaskService.uncompleteTask(taskId);
      // 重新加载任务以获取最新状态
      const updatedTask = await TaskService.getTaskById(taskId);
      if (updatedTask) {
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      }
    } catch (error) {
      const errorMessage =
        error instanceof AppError ? error.message : '取消完成任务失败';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }, []);

  /**
   * 归档任务
   */
  const archiveTask = useCallback(async (taskId: string) => {
    try {
      await TaskService.archiveTask(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      const errorMessage =
        error instanceof AppError ? error.message : '归档任务失败';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error archiving task:', error);
      throw error;
    }
  }, []);

  /**
   * 批量更新任务顺序
   */
  const updateTaskOrders = useCallback(
    async (updates: Array<{ id: string; order: number }>) => {
      try {
        await TaskService.updateTaskOrders(updates);
        // 重新加载当前日期的任务
        await loadTasks(state.selectedDate);
      } catch (error) {
        const errorMessage =
          error instanceof AppError ? error.message : '更新任务顺序失败';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        console.error('Error updating task orders:', error);
        throw error;
      }
    },
    [loadTasks, state.selectedDate]
  );

  /**
   * 设置选中的日期
   */
  const setSelectedDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  }, []);

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: TaskContextType = {
    state,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    archiveTask,
    updateTaskOrders,
    setSelectedDate,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * 自定义 Hook 用于访问 TaskContext
 */
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
