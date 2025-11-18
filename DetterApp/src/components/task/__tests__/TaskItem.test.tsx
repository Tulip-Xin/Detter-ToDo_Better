/**
 * TaskItem 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../TaskItem';
import { Task } from '../../../models/types';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: '测试任务',
    description: '这是一个测试任�?,
    priority: 'important',
    tags: ['工作', '紧�?],
    subtasks: [],
    dueDate: new Date('2025-01-15'),
    completed: false,
    archived: false,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const defaultProps = {
    task: mockTask,
    priorityOrder: 1,
    onComplete: jest.fn(),
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title', () => {
    const { getByText } = render(<TaskItem {...defaultProps} />);
    expect(getByText('测试任务')).toBeTruthy();
  });

  it('should render task description', () => {
    const { getByText } = render(<TaskItem {...defaultProps} />);
    expect(getByText('这是一个测试任�?)).toBeTruthy();
  });

  it('should render priority order number', () => {
    const { getByText } = render(<TaskItem {...defaultProps} />);
    expect(getByText('1')).toBeTruthy();
  });

  it('should render tags', () => {
    const { getByText } = render(<TaskItem {...defaultProps} />);
    expect(getByText('工作')).toBeTruthy();
    expect(getByText('紧�?)).toBeTruthy();
  });

  it('should call onComplete when checkbox is pressed', () => {
    const { getByTestId } = render(<TaskItem {...defaultProps} />);
    const checkbox = getByTestId('task-checkbox-1');
    fireEvent.press(checkbox);
    expect(defaultProps.onComplete).toHaveBeenCalledWith('1');
  });

  it('should call onPress when task item is pressed', () => {
    const { getByTestId } = render(<TaskItem {...defaultProps} />);
    const taskItem = getByTestId('task-item-1');
    fireEvent.press(taskItem);
    expect(defaultProps.onPress).toHaveBeenCalledWith('1');
  });

  it('should show completed state', () => {
    const completedTask = { ...mockTask, completed: true };
    const { getByTestId } = render(
      <TaskItem {...defaultProps} task={completedTask} />
    );
    const checkbox = getByTestId('task-checkbox-1');
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  it('should render subtasks count when present', () => {
    const taskWithSubtasks = {
      ...mockTask,
      subtasks: [
        { id: 's1', title: '子任�?', completed: false },
        { id: 's2', title: '子任�?', completed: true },
      ],
    };
    const { getByText } = render(
      <TaskItem {...defaultProps} task={taskWithSubtasks} />
    );
    expect(getByText(/1\/2/)).toBeTruthy();
  });

  it('should not render description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    const { queryByText } = render(
      <TaskItem {...defaultProps} task={taskWithoutDescription} />
    );
    expect(queryByText('这是一个测试任�?)).toBeNull();
  });

  it('should render with different priority', () => {
    const urgentTask = { ...mockTask, priority: 'urgent' as const };
    const { getByTestId } = render(
      <TaskItem {...defaultProps} task={urgentTask} />
    );
    const checkbox = getByTestId('task-checkbox-1');
    expect(checkbox).toBeTruthy();
  });

  it('should handle empty tags array', () => {
    const taskWithoutTags = { ...mockTask, tags: [] };
    const { queryByText } = render(
      <TaskItem {...defaultProps} task={taskWithoutTags} />
    );
    expect(queryByText('工作')).toBeNull();
  });
});
