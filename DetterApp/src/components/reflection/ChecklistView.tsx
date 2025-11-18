/**
 * ChecklistView - 清单列表视图
 * 以单列列表形式显示已完成的任务
 * 性能优化：使用React.memo、useCallback和优化的FlatList配置
 */
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { TaskWithReflection } from '../../models/types';
import { COLORS, FONT_SIZES, SIZES } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CompletedTasksEmptyState } from '../common/EmptyState';

interface ChecklistViewProps {
  tasks: TaskWithReflection[];
  onTaskPress: (taskId: string) => void;
}

// 提取ChecklistItem为独立组件并使用React.memo
const ChecklistItem = React.memo<{
  item: TaskWithReflection;
  onPress: (taskId: string) => void;
  themeText: string;
  themeBorder: string;
}>(({ item, onPress, themeText, themeBorder }) => {
  const hasReflection = !!item.reflection;
  const completedDate = useMemo(() => 
    item.completedAt
      ? format(item.completedAt, 'yyyy年MM月dd日', { locale: zhCN })
      : '',
    [item.completedAt]
  );

  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        hasReflection && styles.itemWithReflection,
        { borderColor: themeBorder },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        {/* 任务标题 */}
        <Text
          style={[styles.title, { color: themeText }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* 完成日期 */}
        <Text style={[styles.date, { color: themeText }]}>
          {completedDate}
        </Text>

        {/* 标签 */}
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 复盘状态指示 */}
        {hasReflection && (
          <View style={styles.reflectionBadge}>
            <Text style={styles.reflectionBadgeText}>思</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // 只在关键属性变化时重新渲染
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.updatedAt === nextProps.item.updatedAt &&
    prevProps.themeText === nextProps.themeText &&
    prevProps.themeBorder === nextProps.themeBorder
  );
});

const ChecklistView: React.FC<ChecklistViewProps> = ({ tasks, onTaskPress }) => {
  const { theme } = useTheme();

  const renderItem = useCallback(({ item }: { item: TaskWithReflection }) => {
    return (
      <ChecklistItem
        item={item}
        onPress={onTaskPress}
        themeText={theme.text}
        themeBorder={theme.border}
      />
    );
  }, [onTaskPress, theme.text, theme.border]);

  const keyExtractor = useCallback((item: TaskWithReflection) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 120, // 估算的项目高度
    offset: 120 * index,
    index,
  }), []);

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={[
        styles.listContainer,
        tasks.length === 0 && styles.emptyContainer,
      ]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<CompletedTasksEmptyState />}
      // 性能优化配置
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={5}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: SIZES.PADDING,
  },
  emptyContainer: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
    marginBottom: SIZES.MARGIN,
    borderWidth: 1,
  },
  itemWithReflection: {
    backgroundColor: COLORS.REFLECTION_ITEM_BG,
  },
  itemContent: {
    position: 'relative',
  },
  title: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: '600',
    marginBottom: 8,
    paddingRight: 40,
  },
  date: {
    fontSize: FONT_SIZES.SMALL,
    opacity: 0.6,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  reflectionBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reflectionBadgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '600',
  },
});

export default ChecklistView;
