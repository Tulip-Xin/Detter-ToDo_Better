/**
 * 复盘详情屏幕
 * 显示任务详情并允许用户输入或编辑复盘笔记
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS } from '../utils/constants';
import { ReflectionDetailScreenProps } from '../navigation/types';
import ReflectionService from '../services/ReflectionService';
import { TaskWithReflection } from '../models/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ReflectionDetailScreen: React.FC<ReflectionDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { theme } = useTheme();
  const { taskId } = route.params || {};

  const [task, setTask] = useState<TaskWithReflection | null>(null);
  const [reflectionContent, setReflectionContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载任务和复盘数据
  const loadTaskWithReflection = useCallback(async () => {
    if (!taskId) {
      setError('任务ID不存在');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const taskData = await ReflectionService.getTaskWithReflection(taskId);
      if (taskData) {
        setTask(taskData);
        setReflectionContent(taskData.reflection?.content || '');
      } else {
        setError('任务不存在');
      }
    } catch (err) {
      console.error('Error loading task with reflection:', err);
      setError('加载任务失败');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTaskWithReflection();
  }, [loadTaskWithReflection]);

  // 保存复盘笔记
  const handleSave = async () => {
    if (!task) return;

    // 验证内容不为空
    if (!reflectionContent.trim()) {
      Alert.alert('提示', '请输入复盘内容');
      return;
    }

    setSaving(true);
    try {
      if (task.reflection) {
        // 更新现有复盘笔记
        await ReflectionService.updateReflection({
          ...task.reflection,
          content: reflectionContent.trim(),
        });
      } else {
        // 创建新复盘笔记
        await ReflectionService.createReflection({
          taskId: task.id,
          content: reflectionContent.trim(),
        });
      }

      Alert.alert('成功', '复盘笔记已保存', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      console.error('Error saving reflection:', err);
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 设置导航栏右侧保存按钮
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving || !reflectionContent.trim()}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          ) : (
            <Text
              style={[
                styles.saveButtonText,
                !reflectionContent.trim() && styles.saveButtonTextDisabled,
              ]}
            >
              保存
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, reflectionContent, saving, handleSave]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            {error || '任务不存在'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadTaskWithReflection}
          >
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* 任务信息区域 */}
      <View style={[styles.taskInfoContainer, { backgroundColor: theme.card }]}>
        {/* 任务标题 */}
        <Text style={[styles.taskTitle, { color: theme.text }]}>
          {task.title}
        </Text>

        {/* 任务描述 */}
        {task.description && (
          <Text style={[styles.taskDescription, { color: theme.text }]}>
            {task.description}
          </Text>
        )}

        {/* 标签 */}
        {task.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {task.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 完成日期 */}
        {task.completedAt && (
          <View style={styles.completedDateContainer}>
            <Text style={[styles.completedDateLabel, { color: theme.text }]}>
              完成时间：
            </Text>
            <Text style={[styles.completedDate, { color: theme.text }]}>
              {format(task.completedAt, 'yyyy年MM月dd日 HH:mm', {
                locale: zhCN,
              })}
            </Text>
          </View>
        )}
      </View>

      {/* 复盘输入区域 */}
      <View style={styles.reflectionContainer}>
        <Text style={[styles.reflectionLabel, { color: theme.text }]}>
          复盘笔记
        </Text>
        <TextInput
          style={[
            styles.reflectionInput,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="思：这次做得怎么样？下次如何做得更好？"
          placeholderTextColor={theme.text + '80'}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          value={reflectionContent}
          onChangeText={setReflectionContent}
          autoFocus={!task.reflection}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    opacity: 0.4,
  },
  taskInfoContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: COLORS.PRIMARY,
    fontSize: 12,
    fontWeight: '500',
  },
  completedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedDateLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  completedDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  reflectionContainer: {
    flex: 1,
  },
  reflectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  reflectionInput: {
    minHeight: 200,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
  },
});

export default ReflectionDetailScreen;
