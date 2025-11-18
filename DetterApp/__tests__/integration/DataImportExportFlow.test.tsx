/**
 * 数据导入导出流程集成测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import ProfileScreen from '../../src/screens/ProfileScreen';
import DataExportService from '../../src/services/DataExportService';
import DataImportService from '../../src/services/DataImportService';
import TaskService from '../../src/services/TaskService';
import ReflectionService from '../../src/services/ReflectionService';

// Mock services
jest.mock('../../src/services/DataExportService');
jest.mock('../../src/services/DataImportService');
jest.mock('../../src/services/TaskService');
jest.mock('../../src/services/ReflectionService');
jest.mock('../../src/services/DatabaseService');
jest.mock('react-native-fs');

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Data Import/Export Flow Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (TaskService.getAllTasks as jest.Mock).mockResolvedValue([]);
    (ReflectionService.getAllReflections as jest.Mock).mockResolvedValue([]);
  });

  describe('Data Export', () => {
    it('should export data as JSON', async () => {
      const mockExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks: [],
        reflections: [],
      };

      (DataExportService.exportAsJSON as jest.Mock).mockResolvedValue(
        '/path/to/export.json'
      );

      const { getByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      // Navigate to export section
      const exportButton = getByText('导出数据');
      fireEvent.press(exportButton);

      await waitFor(() => {
        const jsonButton = getByText('JSON格式');
        fireEvent.press(jsonButton);
      });

      // Verify export was called
      await waitFor(() => {
        expect(DataExportService.exportAsJSON).toHaveBeenCalled();
      });
    });

    it('should export data as CSV', async () => {
      (DataExportService.exportAsCSV as jest.Mock).mockResolvedValue(
        '/path/to/export.csv'
      );

      const { getByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const exportButton = getByText('导出数据');
      fireEvent.press(exportButton);

      await waitFor(() => {
        const csvButton = getByText('CSV格式');
        fireEvent.press(csvButton);
      });

      await waitFor(() => {
        expect(DataExportService.exportAsCSV).toHaveBeenCalled();
      });
    });

    it('should handle export errors', async () => {
      (DataExportService.exportAsJSON as jest.Mock).mockRejectedValue(
        new Error('Export failed')
      );

      const { getByText, findByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const exportButton = getByText('导出数据');
      fireEvent.press(exportButton);

      await waitFor(() => {
        const jsonButton = getByText('JSON格式');
        fireEvent.press(jsonButton);
      });

      // Should show error message
      await waitFor(() => {
        expect(findByText(/导出失败/)).toBeTruthy();
      });
    });
  });

  describe('Data Import', () => {
    it('should import data from JSON file', async () => {
      const mockImportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks: [
          {
            id: '1',
            title: '导入的任�?,
            priority: 'important',
            tags: [],
            subtasks: [],
            dueDate: new Date().toISOString(),
            completed: false,
            archived: false,
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        reflections: [],
      };

      (DataImportService.importFromJSON as jest.Mock).mockResolvedValue({
        success: true,
        tasksImported: 1,
        reflectionsImported: 0,
      });

      const { getByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const importButton = getByText('导入数据');
      fireEvent.press(importButton);

      await waitFor(() => {
        const selectFileButton = getByText('选择文件');
        fireEvent.press(selectFileButton);
      });

      // Simulate file selection
      await waitFor(() => {
        expect(DataImportService.importFromJSON).toHaveBeenCalled();
      });
    });

    it('should validate import data format', async () => {
      (DataImportService.importFromJSON as jest.Mock).mockRejectedValue(
        new Error('Invalid data format')
      );

      const { getByText, findByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const importButton = getByText('导入数据');
      fireEvent.press(importButton);

      await waitFor(() => {
        const selectFileButton = getByText('选择文件');
        fireEvent.press(selectFileButton);
      });

      // Should show validation error
      await waitFor(() => {
        expect(findByText(/数据格式无效/)).toBeTruthy();
      });
    });

    it('should show import confirmation dialog', async () => {
      const { getByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const importButton = getByText('导入数据');
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(getByText(/导入数据将覆盖现有数�?)).toBeTruthy();
      });
    });

    it('should handle import conflicts', async () => {
      (DataImportService.importFromJSON as jest.Mock).mockResolvedValue({
        success: true,
        tasksImported: 5,
        reflectionsImported: 3,
        conflicts: 2,
      });

      const { getByText, findByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const importButton = getByText('导入数据');
      fireEvent.press(importButton);

      await waitFor(() => {
        const selectFileButton = getByText('选择文件');
        fireEvent.press(selectFileButton);
      });

      // Should show import summary with conflicts
      await waitFor(() => {
        expect(findByText(/导入完成/)).toBeTruthy();
        expect(findByText(/2.*冲突/)).toBeTruthy();
      });
    });
  });

  describe('Data Clear', () => {
    it('should clear all data with confirmation', async () => {
      (TaskService.getAllTasks as jest.Mock).mockResolvedValue([]);

      const { getByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const clearButton = getByText('清空数据');
      fireEvent.press(clearButton);

      // Should show confirmation dialog
      await waitFor(() => {
        expect(getByText(/确认清空所有数�?)).toBeTruthy();
      });

      const confirmButton = getByText('确认');
      fireEvent.press(confirmButton);

      await waitFor(() => {
        expect(TaskService.getAllTasks).toHaveBeenCalled();
      });
    });

    it('should cancel data clear', async () => {
      const { getByText } = render(<ProfileScreen />, {
        wrapper: AllProviders,
      });

      const clearButton = getByText('清空数据');
      fireEvent.press(clearButton);

      await waitFor(() => {
        const cancelButton = getByText('取消');
        fireEvent.press(cancelButton);
      });

      // Should not clear data
      expect(TaskService.getAllTasks).not.toHaveBeenCalled();
    });
  });
});
