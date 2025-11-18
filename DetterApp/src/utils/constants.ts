/**
 * 应用常量定义
 * 包含颜色、尺寸、字体、间距等全局样式常量
 */

// 颜色常量 - Light Theme
export const COLORS = {
  // 全局背景色
  BACKGROUND: '#ecfaf6',
  
  // 日期选择器背景色
  DATE_SELECTOR_BG: '#f5eefb',
  
  // 优先级容器
  PRIORITY_CONTAINER_BG: '#f0f0f0',
  IMPORTANT_BORDER: '#dc663c',
  URGENT_BORDER: '#eb9e28',
  TRIVIAL_BORDER: '#8c8c8c',
  
  // 优先级颜色
  PRIORITY_IMPORTANT: '#dc663c',
  PRIORITY_URGENT: '#eb9e28',
  PRIORITY_TRIVIAL: '#8c8c8c',
  
  // 主色调
  PRIMARY: '#dc663c',
  SECONDARY: '#eb9e28',
  ACCENT: '#f5eefb',
  
  // 背景色
  BACKGROUND_LIGHT: '#f5f5f5',
  BACKGROUND_CARD: '#ffffff',
  BACKGROUND_OVERLAY: 'rgba(0, 0, 0, 0.5)',
  
  // 边框
  BORDER: '#e0e0e0',
  BORDER_LIGHT: '#f0f0f0',
  BORDER_DARK: '#cccccc',
  
  // 复盘相关
  REFLECTION_ITEM_BG: '#f2f2fd',
  REFLECTION_HIGHLIGHT: '#e8e4f3',
  
  // 文本颜色
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  TEXT_PLACEHOLDER: '#999999',
  TEXT_DISABLED: '#cccccc',
  TEXT_INVERSE: '#ffffff',
  
  // 通用颜色
  WHITE: '#ffffff',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  
  // 状态颜色
  SUCCESS: '#4caf50',
  SUCCESS_LIGHT: '#e8f5e9',
  ERROR: '#f44336',
  ERROR_LIGHT: '#ffebee',
  WARNING: '#ff9800',
  WARNING_LIGHT: '#fff3e0',
  INFO: '#2196f3',
  INFO_LIGHT: '#e3f2fd',
  
  // 阴影颜色
  SHADOW: '#000000',
  SHADOW_DARK: '#000000',
};

// Dark Theme 颜色
export const DARK_COLORS = {
  BACKGROUND: '#1a1a1a',
  BACKGROUND_LIGHT: '#2a2a2a',
  BACKGROUND_CARD: '#2a2a2a',
  BACKGROUND_OVERLAY: 'rgba(0, 0, 0, 0.7)',
  
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#999999',
  TEXT_TERTIARY: '#666666',
  TEXT_PLACEHOLDER: '#666666',
  TEXT_DISABLED: '#444444',
  
  BORDER: '#333333',
  BORDER_LIGHT: '#2a2a2a',
  BORDER_DARK: '#444444',
  
  PRIORITY_CONTAINER_BG: '#2a2a2a',
  DATE_SELECTOR_BG: '#2a2a2a',
  REFLECTION_ITEM_BG: '#2d2a3d',
  
  SHADOW: 'rgba(0, 0, 0, 0.3)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.5)',
};

// 尺寸常量
export const SIZES = {
  // 边框圆角
  BORDER_RADIUS: 8,
  BORDER_RADIUS_SMALL: 4,
  BORDER_RADIUS_MEDIUM: 8,
  BORDER_RADIUS_LARGE: 12,
  BORDER_RADIUS_XLARGE: 16,
  BORDER_RADIUS_ROUND: 999,
  
  // 内边距
  PADDING: 16,
  PADDING_SMALL: 8,
  PADDING_MEDIUM: 16,
  PADDING_LARGE: 24,
  PADDING_XLARGE: 32,
  
  // 外边距
  MARGIN: 16,
  MARGIN_SMALL: 8,
  MARGIN_MEDIUM: 16,
  MARGIN_LARGE: 24,
  MARGIN_XLARGE: 32,
  
  // 图标尺寸
  ICON_SIZE: 24,
  ICON_SIZE_SMALL: 16,
  ICON_SIZE_MEDIUM: 24,
  ICON_SIZE_LARGE: 32,
  ICON_SIZE_XLARGE: 48,
  
  // 边框宽度
  BORDER_WIDTH: 1,
  BORDER_WIDTH_THICK: 2,
  BORDER_WIDTH_PRIORITY: 4,
  
  // 按钮高度
  BUTTON_HEIGHT: 48,
  BUTTON_HEIGHT_SMALL: 36,
  BUTTON_HEIGHT_LARGE: 56,
  
  // 输入框高度
  INPUT_HEIGHT: 48,
  INPUT_HEIGHT_SMALL: 36,
  INPUT_HEIGHT_LARGE: 56,
};

// 间距常量（统一使用）
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// 字体大小
export const FONT_SIZES = {
  TINY: 10,
  SMALL: 12,
  MEDIUM: 14,
  REGULAR: 16,
  LARGE: 18,
  XLARGE: 20,
  XXLARGE: 24,
  TITLE: 28,
  HERO: 32,
};

// 字体粗细
export const FONT_WEIGHTS = {
  LIGHT: '300' as const,
  REGULAR: '400' as const,
  MEDIUM: '500' as const,
  SEMIBOLD: '600' as const,
  BOLD: '700' as const,
  EXTRABOLD: '800' as const,
};

// 行高
export const LINE_HEIGHTS = {
  TIGHT: 1.2,
  NORMAL: 1.5,
  RELAXED: 1.75,
  LOOSE: 2,
};

// 动画时长
export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 100,
  NORMAL: 300,
  SLOW: 500,
  SLOWER: 800,
};

// 阴影样式
export const SHADOWS = {
  NONE: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SMALL: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  LARGE: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  XLARGE: {
    shadowColor: COLORS.SHADOW_DARK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

// 透明度
export const OPACITY = {
  DISABLED: 0.4,
  INACTIVE: 0.6,
  ACTIVE: 1,
  OVERLAY: 0.5,
};

// 性能相关
export const PERFORMANCE = {
  TARGET_FPS: 60,
  MAX_STARTUP_TIME: 2000, // 2秒
  MAX_RESPONSE_TIME: 100, // 100毫秒
};

// 数据库相关
export const DATABASE = {
  NAME: 'detter.db',
  VERSION: 1,
};

// Bottom Sheet snap points
export const BOTTOM_SHEET_SNAP_POINTS = ['50%', '90%'];

// 卡片列表视图相关
export const CARD_LIST = {
  CARD_HEIGHT: 200,
  MIN_SCALE: 0.8,
  MAX_SCALE: 1.0,
  MAX_SWIPE_CARDS: 3,
};

// 日期选择器相关
export const DATE_SELECTOR = {
  VISIBLE_DAYS: 7,
  PRELOAD_WEEKS: 2,
};
