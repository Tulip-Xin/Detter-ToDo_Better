/**
 * DateSelector 组件
 * 横向滚动的日期选择器
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';
import {
  generateDateRange,
  getWeekdayName,
  formatDate,
  checkIsToday,
  checkIsSameDay,
} from '../../utils/dateUtils';
import { COLORS, SIZES, DATE_SELECTOR } from '../../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH / DATE_SELECTOR.VISIBLE_DAYS;

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

interface DateItem {
  date: Date;
  key: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const flatListRef = useRef<FlatList<DateItem>>(null);
  const [dates, setDates] = useState<DateItem[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);

  // 初始化日期数据
  useEffect(() => {
    const initialDates = generateDateRange(
      selectedDate,
      DATE_SELECTOR.VISIBLE_DAYS * (DATE_SELECTOR.PRELOAD_WEEKS * 2 + 1),
    );
    const dateItems = initialDates.map(date => ({
      date,
      key: formatDate(date, 'yyyy-MM-dd'),
    }));
    setDates(dateItems);
  }, []);

  // 滚动到选中的日期
  useEffect(() => {
    if (dates.length > 0 && !isScrolling) {
      const index = dates.findIndex(item =>
        checkIsSameDay(item.date, selectedDate),
      );
      if (index !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }
    }
  }, [selectedDate, dates, isScrolling]);

  // 处理日期点击
  const handleDatePress = useCallback(
    (date: Date) => {
      onDateSelect(date);
    },
    [onDateSelect],
  );

  // 加载更多日期（向前）
  const loadPreviousDates = useCallback(() => {
    if (dates.length === 0) return;

    const firstDate = dates[0].date;
    const newDates = generateDateRange(
      new Date(firstDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      7,
    );
    const newDateItems = newDates.map(date => ({
      date,
      key: formatDate(date, 'yyyy-MM-dd'),
    }));

    setDates(prev => [...newDateItems, ...prev]);
  }, [dates]);

  // 加载更多日期（向后）
  const loadNextDates = useCallback(() => {
    if (dates.length === 0) return;

    const lastDate = dates[dates.length - 1].date;
    const newDates = generateDateRange(
      new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      7,
    );
    const newDateItems = newDates.map(date => ({
      date,
      key: formatDate(date, 'yyyy-MM-dd'),
    }));

    setDates(prev => [...prev, ...newDateItems]);
  }, [dates]);

  // 渲染日期项
  const renderDateItem = useCallback(
    ({ item }: ListRenderItemInfo<DateItem>) => {
      const isSelected = checkIsSameDay(item.date, selectedDate);
      const isTodayDate = checkIsToday(item.date);

      return (
        <TouchableOpacity
          style={[
            styles.dateItem,
            isSelected && styles.dateItemSelected,
            isTodayDate && styles.dateItemToday,
          ]}
          onPress={() => handleDatePress(item.date)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.weekdayText,
              isSelected && styles.weekdayTextSelected,
            ]}>
            {getWeekdayName(item.date)}
          </Text>
          <Text
            style={[
              styles.dateText,
              isSelected && styles.dateTextSelected,
              isTodayDate && styles.dateTodayText,
            ]}>
            {item.date.getDate()}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedDate, handleDatePress],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dates}
        renderItem={renderDateItem}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onEndReached={loadNextDates}
        onEndReachedThreshold={0.5}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialNumToRender={DATE_SELECTOR.VISIBLE_DAYS}
        maxToRenderPerBatch={DATE_SELECTOR.VISIBLE_DAYS}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.DATE_SELECTOR_BG,
    paddingVertical: SIZES.PADDING_SMALL,
  },
  dateItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.PADDING_SMALL,
  },
  dateItemSelected: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  dateItemToday: {
    borderWidth: 2,
    borderColor: COLORS.IMPORTANT_BORDER,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  weekdayText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  weekdayTextSelected: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  dateTextSelected: {
    fontWeight: '700',
  },
  dateTodayText: {
    color: COLORS.IMPORTANT_BORDER,
    fontWeight: '700',
  },
});
