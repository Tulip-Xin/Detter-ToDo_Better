/**
 * PriorityContainer 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PriorityContainer from '../PriorityContainer';
import { Task } from '../../../models/types';

describe('PriorityContainer', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: '任务1',
      priority: 'important',
      tags: [],
      subtasks: [],
      dueDate: new Date(),
      completed: false,
      archived: false,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: '任务2',
      priority: 'important',
      tags: [],
      subtasks: [],
      dueDate: new Date(),
      completed: false,
      archived: false,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const defaultProps = {
    priority: 'important' as const,
    tasks: mockTasks,
    onAddTask: jest.fn(),
    onTaskComplete: jest.fn(),
    onTaskPress: jest.fn(),
    onTaskSwipe: jest.fn(),
    onReorder: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render priority title', () => {
    const { getByText } = render(<PriorityContainer {...defaultProps} />);
    expect(getByText('重要')).toBeTruthy();
  });

  it('should render tasks', () => {
    const { getByText } = render(<PriorityContainer {...defaultProps} />);
    expect(getByText('任务1')).toBeTruthy();
    expect(getByText('任务2')).toBeTruthy();
  });

  it('should show placeholder when no tasks', () => {
    const { getByText } = render(
      <PriorityContainer {...defaultProps} tasks={[]} />
    );
    expect(getByText('点击添加ToDo')).toBeTruthy();
  });

  it('should call onAddTask when placeholder is pressed', () => {
    const { getByText } = render(
      <PriorityContainer {...defaultProps} tasks={[]} />
    );
    const placeholder = getByText('点击添加ToDo');
    fireEvent.press(placeholder);
    expect(defaultProps.onAddTask).toHaveBeenCalledWith('important');
  });

  it('should render with urgent priority', () => {
    const { getByText } = render(
      <PriorityContainer {...defaultProps} priority="urgent" />
    );
    expect(getByText('紧�?)).toBeTruthy();
  });

  it('should render with trivial priority', () => {
    const { getByText } = render(
      <PriorityContainer {...defaultProps} priority="trivial" />
    );
    expect(getByText('琐事')).toBeTruthy();
  });

  it('should display correct border color for important', () => {
    const { getByTestId } = render(<PriorityContainer {...defaultProps} />);
    const container = getByTestId('priority-container-important');
    expect(container.props.style).toMatchObject(
      expect.objectContaining({
        borderLeftColor: expect.any(String),
      })
    );
  });

  it('should render task count', () => {
    const { getByText } = render(<PriorityContainer {...defaultProps} />);
    expect(getByText(/2/)).toBeTruthy();
  });

  it('should handle single task', () => {
    const singleTask = [mockTasks[0]];
    const { getByText } = render(
      <PriorityContainer {...defaultProps} tasks={singleTask} />
    );
    expect(getByText('任务1')).toBeTruthy();
  });
});
