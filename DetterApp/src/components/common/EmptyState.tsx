import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/**
 * 空状态组件
 * 用于在列表或内容区域为空时显示友好的提示
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📝',
  title,
  message,
  actionText,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionText && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * 任务列表空状态
 */
export const TaskEmptyState: React.FC<{ onAddTask?: () => void }> = ({ onAddTask }) => (
  <EmptyState
    icon="✨"
    title="暂无任务"
    message="点击下方按钮添加新任务，开始高效管理你的待办事项"
    actionText={onAddTask ? "添加任务" : undefined}
    onAction={onAddTask}
  />
);

/**
 * 已完成任务空状态
 */
export const CompletedTasksEmptyState: React.FC = () => (
  <EmptyState
    icon="🎯"
    title="还没有完成的任务"
    message="完成任务后，可以在这里查看并进行复盘"
  />
);

/**
 * 复盘列表空状态
 */
export const ReflectionEmptyState: React.FC = () => (
  <EmptyState
    icon="💭"
    title="暂无复盘记录"
    message="完成任务后记录复盘，帮助你持续改进"
  />
);

/**
 * 搜索结果空状态
 */
export const SearchEmptyState: React.FC<{ keyword: string }> = ({ keyword }) => (
  <EmptyState
    icon="🔍"
    title="未找到相关内容"
    message={`没有找到与"${keyword}"相关的任务或复盘`}
  />
);

/**
 * 筛选结果空状态
 */
export const FilterEmptyState: React.FC<{ onClearFilter?: () => void }> = ({ onClearFilter }) => (
  <EmptyState
    icon="🔎"
    title="没有符合条件的结果"
    message="尝试调整筛选条件或清除筛选"
    actionText={onClearFilter ? "清除筛选" : undefined}
    onAction={onClearFilter}
  />
);

/**
 * 统计数据空状态
 */
export const StatsEmptyState: React.FC = () => (
  <EmptyState
    icon="📊"
    title="暂无统计数据"
    message="完成一些任务后，这里会显示你的进度统计"
  />
);

/**
 * 优先级容器空状态（占位符）
 */
export const PriorityEmptyPlaceholder: React.FC<{
  priority: string;
  onAdd: () => void;
}> = ({ priority, onAdd }) => {
  const getPriorityText = () => {
    switch (priority) {
      case 'important':
        return '重要';
      case 'urgent':
        return '紧急';
      case 'trivial':
        return '琐事';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      style={styles.placeholderContainer}
      onPress={onAdd}
      activeOpacity={0.7}
    >
      <Text style={styles.placeholderText}>
        点击添加{getPriorityText()}ToDo
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    minHeight: 200,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
    maxWidth: 300,
  },
  actionButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.sm,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '600',
  },
  placeholderContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  placeholderText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default EmptyState;
