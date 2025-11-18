/**
 * 样式工具函数
 * 提供常用的样式辅助函数
 */
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { COLORS, DARK_COLORS, SPACING, SIZES, SHADOWS, OPACITY } from './constants';

/**
 * 合并样式数组
 */
export const mergeStyles = <T extends ViewStyle | TextStyle | ImageStyle>(
  ...styles: (T | undefined | false | null)[]
): T => {
  return Object.assign({}, ...styles.filter(Boolean)) as T;
};

/**
 * 条件样式
 * @param condition 条件
 * @param trueStyle 条件为真时的样式
 * @param falseStyle 条件为假时的样式
 */
export const conditionalStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  condition: boolean,
  trueStyle: T,
  falseStyle?: T
): T | undefined => {
  return condition ? trueStyle : falseStyle;
};

/**
 * 创建圆形样式
 * @param size 圆形大小
 * @param backgroundColor 背景色
 */
export const createCircleStyle = (
  size: number,
  backgroundColor?: string
): ViewStyle => {
  return {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor || COLORS.PRIMARY,
  };
};

/**
 * 创建居中样式
 */
export const createCenterStyle = (): ViewStyle => {
  return {
    justifyContent: 'center',
    alignItems: 'center',
  };
};

/**
 * 创建绝对定位样式
 * @param top 顶部距离
 * @param right 右侧距离
 * @param bottom 底部距离
 * @param left 左侧距离
 */
export const createAbsoluteStyle = (
  top?: number,
  right?: number,
  bottom?: number,
  left?: number
): ViewStyle => {
  return {
    position: 'absolute',
    top,
    right,
    bottom,
    left,
  };
};

/**
 * 创建 Flex 样式
 * @param flex flex 值
 * @param direction flex 方向
 * @param justify 主轴对齐
 * @param align 交叉轴对齐
 */
export const createFlexStyle = (
  flex?: number,
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse',
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly',
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
): ViewStyle => {
  return {
    flex,
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
  };
};

/**
 * 创建带边框的样式
 * @param width 边框宽度
 * @param color 边框颜色
 * @param radius 圆角
 */
export const createBorderStyle = (
  width: number = SIZES.BORDER_WIDTH,
  color: string = COLORS.BORDER,
  radius?: number
): ViewStyle => {
  return {
    borderWidth: width,
    borderColor: color,
    borderRadius: radius,
  };
};

/**
 * 创建阴影样式（跨平台）
 * @param elevation Android elevation
 * @param shadowColor iOS shadow color
 * @param shadowOffset iOS shadow offset
 * @param shadowOpacity iOS shadow opacity
 * @param shadowRadius iOS shadow radius
 */
