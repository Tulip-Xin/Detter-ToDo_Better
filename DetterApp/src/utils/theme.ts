/**
 * 主题配置
 * 定义浅色和深色主题的完整颜色方案
 */
import { Theme } from '../models/types';
import { COLORS, DARK_COLORS } from './constants';

/**
 * 浅色主题
 */
export const lightTheme: Theme = {
  background: COLORS.BACKGROUND,
  text: COLORS.TEXT_PRIMARY,
  textSecondary: COLORS.TEXT_SECONDARY,
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  border: COLORS.BORDER,
  card: COLORS.BACKGROUND_CARD,
  cardBackground: COLORS.BACKGROUND_CARD,
  error: COLORS.ERROR,
  success: COLORS.SUCCESS,
  warning: COLORS.WARNING,
};

/**
 * 深色主题
 */
export const darkTheme: Theme = {
  background: DARK_COLORS.BACKGROUND,
  text: DARK_COLORS.TEXT_PRIMARY,
  textSecondary: DARK_COLORS.TEXT_SECONDARY,
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  border: DARK_COLORS.BORDER,
  card: DARK_COLORS.BACKGROUND_CARD,
  cardBackground: DARK_COLORS.BACKGROUND_CARD,
  error: COLORS.ERROR,
  success: COLORS.SUCCESS,
  warning: COLORS.WARNING,
};
