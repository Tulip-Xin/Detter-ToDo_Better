/**
 * 日期处理工具函数
 */
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  isSameDay,
  isToday,
  differenceInDays,
} from 'date-fns';

/**
 * 生成日期范围
 * @param centerDate 中心日期
 * @param daysCount 总天数
 * @returns 日期数组
 */
export const generateDateRange = (
  centerDate: Date,
  daysCount: number,
): Date[] => {
  const halfDays = Math.floor(daysCount / 2);
  const dates: Date[] = [];

  for (let i = -halfDays; i <= halfDays; i++) {
    dates.push(addDays(centerDate, i));
  }

  return dates;
};

/**
 * 格式化日期为显示文本
 * @param date 日期
 * @param formatStr 格式字符串
 * @returns 格式化后的字符串
 */
export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

/**
 * 获取星期名称
 * @param date 日期
 * @returns 星期名称（如：周一）
 */
export const getWeekdayName = (date: Date): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
};

/**
 * 检查是否为今天
 */
export const checkIsToday = (date: Date): boolean => {
  return isToday(date);
};

/**
 * 检查两个日期是否为同一天
 */
export const checkIsSameDay = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

/**
 * 获取日期范围的开始和结束时间
 */
export const getDateRange = (date: Date) => {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
};

/**
 * 获取周范围
 */
export const getWeekRange = (date: Date) => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }), // 周一开始
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
};

/**
 * 获取月范围
 */
export const getMonthRange = (date: Date) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

/**
 * 计算两个日期之间的天数差
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  return differenceInDays(date1, date2);
};

/**
 * 获取相对日期描述
 * @param date 日期
 * @returns 相对描述（今天、明天、昨天等）
 */
export const getRelativeDateDescription = (date: Date): string => {
  const today = new Date();
  const diff = getDaysDifference(date, today);

  if (diff === 0) return '今天';
  if (diff === 1) return '明天';
  if (diff === -1) return '昨天';
  if (diff === 2) return '后天';

  return formatDate(date, 'MM月dd日');
};
