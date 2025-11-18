/**
 * Calendar 组件
 * 日历视图，支持月份导航和农历显示
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Lunar, Solar } from 'lunar-javascript';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  format,
} from 'date-fns';
import {
  checkIsToday,
  checkIsSameDay,
  formatDate,
} from '../../utils/dateUtils';
import { COLORS, SIZES, FONT_SIZES } from '../../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_WIDTH = (SCREEN_WIDTH - SIZES.PADDING * 2) / 7;

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  lunarText: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  // 获取农历信息
  const getLunarInfo = useCallback((date: Date): string => {
    try {
      const solar = Solar.fromDate(date);
      const lunar = solar.getLunar();
      
      // 优先显示节日
      const festivals = lunar.getFestivals();
      if (festivals.length > 0) {
        return festivals[0];
      }
      
      // 显示节气
      const jieQi = lunar.getJieQi();
      if (jieQi) {
        return jieQi;
      }
      
      // 显示农历日期
      const day = lunar.getDay();
      if (day === 1) {
        return lunar.getMonthInChinese() + '月';
      }
      
      return lunar.getDayInChinese();
    } catch (error) {
      return '';
    }
  }, []);

  // 生成日历数据
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 周日开始
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: CalendarDay[] = [];
    let currentDate = calendarStart;

    while (currentDate <= calendarEnd) {
      days.push({
        date: new Date(currentDate),
        isCurrentMonth:
          currentDate >= monthStart && currentDate <= monthEnd,
        lunarText: getLunarInfo(currentDate),
      });
      currentDate = addDays(currentDate, 1);
    }

    return days;
  }, [currentMonth, getLunarInfo]);

  // 切换到上个月
  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  // 切换到下个月
  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  // 处理日期选择
  const handleDatePress = useCallback(
    (date: Date) => {
      onDateSelect(date);
    },
    [onDateSelect],
  );

  // 渲染星期标题
  const renderWeekDays = () => {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return (
      <View style={styles.weekDaysRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  // 渲染日期单元格
  const renderDay = (day: CalendarDay, index: number) => {
    const isSelected = checkIsSameDay(day.date, selectedDate);
    const isTodayDate = checkIsToday(day.date);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          !day.isCurrentMonth && styles.dayCellInactive,
          isSelected && styles.dayCellSelected,
          isTodayDate && styles.dayCellToday,
        ]}
        onPress={() => handleDatePress(day.date)}
        activeOpacity={0.7}>
        <View style={styles.dayContent}>
          <Text
            style={[
              styles.dayText,
              !day.isCurrentMonth && styles.dayTextInactive,
              isSelected && styles.dayTextSelected,
            ]}>
            {day.date.getDate()}
          </Text>
          {isTodayDate && !isSelected && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>今</Text>
            </View>
          )}
          {day.lunarText && (
            <Text
              style={[
                styles.lunarText,
                !day.isCurrentMonth && styles.lunarTextInactive,
                isSelected && styles.lunarTextSelected,
              ]}>
              {day.lunarText}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 月份导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePreviousMonth}
          activeOpacity={0.7}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {format(currentMonth, 'yyyy年MM月')}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNextMonth}
          activeOpacity={0.7}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 星期标题 */}
      {renderWeekDays()}

      {/* 日期网格 */}
      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => renderDay(day, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.MARGIN,
  },
  navButton: {
    padding: SIZES.PADDING_SMALL,
    minWidth: 40,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: FONT_SIZES.XLARGE,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  monthText: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: SIZES.MARGIN_SMALL,
  },
  weekDayCell: {
    width: DAY_WIDTH,
    alignItems: 'center',
    paddingVertical: SIZES.PADDING_SMALL,
  },
  weekDayText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_WIDTH,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dayCellInactive: {
    opacity: 0.3,
  },
  dayCellSelected: {
    backgroundColor: COLORS.IMPORTANT_BORDER,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: COLORS.IMPORTANT_BORDER,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  dayTextInactive: {
    color: COLORS.TEXT_SECONDARY,
  },
  dayTextSelected: {
    color: COLORS.WHITE,
    fontWeight: '700',
  },
  todayBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.IMPORTANT_BORDER,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadgeText: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontWeight: '700',
  },
  lunarText: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  lunarTextInactive: {
    color: COLORS.TEXT_PLACEHOLDER,
  },
  lunarTextSelected: {
    color: COLORS.WHITE,
  },
});
