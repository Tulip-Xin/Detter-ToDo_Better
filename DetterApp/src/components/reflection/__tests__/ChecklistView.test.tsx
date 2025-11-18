/**
 * ChecklistView 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChecklistView from '../ChecklistView';
import { Task } from '../../../models/types';

describe('ChecklistView', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: '已完成任�?',
      priority: 'important',
      tags: ['工作'],
      subtasks: [],
      dueDate: new Date('2025-01-15'),
      completed: true,
      completedAt: new Date('2025-01-15'),
      archived: false,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      reflection: {
        id: 'r1',
        taskId: '1',
        content: '复盘内容',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: '2',
      title: '已完成任�?',
      priority: 'urgent',
      tags: [],
      subtasks: [],
      dueDate: new Date('2025-01-14'),
      completed: true,
      completedAt: new Date('2025-01-14'),
      archived: false,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const defaultProps = {
    tasks: mockTasks,
    onTaskPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task list', () => {
    const { getByText } = render(<ChecklistView {...defaultProps} />);
    expect(getByText('已完成任�?')).toBeTruthy();
    expect(getByText('已完成任�?')).toBeTruthy();
  });

  it('should call onTaskPress when task is pressed', () => {
    const { getByText } = render(<ChecklistView {...defaultProps} />);
    const task = getByText('已完成任�?');
    fireEvent.press(task);
    expect(defaultProps.onTaskPress).toHaveBeenCalledWith('1');
  });

  it('should highlight tasks with reflection', () => {
    const { getByTestId } = render(<ChecklistView {...defaultProps} />);
    const taskWithReflection = getByTestId('checklist-item-1');
    expect(taskWithReflection.props.style).toMatchObject(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('should display completion date', () => {
    const { getAllByText } = render(<ChecklistView {...defaultProps} />);
    const dates = getAllByText(/2025/);
    expect(dates.length).toBeGreaterThan(0);
  });

  it('should display tags', () => {
    const { getByText } = render(<ChecklistView {...defaultProps} />);
    expect(getByText('工作')).toBeTruthy();
  });

  it('should show empty state when no tasks', () => {
    const { getByText } = render(
      <ChecklistView {...defaultProps} tasks={[]} />
    );
    expect(getByText(/暂无/)).toBeTruthy();
  });

  it('should sort tasks by completion date descending', () => {
    const { getAllByTestId } = render(<ChecklistView {...defaultProps} />);
    const items = getAllByTestId(/checklist-item-/);
    expect(items[0].props.testID).toBe('checklist-item-1');
  });
});
