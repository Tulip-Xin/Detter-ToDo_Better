/**
 * SwipeableTaskItem - 支持手势交互的任务项组件
 * 支持左滑显示操作菜单（归档、删除、上移、下移）
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Task, SwipeAction } from '../../models/types';
import { COLORS, SIZES, FONT_SIZES } from '../../utils/constants';
import TaskItem from './TaskItem';

interface SwipeableTaskItemProps {
  task: Task;
  priorityOrder: number;
  onComplete: (taskId: string) => void;
  onPress: (taskId: string) => void;
  onSwipeAction: (taskId: string, action: SwipeAction) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const SwipeableTaskItem: React.FC<SwipeableTaskItemProps> = ({
  task,
  priorityOrder,
  onComplete,
  onPress,
  onSwipeAction,
  isFirst = false,
  isLast = false,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const handleAction = (action: SwipeAction) => {
    if (action === 'delete') {
      Alert.alert(
        '删除任务',
        '确定要删除这个任务吗？',
        [
          {
            text: '取消',
            style: 'cancel',
            onPress: () => swipeableRef.current?.close(),
          },
          {
            text: '删除',
            style: 'destructive',
            onPress: () => {
              swipeableRef.current?.close();
              onSwipeAction(task.id, action);
            },
          },
        ]
      );
    } else {
      swipeableRef.current?.close();
      onSwipeAction(task.id, action);
    }
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View style={styles.actionsContainer}>
        {/* 归档按钮 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.archiveButton]}
          onPress={() => handleAction('archive')}
        >
          <Text style={styles.actionText}>归档</Text>
        </TouchableOpacity>

        {/* 删除按钮 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleAction('delete')}
        >
          <Text style={styles.actionText}>删除</Text>
        </TouchableOpacity>

        {/* 上移按钮 */}
        {!isFirst && (
          <TouchableOpacity
            style={[styles.actionButton, styles.moveButton]}
            onPress={() => handleAction('moveUp')}
          >
            <Text style={styles.actionText}>上移</Text>
          </TouchableOpacity>
        )}

        {/* 下移按钮 */}
        {!isLast && (
          <TouchableOpacity
            style={[styles.actionButton, styles.moveButton]}
            onPress={() => handleAction('moveDown')}
          >
            <Text style={styles.actionText}>下移</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <TaskItem
        task={task}
        priorityOrder={priorityOrder}
        onComplete={onComplete}
        onPress={onPress}
      />
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.MARGIN_SMALL,
  },
  actionButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  archiveButton: {
    backgroundColor: COLORS.WARNING,
  },
  deleteButton: {
    backgroundColor: COLORS.ERROR,
  },
  moveButton: {
    backgroundColor: COLORS.TEXT_SECONDARY,
  },
  actionText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
  },
});

export default SwipeableTaskItem;
