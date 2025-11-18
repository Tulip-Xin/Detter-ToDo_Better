/**
 * 复盘反思屏幕（思）
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, ANIMATION_DURATION } from '../utils/constants';
import ReflectionService from '../services/ReflectionService';
import { TaskWithReflection, FilterOptions } from '../models/types';
import { ChecklistView, CardListView } from '../components/reflection';
import { ReflectionScreenProps } from '../navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import {
  searchAndFilterTasks,
  extractUniqueTags,
  hasActiveFilters,
} from '../utils/filterUtils';

type ViewMode = 'card' | 'checklist';

const ReflectionScreen: React.FC<ReflectionScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [completedTasks, setCompletedTasks] = useState<TaskWithReflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索和筛选状态
  const [showSearch, setShowSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  // 加载已完成的任务
  const loadCompletedTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await ReflectionService.getCompletedTasksWithReflections();
      setCompletedTasks(tasks);
    } catch (err) {
      console.error('Error loading completed tasks:', err);
      setError('加载已完成任务失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompletedTasks();
  }, [loadCompletedTasks]);

  // 当屏幕获得焦点时重新加载数据（从详情页返回时刷新）
  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();
    }, [loadCompletedTasks])
  );

  // 应用搜索和筛选后的任务列表
  const filteredTasks = useMemo(() => {
    return searchAndFilterTasks(completedTasks, searchKeyword, filters);
  }, [completedTasks, searchKeyword, filters]);

  // 提取所有可用标签
  const availableTags = useMemo(() => {
    return extractUniqueTags(completedTasks);
  }, [completedTasks]);

  // 检查是否有活动的筛选
  const hasFilters = useMemo(() => {
    return hasActiveFilters(filters);
  }, [filters]);

  // 切换视图模式
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 处理任务点击 - 导航到复盘详情页面
  const handleTaskPress = (taskId: string) => {
    navigation.navigate('ReflectionDetail', { taskId });
  };

  // 处理搜索
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  // 处理筛选
  const handleApplyFilter = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  // 清除所有搜索和筛选
  const handleClearAll = useCallback(() => {
    setSearchKeyword('');
    setFilters({});
    setShowSearch(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 顶部Tab切换 */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === 'card' && styles.tabActive,
            ]}
            onPress={() => handleViewModeChange('card')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.text },
                viewMode === 'card' && styles.tabTextActive,
              ]}
            >
              卡片列表
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === 'checklist' && styles.tabActive,
            ]}
            onPress={() => handleViewModeChange('checklist')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.text },
                viewMode === 'checklist' && styles.tabTextActive,
              ]}
            >
              清单列表
            </Text>
          </TouchableOpacity>
        </View>

        {/* 搜索和筛选按钮 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowFilter(true)}
          >
            <Text style={[styles.icon, { color: theme.text }]}>
              {hasFilters ? '🔽' : '☰'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Text style={[styles.icon, { color: theme.text }]}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 搜索栏 */}
      <SearchBar
        visible={showSearch}
        onSearch={handleSearch}
        onClose={() => setShowSearch(false)}
        placeholder="搜索任务、标签或复盘内容..."
      />

      {/* 活动筛选提示 */}
      {(searchKeyword || hasFilters) && (
        <View style={[styles.filterIndicator, { backgroundColor: theme.card }]}>
          <Text style={[styles.filterIndicatorText, { color: theme.text }]}>
            {searchKeyword && `搜索: "${searchKeyword}"`}
            {searchKeyword && hasFilters && ' | '}
            {hasFilters && '已应用筛选'}
          </Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={[styles.clearAllText, { color: COLORS.PRIMARY }]}>
              清除全部
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 内容区域 */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadCompletedTasks}
          >
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : completedTasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            还没有已完成的任务
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.text }]}>
            完成任务后可以在这里进行复盘
          </Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            没有找到匹配的任务
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.text }]}>
            尝试调整搜索关键词或筛选条件
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
          >
            <Text style={[styles.clearButtonText, { color: COLORS.PRIMARY }]}>
              清除搜索和筛选
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {viewMode === 'card' ? (
            <CardListView
              tasks={filteredTasks}
              onTaskPress={handleTaskPress}
            />
          ) : (
            <ChecklistView
              tasks={filteredTasks}
              onTaskPress={handleTaskPress}
            />
          )}
        </>
      )}

      {/* 筛选面板 */}
      <FilterPanel
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilter}
        availableTags={availableTags}
        currentFilters={filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: COLORS.WHITE,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    fontSize: 20,
  },
  filterIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  filterIndicatorText: {
    fontSize: 14,
    flex: 1,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
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
});

export default ReflectionScreen;
