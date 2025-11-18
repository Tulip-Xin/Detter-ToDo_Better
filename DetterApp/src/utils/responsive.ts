/**
 * 响应式工具函数
 * 用于适配不同屏幕尺寸和分辨率
 */
import { Dimensions, Platform, PixelRatio } from 'react-native';

// 获取屏幕尺寸
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 设计稿基准尺寸（通常使用 iPhone SE 或标准 Android 设备）
const BASE_WIDTH = 375;
const BASE_HEIGHT = 667;

/**
 * 屏幕尺寸信息
 */
export const screenInfo = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  aspectRatio: SCREEN_WIDTH / SCREEN_HEIGHT,
  pixelRatio: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
};

/**
 * 设备类型判断
 */
export const deviceType = {
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
};

/**
 * 根据屏幕宽度缩放尺寸
 * @param size 设计稿中的尺寸
 * @returns 缩放后的尺寸
 */
export const scaleWidth = (size: number): number => {
  return Math.round((size * SCREEN_WIDTH) / BASE_WIDTH);
};

/**
 * 根据屏幕高度缩放尺寸
 * @param size 设计稿中的尺寸
 * @returns 缩放后的尺寸
 */
export const scaleHeight = (size: number): number => {
  return Math.round((size * SCREEN_HEIGHT) / BASE_HEIGHT);
};

/**
 * 适度缩放（考虑设备尺寸差异不要太大）
 * @param size 设计稿中的尺寸
 * @param factor 缩放因子 (0-1)，默认 0.5
 * @returns 缩放后的尺寸
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(size + (scale - 1) * size * factor);
};

/**
 * 缩放字体大小（考虑系统字体缩放设置）
 * @param size 设计稿中的字体大小
 * @returns 缩放后的字体大小
 */
export const scaleFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  // 限制最小和最大字体大小
  const minSize = size * 0.8;
  const maxSize = size * 1.2;
  
  return Math.round(Math.max(minSize, Math.min(maxSize, newSize)));
};

/**
 * 根据设备类型返回不同的值
 * @param small 小屏幕设备的值
 * @param medium 中等屏幕设备的值
 * @param large 大屏幕设备的值
 * @param tablet 平板设备的值
 * @returns 对应设备类型的值
 */
export const responsiveValue = <T>(
  small: T,
  medium: T,
  large: T,
  tablet?: T
): T => {
  if (deviceType.isTablet && tablet !== undefined) {
    return tablet;
  }
  if (deviceType.isLargeDevice) {
    return large;
  }
  if (deviceType.isMediumDevice) {
    return medium;
  }
  return small;
};

/**
 * 获取响应式间距
 * @param baseSpacing 基础间距
 * @returns 响应式间距
 */
export const getResponsiveSpacing = (baseSpacing: number): number => {
  return moderateScale(baseSpacing, 0.3);
};

/**
 * 获取响应式圆角
 * @param baseRadius 基础圆角
 * @returns 响应式圆角
 */
export const getResponsiveBorderRadius = (baseRadius: number): number => {
  return moderateScale(baseRadius, 0.2);
};

/**
 * 获取响应式图标大小
 * @param baseSize 基础图标大小
 * @returns 响应式图标大小
 */
export const getResponsiveIconSize = (baseSize: number): number => {
  return moderateScale(baseSize, 0.4);
};

/**
 * 计算百分比宽度
 * @param percentage 百分比 (0-100)
 * @returns 实际宽度
 */
export const widthPercentage = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * 计算百分比高度
 * @param percentage 百分比 (0-100)
 * @returns 实际高度
 */
export const heightPercentage = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * 判断是否为横屏
 */
export const isLandscape = (): boolean => {
  return SCREEN_WIDTH > SCREEN_HEIGHT;
};

/**
 * 判断是否为竖屏
 */
export const isPortrait = (): boolean => {
  return SCREEN_HEIGHT > SCREEN_WIDTH;
};

/**
 * 获取安全区域内边距（用于刘海屏等）
 */
export const getSafeAreaInsets = () => {
  // 这里可以集成 react-native-safe-area-context
  // 目前返回默认值
  return {
    top: Platform.OS === 'ios' ? 44 : 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
    left: 0,
    right: 0,
  };
};

/**
 * 响应式样式生成器
 * 根据屏幕尺寸动态生成样式
 */
export const createResponsiveStyle = <T extends Record<string, any>>(
  styleGenerator: (screen: typeof screenInfo) => T
): T => {
  return styleGenerator(screenInfo);
};

/**
 * 监听屏幕尺寸变化
 * @param callback 回调函数
 * @returns 取消监听的函数
 */
export const addDimensionListener = (
  callback: (dimensions: { window: any; screen: any }) => void
) => {
  const subscription = Dimensions.addEventListener('change', callback);
  return () => subscription?.remove();
};

/**
 * 导出常用的响应式值
 */
export const responsive = {
  // 屏幕信息
  screen: screenInfo,
  device: deviceType,
  
  // 缩放函数
  scaleWidth,
  scaleHeight,
  moderateScale,
  scaleFontSize,
  
  // 响应式值
  responsiveValue,
  getResponsiveSpacing,
  getResponsiveBorderRadius,
  getResponsiveIconSize,
  
  // 百分比计算
  widthPercentage,
  heightPercentage,
  
  // 方向判断
  isLandscape,
  isPortrait,
  
  // 安全区域
  getSafeAreaInsets,
  
  // 样式生成
  createResponsiveStyle,
  
  // 监听器
  addDimensionListener,
};

export default responsive;
