/**
 * PriorityContainer - 优先级容器组件
 * 用于展示特定优先级的任务列表
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Task, Priority } from '../../models/types';
import { COLORS, SIZES, FONT_SIZES } from '../../utils/constants';

interface PriorityContainerProps {
  priority: Priority;
  tasks: Task[];
  onAddTask: (priority: Priority) => void;
  children?: React.ReactNode;
}

// 优先级配置
const PRIORITY_CONFIG = {
  important: {
    label: '重要',
    borderColor: COLORS.IMPORTANT_BORDER,
  },
  urgent: {
    label: '紧急',
    borderColor: COLORS.URGENT_BORDER,
  },
  trivial: {
    label: '琐事',
    borderColor: COLORS.TRIVIAL_BORDER,
  },
};

const PriorityContainer: React.FC<PriorityContainerProps> = ({
  priority,
  tasks,
  onAddTask,
  children,
}) => {
  const config = PRIORITY_CONFIG[priority];
  const isEmpty = tasks.length === 0;

  const handleAddPress = () => {
    onAddTask(priority);
  };

  return (
    <View style={[styles.container, { borderLeftColor: config.borderColor }]}>
      {/* 标题 */}
      <Text style={styles.title}>{config.label}</Text>

      {/* 任务列表或空状态 */}
      {isEmpty ? (
        <TouchableOpacity
          style={styles.emptyState}
          onPress={handleAddPress}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyText}>点击添加ToDo</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.taskList}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIORITY_CONTAINER_BG,
    borderLeftWidth: 4,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
    marginBottom: SIZES.MARGIN,
    minHeight: 80,
  },
  title: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  emptyState: {
    paddingVertical: SIZES.PADDING_LARGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PLACEHOLDER,
  },
  taskList: {
    // 任务列表容器
  },
});

export default PriorityContainer;
