/**
 * DataExportService - 数据导出服务
 * 负责导出任务和复盘数据为 JSON 或 CSV 格式
 */

import RNFS from 'react-native-fs';
import { Share, Platform } from 'react-native';
import { format } from 'date-fns';
import TaskService from './TaskService';
import ReflectionService from './ReflectionService';
import PermissionService from './PermissionService';
import { Task, Reflection, AppError, ErrorType } from '../models/types';

interface ExportData {
  version: string;
  exportDate: string;
  tasks: Task[];
  reflections: Reflection[];
}

class DataExportService {
  /**
   * 导出数据为 JSON 格式
   */
  async exportToJSON(): Promise<string> {
    try {
      // 检查存储权限
      const hasPermission = await PermissionService.checkStoragePermission();
      if (!hasPermission) {
        const granted = await PermissionService.requestStoragePermission();
        if (!granted) {
          throw new AppError(
            ErrorType.PERMISSION_ERROR,
            '需要存储权限才能导出数据'
          );
        }
      }

      // 获取所有数据
      const tasks = await TaskService.getAllTasks();
      const reflections = await ReflectionService.getAllReflections();

      // 构建导出数据
      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks,
        reflections,
      };

      // 转换为 JSON 字符串
      const jsonString = JSON.stringify(exportData, null, 2);

      // 生成文件名
      const fileName = `detter_backup_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // 写入文件
      await RNFS.writeFile(filePath, jsonString, 'utf8');

      console.log('Data exported to JSON:', filePath);
      return filePath;
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new AppError(
        ErrorType.UNKNOWN_ERROR,
        '导出 JSON 失败',
        error
      );
    }
  }

  /**
   * 导出数据为 CSV 格式
   */
  async exportToCSV(): Promise<string> {
    try {
      // 检查存储权限
      const hasPermission = await PermissionService.checkStoragePermission();
      if (!hasPermission) {
        const granted = await PermissionService.requestStoragePermission();
        if (!granted) {
          throw new AppError(
            ErrorType.PERMISSION_ERROR,
            '需要存储权限才能导出数据'
          );
        }
      }

      // 获取所有任务
      const tasks = await TaskService.getAllTasks();

      // CSV 表头
      const headers = [
        'ID',
        '标题',
        '描述',
        '优先级',
        '标签',
        '到期日期',
        '提醒时间',
        '完成状态',
        '完成时间',
        '创建时间',
      ];

      // 构建 CSV 内容
      const rows = tasks.map((task) => [
        task.id,
        this.escapeCsvValue(task.title),
        this.escapeCsvValue(task.description || ''),
        task.priority,
        task.tags.join(';'),
        format(task.dueDate, 'yyyy-MM-dd HH:mm:ss'),
        task.reminderTime ? format(task.reminderTime, 'yyyy-MM-dd HH:mm:ss') : '',
        task.completed ? '已完成' : '未完成',
        task.completedAt ? format(task.completedAt, 'yyyy-MM-dd HH:mm:ss') : '',
        format(task.createdAt, 'yyyy-MM-dd HH:mm:ss'),
      ]);

      // 组合 CSV 内容
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      // 添加 BOM 以支持 Excel 正确显示中文
      const csvWithBOM = '\uFEFF' + csvContent;

      // 生成文件名
      const fileName = `detter_tasks_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // 写入文件
      await RNFS.writeFile(filePath, csvWithBOM, 'utf8');

      console.log('Data exported to CSV:', filePath);
      return filePath;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new AppError(
        ErrorType.UNKNOWN_ERROR,
        '导出 CSV 失败',
        error
      );
    }
  }

  /**
   * 分享导出的文件
   * @param filePath 文件路径
   */
  async shareFile(filePath: string): Promise<void> {
    try {
      const fileUrl = Platform.OS === 'android' ? `file://${filePath}` : filePath;

      await Share.share({
        title: '导出 Detter 数据',
        message: '分享 Detter 备份文件',
        url: fileUrl,
      });

      console.log('File shared:', filePath);
    } catch (error) {
      console.error('Error sharing file:', error);
      throw new AppError(
        ErrorType.UNKNOWN_ERROR,
        '分享文件失败',
        error
      );
    }
  }

  /**
   * 删除导出的文件
   * @param filePath 文件路径
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath);
        console.log('File deleted:', filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  /**
   * 转义 CSV 值（处理逗号、引号、换行符）
   * @param value 原始值
   */
  private escapeCsvValue(value: string): string {
    if (!value) return '';

    // 如果包含逗号、引号或换行符，需要用引号包裹
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      // 将引号转义为两个引号
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }

    return value;
  }

  /**
   * 获取导出文件列表
   */
  async getExportedFiles(): Promise<string[]> {
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const exportFiles = files
        .filter(
          (file) =>
            file.name.startsWith('detter_backup_') ||
            file.name.startsWith('detter_tasks_')
        )
        .map((file) => file.path);

      return exportFiles;
    } catch (error) {
      console.error('Error getting exported files:', error);
      return [];
    }
  }
}

export default new DataExportService();
