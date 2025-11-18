/**
 * dateUtils 单元测试
 */

import {
  formatDate,
  formatTime,
  isToday,
  isSameDay,
  getWeekDates,
  getStartOfDay,
  getEndOfDay,
  getDayName,
  getMonthDates,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/2025/);
      expect(formatted).toMatch(/01/);
      expect(formatted).toMatch(/15/);
    });

    it('should handle custom format', () => {
      const date = new Date('2025-01-15');
      const formatted = formatDate(date, 'yyyy-MM-dd');
      expect(formatted).toBe('2025-01-15');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2025-01-15T14:30:00');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/14:30/);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2025-01-15T10:00:00');
      const date2 = new Date('2025-01-15T15:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2025-01-15');
      const date2 = new Date('2025-01-16');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getWeekDates', () => {
    it('should return 7 dates for a week', () => {
      const date = new Date('2025-01-15');
      const weekDates = getWeekDates(date);
      expect(weekDates).toHaveLength(7);
    });

    it('should include the given date', () => {
      const date = new Date('2025-01-15');
      const weekDates = getWeekDates(date);
      const hasDate = weekDates.some(d => isSameDay(d, date));
      expect(hasDate).toBe(true);
    });
  });

  describe('getStartOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2025-01-15T14:30:00');
      const start = getStartOfDay(date);
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2025-01-15T14:30:00');
      const end = getEndOfDay(date);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
    });
  });

  describe('getDayName', () => {
    it('should return correct day name', () => {
      const monday = new Date('2025-01-15'); // Monday
      const dayName = getDayName(monday);
      expect(dayName).toBeTruthy();
      expect(typeof dayName).toBe('string');
    });

    it('should return short day name', () => {
      const date = new Date('2025-01-15');
      const shortName = getDayName(date, true);
      expect(shortName).toBeTruthy();
      expect(shortName.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getMonthDates', () => {
    it('should return dates for a month', () => {
      const date = new Date('2025-01-15');
      const monthDates = getMonthDates(date);
      expect(monthDates.length).toBeGreaterThan(0);
      expect(monthDates.length).toBeLessThanOrEqual(42); // Max 6 weeks
    });

    it('should include first day of month', () => {
      const date = new Date('2025-01-15');
      const monthDates = getMonthDates(date);
      const firstDay = new Date('2025-01-01');
      const hasFirstDay = monthDates.some(d => isSameDay(d, firstDay));
      expect(hasFirstDay).toBe(true);
    });
  });
});
