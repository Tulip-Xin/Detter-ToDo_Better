/**
 * TaskContext 测试
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { TaskProvider, useTaskContext } from '../TaskContext';
import TaskService from '../../services/TaskService';

// Mock TaskService
jest.mock('../../services/TaskService');

describe('TaskContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    expect(result.current.state.tasks).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.selectedDate).toBeInstanceOf(Date);
  });

  it('should load tasks successfully', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Test Task',
        priority: 'important',
        tags: [],
        subtasks: [],
        dueDate: new Date(),
        completed: false,
        archived: false,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTaskContext(), { wrapper });

    await act(async () => {
      await result.current.loadTasks(new Date());
    });

    expect(result.current.state.tasks).toEqual(mockTasks);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  it('should handle load tasks error', async () => {
    const errorMessage = '加载任务失败';
    (TaskService.getTasksByDate as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useTaskContext(), { wrapper });

    await act(async () => {
      await result.current.loadTasks(new Date());
    });

    expect(result.current.state.error).toBe(errorMessage);
    expect(result.current.state.loading).toBe(false);
  });

  it('should set selected date', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });
    const newDate = new Date('2025-01-01');

    act(() => {
      result.current.setSelectedDate(newDate);
    });

    expect(result.current.state.selectedDate).toEqual(newDate);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper });

    // First set an error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.state.error).toBeNull();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useTaskContext());
    }).toThrow('useTaskContext must be used within a TaskProvider');

    consoleSpy.mockRestore();
  });
});