export const createShadowStyle = (
  elevation: number = 4,
  shadowColor: string = COLORS.SHADOW,
  shadowOffset: { width: number; height: number } = { width: 0, height: 2 },
  shadowOpacity: number = 0.15,
  shadowRadius: number = 4
): ViewStyle => {
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

/**
 * 创建渐变背景样式（需要配合 LinearGradient 组件使用）
 * @param colors 渐变颜色数组
 * @param start 起始位置
 * @param end 结束位置
 */
export const createGradientConfig = (
  colors: string[],
  start: { x: number; y: number } = { x: 0, y: 0 },
  end: { x: number; y: number } = { x: 1, y: 1 }
) => {
  return {
    colors,
    start,
    end,
  };
};

/**
 * 获取优先级颜色
 * @param priority 优先级
 */
export const getPriorityColor = (
  priority: 'important' | 'urgent' | 'trivial'
): string => {
  switch (priority) {
    case 'important':
      return COLORS.PRIORITY_IMPORTANT;
    case 'urgent':
      return COLORS.PRIORITY_URGENT;
    case 'trivial':
      return COLORS.PRIORITY_TRIVIAL;
    default:
      return COLORS.TEXT_SECONDARY;
  }
};

/**
 * 获取状态颜色
 * @param status 状态
 */
export const getStatusColor = (
  status: 'success' | 'error' | 'warning' | 'info'
): string => {
  switch (status) {
    case 'success':
      return COLORS.SUCCESS;
    case 'error':
      return COLORS.ERROR;
    case 'warning':
      return COLORS.WARNING;
    case 'info':
      return COLORS.INFO;
    default:
      return COLORS.TEXT_SECONDARY;
  }
};

/**
 * 根据主题获取颜色
 * @param isDark 是否为深色主题
 * @param lightColor 浅色主题颜色
 * @param darkColor 深色主题颜色
 */
export const getThemedColor = (
  isDark: boolean,
  lightColor: string,
  darkColor: string
): string => {
  return isDark ? darkColor : lightColor;
};

/**
 * 创建透明度样式
 * @param opacity 透明度值
 */
export const createOpacityStyle = (opacity: number): ViewStyle => {
  return { opacity };
};

/**
 * 创建禁用样式
 */
export const createDisabledStyle = (): ViewStyle => {
  return {
    opacity: OPACITY.DISABLED,
  };
};

/**
 * 创建覆盖层样式
 * @param backgroundColor 背景色
 * @param opacity 透明度
 */
export const createOverlayStyle = (
  backgroundColor: string = COLORS.BLACK,
  opacity: number = OPACITY.OVERLAY
): ViewStyle => {
  return {
    ...createAbsoluteStyle(0, 0, 0, 0),
    backgroundColor,
    opacity,
  };
};

/**
 * 创建卡片样式
 * @param elevated 是否有阴影
 */
export const createCardStyle = (elevated: boolean = true): ViewStyle => {
  return {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SPACING.md,
    ...(elevated ? SHADOWS.MEDIUM : {}),
  };
};

/**
 * 创建标签样式
 * @param backgroundColor 背景色
 * @param textColor 文字颜色
 */
export const createTagStyle = (
  backgroundColor: string = COLORS.ACCENT,
  textColor: string = COLORS.TEXT_SECONDARY
): { container: ViewStyle; text: TextStyle } => {
  return {
    container: {
      backgroundColor,
      borderRadius: SIZES.BORDER_RADIUS_ROUND,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
    },
    text: {
      color: textColor,
      fontSize: 12,
      fontWeight: '500',
    },
  };
};

/**
 * 创建分隔线样式
 * @param color 颜色
 * @param thickness 厚度
 * @param marginVertical 垂直边距
 */
export const createDividerStyle = (
  color: string = COLORS.BORDER,
  thickness: number = 1,
  marginVertical: number = SPACING.md
): ViewStyle => {
  return {
    height: thickness,
    backgroundColor: color,
    marginVertical,
  };
};

/**
 * 创建按钮样式
 * @param variant 按钮变体
 * @param size 按钮大小
 */
export const createButtonStyle = (
  variant: 'primary' | 'secondary' | 'text' = 'primary',
  size: 'small' | 'medium' | 'large' = 'medium'
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  };

  // 变体样式
  const variantStyle: ViewStyle =
    variant === 'primary'
      ? {
          backgroundColor: COLORS.PRIMARY,
          ...SHADOWS.SMALL,
        }
      : variant === 'secondary'
      ? {
          backgroundColor: COLORS.TRANSPARENT,
          borderWidth: SIZES.BORDER_WIDTH_THICK,
          borderColor: COLORS.PRIMARY,
        }
      : {
          backgroundColor: COLORS.TRANSPARENT,
        };

  // 尺寸样式
  const sizeStyle: ViewStyle =
    size === 'small'
      ? {
          height: SIZES.BUTTON_HEIGHT_SMALL,
          paddingHorizontal: SPACING.md,
        }
      : size === 'large'
      ? {
          height: SIZES.BUTTON_HEIGHT_LARGE,
          paddingHorizontal: SPACING.xl,
        }
      : {
          height: SIZES.BUTTON_HEIGHT,
          paddingHorizontal: SPACING.lg,
        };

  return {
    ...baseStyle,
    ...variantStyle,
    ...sizeStyle,
  };
};

/**
 * 创建输入框样式
 * @param focused 是否聚焦
 * @param error 是否有错误
 */
export const createInputStyle = (
  focused: boolean = false,
  error: boolean = false
): ViewStyle => {
  return {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderWidth: focused ? SIZES.BORDER_WIDTH_THICK : SIZES.BORDER_WIDTH,
    borderColor: error
      ? COLORS.ERROR
      : focused
      ? COLORS.PRIMARY
      : COLORS.BORDER,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: SIZES.INPUT_HEIGHT,
  };
};

/**
 * 导出所有工具函数
 */
export const styleUtils = {
  mergeStyles,
  conditionalStyle,
  createCircleStyle,
  createCenterStyle,
  createAbsoluteStyle,
  createFlexStyle,
  createBorderStyle,
  createShadowStyle,
  createGradientConfig,
  getPriorityColor,
  getStatusColor,
  getThemedColor,
  createOpacityStyle,
  createDisabledStyle,
  createOverlayStyle,
  createCardStyle,
  createTagStyle,
  createDividerStyle,
  createButtonStyle,
  createInputStyle,
};

export default styleUtils;
