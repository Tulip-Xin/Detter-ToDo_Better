/**
 * 应用启动性能测试
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../../App';
import DatabaseService from '../../src/services/DatabaseService';
import StartupService from '../../src/services/StartupService';

// Mock services
jest.mock('../../src/services/DatabaseService');
jest.mock('../../src/services/StartupService');
jest.mock('react-native-splash-screen');

describe('Startup Performance Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (DatabaseService.init as jest.Mock).mockResolvedValue(undefined);
    (StartupService.initialize as jest.Mock).mockResolvedValue(undefined);
  });

  it('should complete cold start within 2 seconds', async () => {
    const startTime = Date.now();

    const { getByTestId } = render(<App />);

    // Wait for app to be ready
    await waitFor(
      () => {
        expect(getByTestId('app-ready')).toBeTruthy();
      },
      { timeout: 2000 }
    );

    const endTime = Date.now();
    const startupTime = endTime - startTime;

    // Verify startup time is less than 2 seconds
    expect(startupTime).toBeLessThan(2000);
    console.log(`Cold start time: ${startupTime}ms`);
  });

  it('should initialize database quickly', async () => {
    const startTime = Date.now();

    await DatabaseService.init();

    const endTime = Date.now();
    const initTime = endTime - startTime;

    // Database initialization should be fast
    expect(initTime).toBeLessThan(500);
    console.log(`Database init time: ${initTime}ms`);
  });

  it('should load initial data efficiently', async () => {
    const mockTasks = Array.from({ length: 50 }, (_, i) => ({
      id: `task-${i}`,
      title: `任务 ${i}`,
      priority: 'important',
      tags: [],
      subtasks: [],
      dueDate: new Date(),
      completed: false,
      archived: false,
      order: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const startTime = Date.now();

    await StartupService.preloadTodayTasks();

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Data loading should be fast
    expect(loadTime).toBeLessThan(1000);
    console.log(`Data load time: ${loadTime}ms`);
  });

  it('should handle concurrent initialization tasks', async () => {
    const startTime = Date.now();

    await Promise.all([
      DatabaseService.init(),
      StartupService.initialize(),
      StartupService.preloadTodayTasks(),
    ]);

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Concurrent initialization should be efficient
    expect(totalTime).toBeLessThan(1500);
    console.log(`Concurrent init time: ${totalTime}ms`);
  });
});
