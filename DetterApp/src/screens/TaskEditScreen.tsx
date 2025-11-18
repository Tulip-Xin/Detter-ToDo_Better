/**
 * TaskEditScreen - 任务编辑页面
 * 复用TaskAddPanel组件逻辑，预填充现有任务数据
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { TaskEditScreenProps } from '../navigation/types';
import { useTaskContext } from '../contexts/TaskContext';
import { useTheme } from '../contexts/ThemeContext';
import TaskService from '../services/TaskService';
import { Task } from '../models/types';
import { TaskEditPanel } from '../components/task';

const TaskEditScreen: React.FC<TaskEditScreenProps> = ({ route, navigation }) => {
  const { taskId } = route.params || {};
  const { updateTask, deleteTask } = useTaskContext();
  const { theme } = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载任务数据
  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) {
        setError('任务ID不存在');
        setLoading(false);
        return;
      }

      try {
        const taskData = await TaskService.getTaskById(taskId);
        if (taskData) {
          setTask(taskData);
        } else {
          setError('任务不存在');
        }
      } catch (err) {
        console.error('Error loading task:', err);
        setError('加载任务失败');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  // 处理保存
  const handleSave = async (updatedTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!task) return;

    try {
      const updatedTask: Task = {
        ...task,
        ...updatedTaskData,
        updatedAt: new Date(),
      };

      await updateTask(updatedTask);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('错误', '更新任务失败，请重试');
    }
  };

  // 处理删除
  const handleDelete = () => {
    if (!task) return;

    Alert.alert(
      '确认删除',
      '确定要删除这个任务吗？此操作无法撤销。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('错误', '删除任务失败，请重试');
            }
          },
        },
      ]
    );
  };

  // 处理取消
  const handleCancel = () => {
    navigation.goBack();
  };

  // 加载中状态
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            加载中...
          </Text>
        </View>
      </View>
    );
  }

  // 错误状态
  if (error || !task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error || '任务不存在'}
          </Text>
        </View>
      </View>
    );
  }

  // 正常显示编辑面板
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TaskEditPanel
        task={task}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TaskEditScreen;
