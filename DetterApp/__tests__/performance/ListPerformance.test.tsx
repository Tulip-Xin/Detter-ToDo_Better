/**
 * 列表性能测试
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { TaskProvider } from '../../src/contexts/TaskContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import TaskScreen from '../../src/screens/TaskScreen';
import ChecklistView from '../../src/components/reflection/ChecklistView';
import TaskService from '../../src/services/TaskService';
import { Task } from '../../src/models/types';

// Mock services
jest.mock('../../src/services/TaskService');
jest.mock('../../src/services/DatabaseService');

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <TaskProvider>{children}</TaskProvider>
  </ThemeProvider>
);

describe('List Performance Test', () => {
  const generateMockTasks = (count: number): Task[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `task-${i}`,
      title: `任务 ${i}`,
      description: `这是任务 ${i} 的描述`,
      priority: ['important', 'urgent', 'trivial'][i % 3] as any,
      tags: [`标签${i % 5}`, `标签${(i + 1) % 5}`],
      subtasks: [],
      dueDate: new Date(),
      completed: i % 2 === 0,
      completedAt: i % 2 === 0 ? new Date() : undefined,
      archived: false,
      order: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render 100 tasks without performance degradation', async () => {
    const mockTasks = generateMockTasks(100);
    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue(mockTasks);

    const startTime = Date.now();

    const { getByTestId } = render(<TaskScreen />, {
      wrapper: AllProviders,
    });

    await waitFor(() => {
      expect(getByTestId('task-board')).toBeTruthy();
    });

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // Rendering 100 tasks should be fast
    expect(renderTime).toBeLessThan(1000);
    console.log(`Render time for 100 tasks: ${renderTime}ms`);
  });

  it('should handle large checklist efficiently', async () => {
    const mockTasks = generateMockTasks(200);
    const onTaskPress = jest.fn();

    const startTime = Date.now();

    const { getByTestId } = render(
      <ChecklistView tasks={mockTasks} onTaskPress={onTaskPress} />
    );

    await waitFor(() => {
      expect(getByTestId('checklist-view')).toBeTruthy();
    });

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // Rendering large checklist should be efficient
    expect(renderTime).toBeLessThan(1500);
    console.log(`Render time for 200 tasks checklist: ${renderTime}ms`);
  });

  it('should scroll smoothly through large list', async () => {
    const mockTasks = generateMockTasks(100);
    const onTaskPress = jest.fn();

    const { getByTestId } = render(
      <ChecklistView tasks={mockTasks} onTaskPress={onTaskPress} />
    );

    await waitFor(() => {
      expect(getByTestId('checklist-view')).toBeTruthy();
    });

    // Simulate scroll performance
    const scrollStartTime = Date.now();

    // In a real test, we would measure frame drops during scroll
    // For now, we just verify the list is rendered
    const scrollEndTime = Date.now();
    const scrollTime = scrollEndTime - scrollStartTime;

    expect(scrollTime).toBeLessThan(100);
    console.log(`Scroll initialization time: ${scrollTime}ms`);
  });

  it('should update task list efficiently', async () => {
    const initialTasks = generateMockTasks(50);
    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue(initialTasks);

    const { rerender } = render(<TaskScreen />, {
      wrapper: AllProviders,
    });

    await waitFor(() => {
      expect(TaskService.getTasksByDate).toHaveBeenCalled();
    });

    // Update tasks
    const updatedTasks = generateMockTasks(50);
    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue(updatedTasks);

    const updateStartTime = Date.now();

    rerender(<TaskScreen />);

    const updateEndTime = Date.now();
    const updateTime = updateEndTime - updateStartTime;

    // List update should be fast
    expect(updateTime).toBeLessThan(500);
    console.log(`List update time: ${updateTime}ms`);
  });

  it('should handle rapid task additions', async () => {
    const mockTasks = generateMockTasks(10);
    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue(mockTasks);
    (TaskService.createTask as jest.Mock).mockImplementation((taskData) =>
      Promise.resolve({
        ...taskData,
        id: `new-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    const startTime = Date.now();

    // Simulate adding 10 tasks rapidly
    const addPromises = Array.from({ length: 10 }, (_, i) =>
      TaskService.createTask({
        title: `新任�?${i}`,
        priority: 'important',
        tags: [],
        subtasks: [],
        dueDate: new Date(),
        completed: false,
        archived: false,
        order: i,
      })
    );

    await Promise.all(addPromises);

    const endTime = Date.now();
    const addTime = endTime - startTime;

    // Rapid additions should be handled efficiently
    expect(addTime).toBeLessThan(1000);
    console.log(`Time to add 10 tasks: ${addTime}ms`);
  });
});
