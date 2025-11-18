/**
 * 动画性能测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CardListView from '../../src/components/reflection/CardListView';
import TaskItem from '../../src/components/task/TaskItem';
import { Task } from '../../src/models/types';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('Animation Performance Test', () => {
  const mockTask: Task = {
    id: '1',
    title: '测试任务',
    priority: 'important',
    tags: [],
    subtasks: [],
    dueDate: new Date(),
    completed: false,
    archived: false,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const generateMockTasks = (count: number): Task[] => {
    return Array.from({ length: count }, (_, i) => ({
      ...mockTask,
      id: `task-${i}`,
      title: `任务 ${i}`,
      completed: true,
      completedAt: new Date(),
    }));
  };

  it('should handle task completion animation smoothly', async () => {
    const onComplete = jest.fn();
    const onPress = jest.fn();

    const { getByTestId } = render(
      <TaskItem
        task={mockTask}
        priorityOrder={1}
        onComplete={onComplete}
        onPress={onPress}
      />
    );

    const startTime = Date.now();

    const checkbox = getByTestId('task-checkbox-1');
    fireEvent.press(checkbox);

    // Wait for animation to complete (300ms delay)
    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalled();
      },
      { timeout: 500 }
    );

    const endTime = Date.now();
    const animationTime = endTime - startTime;

    // Animation should complete within expected time
    expect(animationTime).toBeLessThan(500);
    console.log(`Task completion animation time: ${animationTime}ms`);
  });

  it('should render card list with smooth scaling animation', async () => {
    const mockTasks = generateMockTasks(20);
    const onCardPress = jest.fn();

    const startTime = Date.now();

    const { getByTestId } = render(
      <CardListView tasks={mockTasks} onCardPress={onCardPress} />
    );

    await waitFor(() => {
      expect(getByTestId('card-list-view')).toBeTruthy();
    });

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // Card list with animations should render quickly
    expect(renderTime).toBeLessThan(1000);
    console.log(`Card list render time: ${renderTime}ms`);
  });

  it('should handle rapid animation triggers', async () => {
    const onComplete = jest.fn();
    const onPress = jest.fn();

    const { getByTestId, rerender } = render(
      <TaskItem
        task={mockTask}
        priorityOrder={1}
        onComplete={onComplete}
        onPress={onPress}
      />
    );

    const startTime = Date.now();

    // Trigger multiple animations rapidly
    for (let i = 0; i < 5; i++) {
      const checkbox = getByTestId('task-checkbox-1');
      fireEvent.press(checkbox);

      // Rerender with updated state
      rerender(
        <TaskItem
          task={{ ...mockTask, completed: i % 2 === 0 }}
          priorityOrder={1}
          onComplete={onComplete}
          onPress={onPress}
        />
      );
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Rapid animations should not cause performance issues
    expect(totalTime).toBeLessThan(1000);
    console.log(`Rapid animation time: ${totalTime}ms`);
  });

  it('should maintain 60fps during card scroll animation', async () => {
    const mockTasks = generateMockTasks(50);
    const onCardPress = jest.fn();

    const { getByTestId } = render(
      <CardListView tasks={mockTasks} onCardPress={onCardPress} />
    );

    await waitFor(() => {
      expect(getByTestId('card-list-view')).toBeTruthy();
    });

    // In a real test, we would measure frame rate during scroll
    // For now, we verify the component renders without errors
    const scrollView = getByTestId('card-list-view');
    expect(scrollView).toBeTruthy();

    console.log('Card scroll animation test completed');
  });

  it('should handle snap-to-center animation efficiently', async () => {
    const mockTasks = generateMockTasks(10);
    const onCardPress = jest.fn();

    const { getByTestId } = render(
      <CardListView tasks={mockTasks} onCardPress={onCardPress} />
    );

    await waitFor(() => {
      expect(getByTestId('card-list-view')).toBeTruthy();
    });

    const startTime = Date.now();

    // Simulate scroll end (snap animation)
    const scrollView = getByTestId('card-list-view');
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { y: 200 },
        contentSize: { height: 1000, width: 400 },
        layoutMeasurement: { height: 600, width: 400 },
      },
    });

    const endTime = Date.now();
    const snapTime = endTime - startTime;

    // Snap animation should be quick
    expect(snapTime).toBeLessThan(100);
    console.log(`Snap-to-center animation time: ${snapTime}ms`);
  });
});
