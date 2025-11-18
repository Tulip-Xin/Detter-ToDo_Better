/**
 * TaskItem - 任务项组件
 * 显示单个任务的详细信息，包括复选框、标题、描述和标签
 * 性能优化：使用React.memo和useCallback避免不必要的重渲染
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Task } from '../../models/types';
import { COLORS, SIZES, FONT_SIZES, ANIMATION_DURATION } from '../../utils/constants';

interface TaskItemProps {
  task: Task;
  priorityOrder: number;
  onComplete: (taskId: string) => void;
  onPress: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({
  task,
  priorityOrder,
  onComplete,
  onPress,
}) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleCheckboxPress = useCallback(() => {
    if (!task.completed) {
      // 触发完成动画
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: ANIMATION_DURATION.NORMAL,
        useNativeDriver: true,
      }).start(() => {
        onComplete(task.id);
      });
    } else {
      onComplete(task.id);
    }
  }, [task.completed, task.id, onComplete, fadeAnim]);

  const handleTaskPress = useCallback(() => {
    onPress(task.id);
  }, [task.id, onPress]);

  // 计算子任务完成进度
  const subtaskProgress = useMemo(() => {
    if (task.subtasks.length === 0) return null;
    const completed = task.subtasks.filter(st => st.completed).length;
    return { completed, total: task.subtasks.length };
  }, [task.subtasks]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.content}
        onPress={handleTaskPress}
        activeOpacity={0.7}
      >
        {/* 左侧复选框 */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            task.completed && styles.checkboxCompleted,
          ]}
          onPress={handleCheckboxPress}
          activeOpacity={0.7}
        >
          {task.completed ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            <Text style={styles.priorityNumber}>{priorityOrder}</Text>
          )}
        </TouchableOpacity>

        {/* 中间任务信息 */}
        <View style={styles.taskInfo}>
          {/* 任务标题 */}
          <Text
            style={[
              styles.title,
              task.completed && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* 任务描述 */}
          {task.description && (
            <Text
              style={styles.description}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}

          {/* 标签列表 */}
          {task.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {task.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 子任务进度 */}
          {subtaskProgress && (
            <View style={styles.subtaskProgress}>
              <Text style={styles.subtaskText}>
                {subtaskProgress.completed}/{subtaskProgress.total} 子任务
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数，只在关键属性变化时重新渲染
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.completed === nextProps.task.completed &&
    prevProps.task.updatedAt === nextProps.task.updatedAt &&
    prevProps.priorityOrder === nextProps.priorityOrder
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.MARGIN_SMALL,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: SIZES.BORDER_RADIUS_SMALL,
    borderWidth: 2,
    borderColor: COLORS.TEXT_SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.MARGIN,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.SUCCESS,
    borderColor: COLORS.SUCCESS,
  },
  priorityNumber: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  checkmark: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.MARGIN_SMALL / 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.TEXT_SECONDARY,
  },
  description: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.MARGIN_SMALL / 2,
  },
  tag: {
    backgroundColor: COLORS.DATE_SELECTOR_BG,
    borderRadius: SIZES.BORDER_RADIUS_LARGE,
    paddingHorizontal: SIZES.PADDING_SMALL,
    paddingVertical: 4,
    marginRight: SIZES.MARGIN_SMALL / 2,
    marginBottom: SIZES.MARGIN_SMALL / 2,
  },
  tagText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  subtaskProgress: {
    marginTop: SIZES.MARGIN_SMALL / 2,
  },
  subtaskText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default TaskItem;
