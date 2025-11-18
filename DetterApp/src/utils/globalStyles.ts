/**
 * 全局样式定义
 * 提供可复用的样式组件和工具函数
 */
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import {
  COLORS,
  DARK_COLORS,
  SIZES,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  SHADOWS,
  OPACITY,
} from './constants';

/**
 * 通用容器样式
 */
export const containerStyles = StyleSheet.create({
  // 基础容器
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.md,
  },
  
  // 居中容器
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // 卡片容器
  card: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SPACING.md,
    ...SHADOWS.SMALL,
  },
  cardElevated: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SPACING.md,
    ...SHADOWS.MEDIUM,
  },
  
  // 行容器
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 列容器
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * 文本样式
 */
export const textStyles = StyleSheet.create({
  // 标题样式
  hero: {
    fontSize: FONT_SIZES.HERO,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: FONT_SIZES.HERO * LINE_HEIGHTS.TIGHT,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: FONT_SIZES.TITLE * LINE_HEIGHTS.TIGHT,
  },
  heading: {
    fontSize: FONT_SIZES.XXLARGE,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: FONT_SIZES.XXLARGE * LINE_HEIGHTS.NORMAL,
  },
  subheading: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: FONT_SIZES.XLARGE * LINE_HEIGHTS.NORMAL,
  },
  
  // 正文样式
  body: {
    fontSize: FONT_SIZES.REGULAR,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: FONT_SIZES.REGULAR * LINE_HEIGHTS.NORMAL,
  },
  bodyMedium: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: FONT_SIZES.MEDIUM * LINE_HEIGHTS.NORMAL,
  },
  bodySmall: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: FONT_SIZES.SMALL * LINE_HEIGHTS.NORMAL,
  },
  
  // 次要文本
  secondary: {
    fontSize: FONT_SIZES.REGULAR,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: FONT_SIZES.REGULAR * LINE_HEIGHTS.NORMAL,
  },
  secondarySmall: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: FONT_SIZES.SMALL * LINE_HEIGHTS.NORMAL,
  },
  
  // 占位符文本
  placeholder: {
    fontSize: FONT_SIZES.REGULAR,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.TEXT_PLACEHOLDER,
    lineHeight: FONT_SIZES.REGULAR * LINE_HEIGHTS.NORMAL,
  },
  
  // 标签文本
  label: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // 按钮文本
  button: {
    fontSize: FONT_SIZES.REGULAR,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_INVERSE,
    textAlign: 'center',
  },
  buttonSmall: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_INVERSE,
    textAlign: 'center',
  },
  
  // 链接文本
  link: {
    fontSize: FONT_SIZES.REGULAR,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  
  // 错误文本
  error: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.ERROR,
    lineHeight: FONT_SIZES.SMALL * LINE_HEIGHTS.NORMAL,
  },
  
  // 成功文本
  success: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHTS.REGULAR,
    color: COLORS.SUCCESS,
    lineHeight: FONT_SIZES.SMALL * LINE_HEIGHTS.NORMAL,
  },
});

/**
 * 按钮样式
 */
export const buttonStyles = StyleSheet.create({
  // 主要按钮
  primary: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    height: SIZES.BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  primaryDisabled: {
    backgroundColor: COLORS.PRIMARY,
    opacity: OPACITY.DISABLED,
  },
  
  // 次要按钮
  secondary: {
    backgroundColor: COLORS.TRANSPARENT,
    borderWidth: SIZES.BORDER_WIDTH_THICK,
    borderColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    height: SIZES.BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 文本按钮
  text: {
    backgroundColor: COLORS.TRANSPARENT,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 小按钮
  small: {
    height: SIZES.BUTTON_HEIGHT_SMALL,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  
  // 大按钮
  large: {
    height: SIZES.BUTTON_HEIGHT_LARGE,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  
  // 圆形按钮
  round: {
    borderRadius: SIZES.BORDER_RADIUS_ROUND,
  },
  
  // 全宽按钮
  fullWidth: {
    width: '100%',
  },
});

/**
 * 输入框样式
 */
export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND_CARD,
    borderWidth: SIZES.BORDER_WIDTH,
    borderColor: COLORS.BORDER,
    borderRadius: SIZES.BORDER_RADIUS,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    height: SIZES.INPUT_HEIGHT,
  },
  inputFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: SIZES.BORDER_WIDTH_THICK,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.ERROR,
    marginTop: SPACING.xs,
  },
});

/**
 * 间距工具样式
 */
