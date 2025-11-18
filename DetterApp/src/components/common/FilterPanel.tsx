/**
 * 筛选面板组件
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/constants';
import { FilterOptions } from '../../models/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar } from './Calendar';

interface FilterPanelProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  availableTags: string[];
  currentFilters: FilterOptions;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  visible,
  onClose,
  onApply,
  availableTags,
  currentFilters,
}) => {
  const { theme } = useTheme();
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | undefined>(
    currentFilters.dateRange
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentFilters.tags || []
  );
  const [hasReflection, setHasReflection] = useState<boolean | undefined>(
    currentFilters.hasReflection
  );
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  useEffect(() => {
    if (visible) {
      setDateRange(currentFilters.dateRange);
      setSelectedTags(currentFilters.tags || []);
      setHasReflection(currentFilters.hasReflection);
    }
  }, [visible, currentFilters]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleReflectionStatusToggle = (status: boolean | undefined) => {
    setHasReflection(status);
  };

  const handleStartDateSelect = (date: Date) => {
    setDateRange(prev => ({
      start: date,
      end: prev?.end || date,
    }));
    setShowStartCalendar(false);
  };

  const handleEndDateSelect = (date: Date) => {
    setDateRange(prev => ({
      start: prev?.start || date,
      end: date,
    }));
    setShowEndCalendar(false);
  };

  const handleClearDateRange = () => {
    setDateRange(undefined);
  };

  const handleApply = () => {
    const filters: FilterOptions = {
      dateRange,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      hasReflection,
    };
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setDateRange(undefined);
    setSelectedTags([]);
    setHasReflection(undefined);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.panel, { backgroundColor: theme.background }]}>
          {/* 头部 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.cancelText, { color: theme.text }]}>取消</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>筛选</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={[styles.resetText, { color: COLORS.PRIMARY }]}>重置</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* 日期范围筛选 */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                完成日期范围
              </Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={[styles.dateButton, { borderColor: theme.border }]}
                  onPress={() => setShowStartCalendar(true)}
                >
                  <Text style={[styles.dateButtonText, { color: theme.text }]}>
                    {dateRange?.start
                      ? format(dateRange.start, 'yyyy-MM-dd', { locale: zhCN })
                      : '开始日期'}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.dateSeparator, { color: theme.text }]}>至</Text>
                <TouchableOpacity
                  style={[styles.dateButton, { borderColor: theme.border }]}
                  onPress={() => setShowEndCalendar(true)}
                >
                  <Text style={[styles.dateButtonText, { color: theme.text }]}>
                    {dateRange?.end
                      ? format(dateRange.end, 'yyyy-MM-dd', { locale: zhCN })
                      : '结束日期'}
                  </Text>
                </TouchableOpacity>
              </View>
              {dateRange && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={handleClearDateRange}
                >
                  <Text style={[styles.clearDateText, { color: COLORS.PRIMARY }]}>
                    清除日期范围
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 标签筛选 */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                标签
              </Text>
              {availableTags.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  暂无标签
                </Text>
              ) : (
                <View style={styles.tagsContainer}>
                  {availableTags.map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagChip,
                        {
                          backgroundColor: selectedTags.includes(tag)
                            ? COLORS.PRIMARY
                            : theme.card,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => handleTagToggle(tag)}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color: selectedTags.includes(tag)
                              ? COLORS.WHITE
                              : theme.text,
                          },
                        ]}
                      >
                        #{tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 复盘状态筛选 */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                复盘状态
              </Text>
              <View style={styles.reflectionStatusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        hasReflection === undefined ? COLORS.PRIMARY : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => handleReflectionStatusToggle(undefined)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      {
                        color:
                          hasReflection === undefined ? COLORS.WHITE : theme.text,
                      },
                    ]}
                  >
                    全部
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        hasReflection === true ? COLORS.PRIMARY : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => handleReflectionStatusToggle(true)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      {
                        color: hasReflection === true ? COLORS.WHITE : theme.text,
                      },
                    ]}
                  >
                    已思
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        hasReflection === false ? COLORS.PRIMARY : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => handleReflectionStatusToggle(false)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      {
                        color: hasReflection === false ? COLORS.WHITE : theme.text,
                      },
                    ]}
                  >
                    待思
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: COLORS.PRIMARY }]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>应用筛选</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 日历选择器 */}
        {showStartCalendar && (
          <Modal
            visible={showStartCalendar}
            animationType="fade"
            transparent
            onRequestClose={() => setShowStartCalendar(false)}
          >
            <TouchableOpacity
              style={styles.calendarModalOverlay}
              activeOpacity={1}
              onPress={() => setShowStartCalendar(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={[styles.calendarContainer, { backgroundColor: theme.background }]}>
                  <Calendar
                    selectedDate={dateRange?.start || new Date()}
                    onDateSelect={handleStartDateSelect}
                  />
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}

        {showEndCalendar && (
          <Modal
            visible={showEndCalendar}
            animationType="fade"
            transparent
            onRequestClose={() => setShowEndCalendar(false)}
          >
            <TouchableOpacity
              style={styles.calendarModalOverlay}
              activeOpacity={1}
              onPress={() => setShowEndCalendar(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={[styles.calendarContainer, { backgroundColor: theme.background }]}>
                  <Calendar
                    selectedDate={dateRange?.end || new Date()}
                    onDateSelect={handleEndDateSelect}
                  />
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  cancelText: {
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
  },
  dateSeparator: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  clearDateButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  clearDateText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
  reflectionStatusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  applyButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default FilterPanel;
