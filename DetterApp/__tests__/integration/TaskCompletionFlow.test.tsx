/**
 * 任务完成和复盘流程集成测�?
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TaskProvider } from '../../src/contexts/TaskContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import TaskScreen from '../../src/screens/TaskScreen';
import TaskService from '../../src/services/TaskService';
import ReflectionService from '../../src/services/ReflectionService';
import { Task } from '../../src/models/types';

// Mock services
jest.mock('../../src/services/TaskService');
jest.mock('../../src/services/ReflectionService');
jest.mock('../../src/services/DatabaseService');

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <TaskProvider>{children}</TaskProvider>
  </ThemeProvider>
);

describe('Task Completion and Reflection Flow Integration Test', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: '完成报告',
    description: '项目总结报告',
    priority: 'important',
    tags: ['工作'],
    subtasks: [],
    dueDate: new Date(),
    completed: false,
    archived: false,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue([mockTask]);
    (TaskService.updateTask as jest.Mock).mockResolvedValue(undefined);
    (ReflectionService.createReflection as jest.Mock).mockImplementation(
      (data) =>
        Promise.resolve({
          ...data,
          id: 'reflection-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    );
  });

  it('should complete task and add reflection', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(getByText('完成报告')).toBeTruthy();
    });

    // Step 1: Mark task as complete
    const checkbox = getByTestId('task-checkbox-task-1');
    fireEvent.press(checkbox);

    // Step 2: Reflection panel should open
    await waitFor(() => {
      expect(getByPlaceholderText('如何Do Better�?)).toBeTruthy();
    });

    // Step 3: Enter reflection content
    const reflectionInput = getByPlaceholderText('如何Do Better�?);
    fireEvent.changeText(
      reflectionInput,
      '完成得很好，下次可以提前开始准�?
    );

    // Step 4: Save reflection
    const saveButton = getByText('保存');
    fireEvent.press(saveButton);

    // Verify task was updated
    await waitFor(() => {
      expect(TaskService.updateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'task-1',
          completed: true,
          completedAt: expect.any(Date),
        })
      );
    });

    // Verify reflection was created
    await waitFor(() => {
      expect(ReflectionService.createReflection).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 'task-1',
          content: '完成得很好，下次可以提前开始准�?,
        })
      );
    });
  });

  it('should allow completing task without reflection', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(getByText('完成报告')).toBeTruthy();
    });

    // Mark task as complete
    const checkbox = getByTestId('task-checkbox-task-1');
    fireEvent.press(checkbox);

    // Reflection panel should open
    await waitFor(() => {
      const closeButton = queryByText('跳过');
      if (closeButton) {
        fireEvent.press(closeButton);
      }
    });

    // Verify task was updated without reflection
    await waitFor(() => {
      expect(TaskService.updateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'task-1',
          completed: true,
        })
      );
    });
  });

  it('should handle task with subtasks completion', async () => {
    const taskWithSubtasks: Task = {
      ...mockTask,
      subtasks: [
        { id: 's1', title: '子任�?', completed: false },
        { id: 's2', title: '子任�?', completed: false },
      ],
    };

    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue([
      taskWithSubtasks,
    ]);

    const { getByTestId, getByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    await waitFor(() => {
      expect(getByText('完成报告')).toBeTruthy();
    });

    // Complete subtasks first
    const subtask1Checkbox = getByTestId('subtask-checkbox-s1');
    fireEvent.press(subtask1Checkbox);

    const subtask2Checkbox = getByTestId('subtask-checkbox-s2');
    fireEvent.press(subtask2Checkbox);

    // Then complete main task
    const mainCheckbox = getByTestId('task-checkbox-task-1');
    fireEvent.press(mainCheckbox);

    await waitFor(() => {
      expect(TaskService.updateTask).toHaveBeenCalled();
    });
  });

  it('should show completion animation', async () => {
    const { getByTestId, getByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    await waitFor(() => {
      expect(getByText('完成报告')).toBeTruthy();
    });

    const checkbox = getByTestId('task-checkbox-task-1');
    fireEvent.press(checkbox);

    // Animation should trigger (300ms delay)
    await waitFor(
      () => {
        expect(TaskService.updateTask).toHaveBeenCalled();
      },
      { timeout: 500 }
    );
  });
});
