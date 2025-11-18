/**
 * 任务创建流程集成测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TaskProvider } from '../../src/contexts/TaskContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import TaskScreen from '../../src/screens/TaskScreen';
import TaskService from '../../src/services/TaskService';

// Mock services
jest.mock('../../src/services/TaskService');
jest.mock('../../src/services/DatabaseService');

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <TaskProvider>{children}</TaskProvider>
  </ThemeProvider>
);

describe('Task Creation Flow Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (TaskService.getTasksByDate as jest.Mock).mockResolvedValue([]);
    (TaskService.createTask as jest.Mock).mockImplementation((taskData) =>
      Promise.resolve({
        ...taskData,
        id: 'new-task-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  it('should complete full task creation flow', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    // Step 1: Open add task panel
    const addButton = getByTestId('add-task-button');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(getByPlaceholderText('准备做什么？')).toBeTruthy();
    });

    // Step 2: Enter task title
    const titleInput = getByPlaceholderText('准备做什么？');
    fireEvent.changeText(titleInput, '完成项目报告');

    // Step 3: Enter description
    const descriptionInput = getByPlaceholderText('描述');
    fireEvent.changeText(descriptionInput, '需要包含所有数据分�?);

    // Step 4: Select priority
    const importantButton = getByText('重要');
    fireEvent.press(importantButton);

    // Step 5: Save task
    const saveButton = getByText('添加');
    fireEvent.press(saveButton);

    // Verify task was created
    await waitFor(() => {
      expect(TaskService.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '完成项目报告',
          description: '需要包含所有数据分�?,
          priority: 'important',
        })
      );
    });
  });

  it('should handle task creation with subtasks', async () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    // Open add task panel
    const addButton = getByTestId('add-task-button');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(getByPlaceholderText('准备做什么？')).toBeTruthy();
    });

    // Enter task title
    const titleInput = getByPlaceholderText('准备做什么？');
    fireEvent.changeText(titleInput, '准备会议');

    // Add subtask
    const subtaskInput = getByPlaceholderText('添加子任�?);
    fireEvent.changeText(subtaskInput, '准备PPT');
    fireEvent.submitEditing(subtaskInput);

    // Add another subtask
    fireEvent.changeText(subtaskInput, '打印资料');
    fireEvent.submitEditing(subtaskInput);

    // Save task
    const saveButton = getByText('添加');
    fireEvent.press(saveButton);

    // Verify task was created with subtasks
    await waitFor(() => {
      expect(TaskService.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '准备会议',
          subtasks: expect.arrayContaining([
            expect.objectContaining({ title: '准备PPT' }),
            expect.objectContaining({ title: '打印资料' }),
          ]),
        })
      );
    });
  });

  it('should validate required fields', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    // Open add task panel
    const addButton = getByTestId('add-task-button');
    fireEvent.press(addButton);

    await waitFor(() => {
      const saveButton = queryByText('添加');
      // Save button should be disabled when title is empty
      expect(saveButton?.props.disabled).toBe(true);
    });
  });

  it('should handle task creation from empty priority container', async () => {
    const { getAllByText, getByPlaceholderText, getByText } = render(
      <TaskScreen />,
      { wrapper: AllProviders }
    );

    // Click on empty priority container placeholder
    const placeholders = getAllByText('点击添加ToDo');
    if (placeholders.length > 0) {
      fireEvent.press(placeholders[0]);

      await waitFor(() => {
        expect(getByPlaceholderText('准备做什么？')).toBeTruthy();
      });

      // Priority should be pre-selected
      const titleInput = getByPlaceholderText('准备做什么？');
      fireEvent.changeText(titleInput, '新任�?);

      const saveButton = getByText('添加');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(TaskService.createTask).toHaveBeenCalled();
      });
    }
  });
});