export const spacingStyles = StyleSheet.create({
  // Padding
  p_xs: { padding: SPACING.xs },
  p_sm: { padding: SPACING.sm },
  p_md: { padding: SPACING.md },
  p_lg: { padding: SPACING.lg },
  p_xl: { padding: SPACING.xl },
  
  pt_xs: { paddingTop: SPACING.xs },
  pt_sm: { paddingTop: SPACING.sm },
  pt_md: { paddingTop: SPACING.md },
  pt_lg: { paddingTop: SPACING.lg },
  pt_xl: { paddingTop: SPACING.xl },
  
  pb_xs: { paddingBottom: SPACING.xs },
  pb_sm: { paddingBottom: SPACING.sm },
  pb_md: { paddingBottom: SPACING.md },
  pb_lg: { paddingBottom: SPACING.lg },
  pb_xl: { paddingBottom: SPACING.xl },
  
  pl_xs: { paddingLeft: SPACING.xs },
  pl_sm: { paddingLeft: SPACING.sm },
  pl_md: { paddingLeft: SPACING.md },
  pl_lg: { paddingLeft: SPACING.lg },
  pl_xl: { paddingLeft: SPACING.xl },
  
  pr_xs: { paddingRight: SPACING.xs },
  pr_sm: { paddingRight: SPACING.sm },
  pr_md: { paddingRight: SPACING.md },
  pr_lg: { paddingRight: SPACING.lg },
  pr_xl: { paddingRight: SPACING.xl },
  
  px_xs: { paddingHorizontal: SPACING.xs },
  px_sm: { paddingHorizontal: SPACING.sm },
  px_md: { paddingHorizontal: SPACING.md },
  px_lg: { paddingHorizontal: SPACING.lg },
  px_xl: { paddingHorizontal: SPACING.xl },
  
  py_xs: { paddingVertical: SPACING.xs },
  py_sm: { paddingVertical: SPACING.sm },
  py_md: { paddingVertical: SPACING.md },
  py_lg: { paddingVertical: SPACING.lg },
  py_xl: { paddingVertical: SPACING.xl },
  
  // Margin
  m_xs: { margin: SPACING.xs },
  m_sm: { margin: SPACING.sm },
  m_md: { margin: SPACING.md },
  m_lg: { margin: SPACING.lg },
  m_xl: { margin: SPACING.xl },
  
  mt_xs: { marginTop: SPACING.xs },
  mt_sm: { marginTop: SPACING.sm },
  mt_md: { marginTop: SPACING.md },
  mt_lg: { marginTop: SPACING.lg },
  mt_xl: { marginTop: SPACING.xl },
  
  mb_xs: { marginBottom: SPACING.xs },
  mb_sm: { marginBottom: SPACING.sm },
  mb_md: { marginBottom: SPACING.md },
  mb_lg: { marginBottom: SPACING.lg },
  mb_xl: { marginBottom: SPACING.xl },
  
  ml_xs: { marginLeft: SPACING.xs },
  ml_sm: { marginLeft: SPACING.sm },
  ml_md: { marginLeft: SPACING.md },
  ml_lg: { marginLeft: SPACING.lg },
  ml_xl: { marginLeft: SPACING.xl },
  
  mr_xs: { marginRight: SPACING.xs },
  mr_sm: { marginRight: SPACING.sm },
  mr_md: { marginRight: SPACING.md },
  mr_lg: { marginRight: SPACING.lg },
  mr_xl: { marginRight: SPACING.xl },
  
  mx_xs: { marginHorizontal: SPACING.xs },
  mx_sm: { marginHorizontal: SPACING.sm },
  mx_md: { marginHorizontal: SPACING.md },
  mx_lg: { marginHorizontal: SPACING.lg },
  mx_xl: { marginHorizontal: SPACING.xl },
  
  my_xs: { marginVertical: SPACING.xs },
  my_sm: { marginVertical: SPACING.sm },
  my_md: { marginVertical: SPACING.md },
  my_lg: { marginVertical: SPACING.lg },
  my_xl: { marginVertical: SPACING.xl },
});

/**
 * 边框样式
 */
export const borderStyles = StyleSheet.create({
  border: {
    borderWidth: SIZES.BORDER_WIDTH,
    borderColor: COLORS.BORDER,
  },
  borderThick: {
    borderWidth: SIZES.BORDER_WIDTH_THICK,
    borderColor: COLORS.BORDER,
  },
  borderTop: {
    borderTopWidth: SIZES.BORDER_WIDTH,
    borderTopColor: COLORS.BORDER,
  },
  borderBottom: {
    borderBottomWidth: SIZES.BORDER_WIDTH,
    borderBottomColor: COLORS.BORDER,
  },
  borderLeft: {
    borderLeftWidth: SIZES.BORDER_WIDTH,
    borderLeftColor: COLORS.BORDER,
  },
  borderRight: {
    borderRightWidth: SIZES.BORDER_WIDTH,
    borderRightColor: COLORS.BORDER,
  },
  borderPrimary: {
    borderColor: COLORS.PRIMARY,
  },
  borderError: {
    borderColor: COLORS.ERROR,
  },
  borderSuccess: {
    borderColor: COLORS.SUCCESS,
  },
});

/**
 * 圆角样式
 */
export const radiusStyles = StyleSheet.create({
  rounded_sm: { borderRadius: SIZES.BORDER_RADIUS_SMALL },
  rounded: { borderRadius: SIZES.BORDER_RADIUS },
  rounded_lg: { borderRadius: SIZES.BORDER_RADIUS_LARGE },
  rounded_xl: { borderRadius: SIZES.BORDER_RADIUS_XLARGE },
  rounded_full: { borderRadius: SIZES.BORDER_RADIUS_ROUND },
});

/**
 * 阴影样式
 */
export const shadowStyles = StyleSheet.create({
  shadow_none: SHADOWS.NONE,
  shadow_sm: SHADOWS.SMALL,
  shadow: SHADOWS.MEDIUM,
  shadow_lg: SHADOWS.LARGE,
  shadow_xl: SHADOWS.XLARGE,
});

/**
 * 工具函数：根据屏幕尺寸调整样式
 */
export const responsiveSize = (baseSize: number, screenWidth: number): number => {
  const baseWidth = 375; // iPhone SE 宽度作为基准
  return Math.round((baseSize * screenWidth) / baseWidth);
};

/**
 * 工具函数：创建响应式字体大小
 */
export const responsiveFontSize = (fontSize: number, screenWidth: number): number => {
  return responsiveSize(fontSize, screenWidth);
};

/**
 * 工具函数：创建响应式间距
 */
export const responsiveSpacing = (spacing: number, screenWidth: number): number => {
  return responsiveSize(spacing, screenWidth);
};

/**
 * 导出所有样式
 */
export const globalStyles = {
  container: containerStyles,
  text: textStyles,
  button: buttonStyles,
  input: inputStyles,
  spacing: spacingStyles,
  border: borderStyles,
  radius: radiusStyles,
  shadow: shadowStyles,
};

export default globalStyles;
