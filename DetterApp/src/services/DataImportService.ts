/**
 * DataImportService - 数据导入服务
 * 负责从 JSON 文件导入任务和复盘数据
 */

import RNFS from 'react-native-fs';
import DatabaseService from './DatabaseService';
import PermissionService from './PermissionService';
import { Task, Reflection, AppError, ErrorType } from '../models/types';

interface ImportData {
  version: string;
  exportDate: string;
  tasks: any[];
  reflections: any[];
}

interface ImportResult {
  success: boolean;
  tasksImported: number;
  reflectionsImported: number;
  errors: string[];
}

class DataImportService {
  /**
   * 从 JSON 文件导入数据
   * @param filePath 文件路径
   */
  async importFromJSON(filePath: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      tasksImported: 0,
      reflectionsImported: 0,
      errors: [],
    };

    try {
      // 检查存储权限
      const hasPermission = await PermissionService.checkStoragePermission();
      if (!hasPermission) {
        const granted = await PermissionService.requestStoragePermission();
        if (!granted) {
          throw new AppError(
            ErrorType.PERMISSION_ERROR,
            '需要存储权限才能导入数据'
          );
        }
      }

      // 读取文件内容
      const fileContent = await RNFS.readFile(filePath, 'utf8');

      // 解析 JSON
      const data: ImportData = JSON.parse(fileContent);

      // 验证数据格式
      const validationErrors = this.validateImportData(data);
      if (validationErrors.length > 0) {
        result.errors = validationErrors;
        return result;
      }

      // 导入数据
      await DatabaseService.transaction(async (tx) => {
        // 导入任务
        for (const taskData of data.tasks) {
          try {
            const task = this.parseTask(taskData);
            await this.importTask(tx, task);
            result.tasksImported++;
          } catch (error) {
            console.error('Error importing task:', error);
            result.errors.push(`导入任务失败: ${taskData.title || taskData.id}`);
          }
        }

        // 导入复盘笔记
        for (const reflectionData of data.reflections) {
          try {
            const reflection = this.parseReflection(reflectionData);
            await this.importReflection(tx, reflection);
            result.reflectionsImported++;
          } catch (error) {
            console.error('Error importing reflection:', error);
            result.errors.push(`导入复盘笔记失败: ${reflectionData.id}`);
          }
        }
      });

      result.success = true;
      console.log('Import completed:', result);
      return result;
    } catch (error) {
      console.error('Error importing data:', error);
      throw new AppError(
        ErrorType.UNKNOWN_ERROR,
        '导入数据失败',
        error
      );
    }
  }

  /**
   * 验证导入数据格式
   * @param data 导入数据
   */
  private validateImportData(data: any): string[] {
    const errors: string[] = [];

    if (!data) {
      errors.push('数据为空');
      return errors;
    }

    if (!data.version) {
      errors.push('缺少版本信息');
    }

    if (!Array.isArray(data.tasks)) {
      errors.push('任务数据格式错误');
    }

    if (!Array.isArray(data.reflections)) {
      errors.push('复盘数据格式错误');
    }

    return errors;
  }

  /**
   * 解析任务数据
   * @param taskData 原始任务数据
   */
  private parseTask(taskData: any): Task {
    return {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : [],
      dueDate: new Date(taskData.dueDate),
      reminderTime: taskData.reminderTime ? new Date(taskData.reminderTime) : undefined,
      completed: taskData.completed || false,
      completedAt: taskData.completedAt ? new Date(taskData.completedAt) : undefined,
      createdAt: new Date(taskData.createdAt),
      updatedAt: new Date(taskData.updatedAt),
      order: taskData.order || 0,
      archived: taskData.archived || false,
    };
  }

  /**
   * 解析复盘笔记数据
   * @param reflectionData 原始复盘数据
   */
  private parseReflection(reflectionData: any): Reflection {
    return {
      id: reflectionData.id,
      taskId: reflectionData.taskId,
      content: reflectionData.content,
      createdAt: new Date(reflectionData.createdAt),
      updatedAt: new Date(reflectionData.updatedAt),
    };
  }

  /**
   * 导入单个任务
   * @param tx 事务对象
   * @param task 任务对象
   */
  private async importTask(tx: any, task: Task): Promise<void> {
    // 检查任务是否已存在
    const [results] = await tx.executeSql(
      'SELECT id FROM tasks WHERE id = ?',
      [task.id]
    );

    if (results.rows.length > 0) {
      // 任务已存在，更新
      await tx.executeSql(
        `UPDATE tasks SET
          title = ?, description = ?, priority = ?, tags = ?,
          subtasks = ?, due_date = ?, reminder_time = ?,
          completed = ?, completed_at = ?, created_at = ?,
          updated_at = ?, task_order = ?, archived = ?
         WHERE id = ?`,
        [
          task.title,
          task.description || null,
          task.priority,
          JSON.stringify(task.tags),
          JSON.stringify(task.subtasks),
          task.dueDate.getTime(),
          task.reminderTime?.getTime() || null,
          task.completed ? 1 : 0,
          task.completedAt?.getTime() || null,
          task.createdAt.getTime(),
          task.updatedAt.getTime(),
          task.order,
          task.archived ? 1 : 0,
          task.id,
        ]
      );
    } else {
      // 任务不存在，插入
      await tx.executeSql(
        `INSERT INTO tasks (
          id, title, description, priority, tags, subtasks,
          due_date, reminder_time, completed, completed_at,
          created_at, updated_at, task_order, archived
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.id,
          task.title,
          task.description || null,
          task.priority,
          JSON.stringify(task.tags),
          JSON.stringify(task.subtasks),
          task.dueDate.getTime(),
          task.reminderTime?.getTime() || null,
          task.completed ? 1 : 0,
          task.completedAt?.getTime() || null,
          task.createdAt.getTime(),
          task.updatedAt.getTime(),
          task.order,
          task.archived ? 1 : 0,
        ]
      );
    }
  }

  /**
   * 导入单个复盘笔记
   * @param tx 事务对象
   * @param reflection 复盘笔记对象
   */
  private async importReflection(tx: any, reflection: Reflection): Promise<void> {
    // 检查复盘笔记是否已存在
    const [results] = await tx.executeSql(
      'SELECT id FROM reflections WHERE id = ?',
      [reflection.id]
    );

    if (results.rows.length > 0) {
      // 复盘笔记已存在，更新
      await tx.executeSql(
        `UPDATE reflections SET
          task_id = ?, content = ?, created_at = ?, updated_at = ?
         WHERE id = ?`,
        [
          reflection.taskId,
          reflection.content,
          reflection.createdAt.getTime(),
          reflection.updatedAt.getTime(),
          reflection.id,
        ]
      );
    } else {
      // 复盘笔记不存在，插入
      await tx.executeSql(
        `INSERT INTO reflections (id, task_id, content, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          reflection.id,
          reflection.taskId,
          reflection.content,
          reflection.createdAt.getTime(),
          reflection.updatedAt.getTime(),
        ]
      );
    }
  }

  /**
   * 选择文件（需要使用文件选择器库）
   * 这里返回一个示例路径，实际需要集成 react-native-document-picker
   */
  async pickFile(): Promise<string | null> {
    try {
      // TODO: 集成 react-native-document-picker
      // const result = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.allFiles],
      // });
      // return result.uri;

      // 暂时返回 null，提示用户手动输入文件路径
      console.log('File picker not implemented yet');
      return null;
    } catch (error) {
      console.error('Error picking file:', error);
      return null;
    }
  }
}

export default new DataImportService();
