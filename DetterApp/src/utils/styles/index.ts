/**
 * 样式系统统一导出
 * 提供完整的样式工具和常量
 */

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
  ANIMATION_DURATION,
} from '../constants';

import { lightTheme, darkTheme } from '../theme';
import * as globalStylesModule from '../globalStyles';
import * as responsiveModule from '../responsive';
import * as styleUtilsModule from '../styleUtils';

// 导出常量
export {
  COLORS,
  DARK_COLORS,
  SIZES,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  SHADOWS,
  OPACITY,
  ANIMATION_DURATION,
};

// 导出主题
export { lightTheme, darkTheme };

// 导出全局样式
export {
  globalStyles,
  containerStyles,
  textStyles,
  buttonStyles,
  inputStyles,
  spacingStyles,
  borderStyles,
  radiusStyles,
  shadowStyles,
  responsiveSize,
  responsiveFontSize,
  responsiveSpacing,
} from '../globalStyles';

// 导出响应式工具
export {
  responsive,
  screenInfo,
  deviceType,
  scaleWidth,
  scaleHeight,
  moderateScale,
  scaleFontSize,
  responsiveValue,
  getResponsiveSpacing,
  getResponsiveBorderRadius,
  getResponsiveIconSize,
  widthPercentage,
  heightPercentage,
  isLandscape,
  isPortrait,
  getSafeAreaInsets,
  createResponsiveStyle,
  addDimensionListener,
} from '../responsive';

// 导出样式工具函数
export {
  styleUtils,
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
} from '../styleUtils';

/**
 * 默认导出：完整的样式系统
 */
const styles = {
  // 常量
  colors: COLORS,
  darkColors: DARK_COLORS,
  sizes: SIZES,
  spacing: SPACING,
  fonts: {
    sizes: FONT_SIZES,
    weights: FONT_WEIGHTS,
    lineHeights: LINE_HEIGHTS,
  },
  shadows: SHADOWS,
  opacity: OPACITY,
  animation: ANIMATION_DURATION,
  
  // 主题
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  
  // 全局样式
  global: globalStylesModule.globalStyles,
  
  // 响应式
  responsive: responsiveModule.responsive,
  
  // 工具函数
  utils: styleUtilsModule.styleUtils,
};

export default styles;
