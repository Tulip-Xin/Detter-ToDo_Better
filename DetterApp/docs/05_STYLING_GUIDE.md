# Detter 应用样式指南

本文档描述了 Detter 应用的完整样式系统，包括设计规范、使用方法和最佳实践�?

## 目录

1. [设计原则](#设计原则)
2. [颜色系统](#颜色系统)
3. [字体系统](#字体系统)
4. [间距系统](#间距系统)
5. [组件样式](#组件样式)
6. [响应式设计](#响应式设�?
7. [主题切换](#主题切换)
8. [使用示例](#使用示例)

## 设计原则

Detter 采用极简设计风格，遵循以下设计原则：

- **简洁�?*: 界面简洁清晰，避免不必要的装饰
- **一致�?*: 所有组件使用统一的设计语言
- **可访问�?*: 确保良好的对比度和可读�?
- **响应�?*: 适配不同屏幕尺寸和分辨率
- **性能优先**: 优化动画和渲染性能

### Bento Grid 布局

应用采用 Bento Grid（便当盒）布局风格�?
- 模块化的卡片式布局
- 清晰的视觉层�?
- 合理的留白和间距
- 圆角和阴影增强层次感

## 颜色系统

### 主色�?

```typescript
PRIMARY: '#dc663c'    // 重要优先级、主要操�?
SECONDARY: '#eb9e28'  // 紧急优先级、次要操�?
ACCENT: '#f5eefb'     // 强调色、日期选择器背�?
```

### 背景�?

```typescript
BACKGROUND: '#ecfaf6'           // 全局背景
BACKGROUND_CARD: '#ffffff'      // 卡片背景
BACKGROUND_LIGHT: '#f5f5f5'     // 浅色背景
DATE_SELECTOR_BG: '#f5eefb'     // 日期选择器背�?
PRIORITY_CONTAINER_BG: '#f0f0f0' // 优先级容器背�?
REFLECTION_ITEM_BG: '#f2f2fd'   // 复盘项背�?
```

### 文本颜色

```typescript
TEXT_PRIMARY: '#000000'      // 主要文本
TEXT_SECONDARY: '#666666'    // 次要文本
TEXT_TERTIARY: '#999999'     // 三级文本
TEXT_PLACEHOLDER: '#999999'  // 占位符文�?
TEXT_DISABLED: '#cccccc'     // 禁用文本
TEXT_INVERSE: '#ffffff'      // 反色文本（用于深色背景）
```

### 优先级颜�?

```typescript
PRIORITY_IMPORTANT: '#dc663c'  // 重要
PRIORITY_URGENT: '#eb9e28'     // 紧�?
PRIORITY_TRIVIAL: '#8c8c8c'    // 琐事
```

### 状态颜�?

```typescript
SUCCESS: '#4caf50'       // 成功状�?
ERROR: '#f44336'         // 错误状�?
WARNING: '#ff9800'       // 警告状�?
INFO: '#2196f3'          // 信息状�?
```

### 深色主题

深色主题使用不同的背景和文本颜色，但保持相同的主色调和状态颜色：

```typescript
BACKGROUND: '#1a1a1a'
BACKGROUND_CARD: '#2a2a2a'
TEXT_PRIMARY: '#ffffff'
TEXT_SECONDARY: '#999999'
BORDER: '#333333'
```

## 字体系统

### 字体大小

```typescript
TINY: 10      // 极小文本
SMALL: 12     // 小文本、标�?
MEDIUM: 14    // 次要文本
REGULAR: 16   // 正文
LARGE: 18     // 大文�?
XLARGE: 20    // 特大文本
XXLARGE: 24   // 标题
TITLE: 28     // 大标�?
HERO: 32      // 超大标题
```

### 字体粗细

```typescript
LIGHT: '300'      // 细体
REGULAR: '400'    // 常规
MEDIUM: '500'     // 中等
SEMIBOLD: '600'   // 半粗
BOLD: '700'       // 粗体
EXTRABOLD: '800'  // 特粗
```

### 行高

```typescript
TIGHT: 1.2      // 紧凑
NORMAL: 1.5     // 正常
RELAXED: 1.75   // 宽松
LOOSE: 2        // 很宽�?
```

## 间距系统

### 统一间距

使用 8px 基准的间距系统：

```typescript
xs: 4    // 极小间距
sm: 8    // 小间�?
md: 16   // 中等间距（默认）
lg: 24   // 大间�?
xl: 32   // 特大间距
xxl: 48  // 超大间距
```

### 圆角

```typescript
BORDER_RADIUS_SMALL: 4    // 小圆�?
BORDER_RADIUS: 8          // 默认圆角
BORDER_RADIUS_LARGE: 12   // 大圆�?
BORDER_RADIUS_XLARGE: 16  // 特大圆角
BORDER_RADIUS_ROUND: 999  // 完全圆形
```

### 阴影

提供 5 个级别的阴影�?

```typescript
NONE: 无阴�?
SMALL: 轻微阴影（elevation: 2�?
MEDIUM: 中等阴影（elevation: 4�?
LARGE: 明显阴影（elevation: 8�?
XLARGE: 强烈阴影（elevation: 12�?
```

## 组件样式

### 按钮

```typescript
// 主要按钮
<TouchableOpacity style={buttonStyles.primary}>
  <Text style={textStyles.button}>确认</Text>
</TouchableOpacity>

// 次要按钮
<TouchableOpacity style={buttonStyles.secondary}>
  <Text style={[textStyles.button, { color: COLORS.PRIMARY }]}>取消</Text>
</TouchableOpacity>

// 文本按钮
<TouchableOpacity style={buttonStyles.text}>
  <Text style={textStyles.link}>了解更多</Text>
</TouchableOpacity>
```

### 输入�?

```typescript
<View style={inputStyles.container}>
  <Text style={inputStyles.label}>任务标题</Text>
  <TextInput
    style={inputStyles.input}
    placeholder="准备做什么？"
    placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
  />
</View>
```

### 卡片

```typescript
// 基础卡片
<View style={containerStyles.card}>
  <Text style={textStyles.heading}>标题</Text>
  <Text style={textStyles.body}>内容</Text>
</View>

// 带阴影的卡片
<View style={containerStyles.cardElevated}>
  <Text style={textStyles.heading}>标题</Text>
  <Text style={textStyles.body}>内容</Text>
</View>
```

### 标签

```typescript
const tagStyle = createTagStyle(COLORS.ACCENT, COLORS.TEXT_SECONDARY);

<View style={tagStyle.container}>
  <Text style={tagStyle.text}>#标签</Text>
</View>
```

## 响应式设�?

### 屏幕适配

使用响应式工具函数适配不同屏幕尺寸�?

```typescript
import { responsive } from './utils/responsive';

// 缩放尺寸
const width = responsive.scaleWidth(100);
const height = responsive.scaleHeight(50);

// 适度缩放（推荐用于字体和间距�?
const fontSize = responsive.moderateScale(16);
const padding = responsive.moderateScale(16, 0.3);

// 百分比计�?
const cardWidth = responsive.widthPercentage(90);
const cardHeight = responsive.heightPercentage(30);

// 根据设备类型返回不同�?
const spacing = responsive.responsiveValue(
  8,   // 小屏�?
  12,  // 中等屏幕
  16,  // 大屏�?
  24   // 平板
);
```

### 设备判断

```typescript
import { deviceType } from './utils/responsive';

if (deviceType.isSmallDevice) {
  // 小屏幕设备特殊处�?
}

if (deviceType.isTablet) {
  // 平板设备特殊处理
}

if (deviceType.isAndroid) {
  // Android 特殊处理
}
```

### 响应式样�?

```typescript
import { createResponsiveStyle, screenInfo } from './utils/responsive';

const styles = StyleSheet.create({
  container: createResponsiveStyle((screen) => ({
    padding: screen.width < 375 ? 12 : 16,
    fontSize: screen.width < 375 ? 14 : 16,
  })),
});
```

## 主题切换

### 使用主题

```typescript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, isDark, setThemeMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
      
      <TouchableOpacity onPress={() => setThemeMode('dark')}>
        <Text>切换到深色模�?/Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 主题感知样式

```typescript
import { useTheme } from '../contexts/ThemeContext';
import { getThemedColor } from '../utils/styleUtils';

const MyComponent = () => {
  const { isDark } = useTheme();
  
  const backgroundColor = getThemedColor(
    isDark,
    COLORS.BACKGROUND_CARD,
    DARK_COLORS.BACKGROUND_CARD
  );
  
  return <View style={{ backgroundColor }} />;
};
```

## 使用示例

### 完整组件示例

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  containerStyles,
  textStyles,
  buttonStyles,
  shadowStyles,
} from '../utils/styles';

const TaskCard = ({ task, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.card,
        shadowStyles.shadow,
        { backgroundColor: theme.card }
      ]}
      onPress={onPress}
    >
      <Text style={[textStyles.heading, { color: theme.text }]}>
        {task.title}
      </Text>
      
      {task.description && (
        <Text style={[textStyles.secondary, { color: theme.textSecondary }]}>
          {task.description}
        </Text>
      )}
      
      <View style={styles.footer}>
        {task.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  tag: {
    backgroundColor: '#f5eefb',
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    color: '#666666',
  },
});

export default TaskCard;
```

### 工具函数使用

```typescript
import {
  createCardStyle,
  createButtonStyle,
  getPriorityColor,
  conditionalStyle,
} from '../utils/styleUtils';

// 创建卡片样式
const cardStyle = createCardStyle(true); // 带阴�?

// 创建按钮样式
const primaryButton = createButtonStyle('primary', 'large');
const secondaryButton = createButtonStyle('secondary', 'small');

// 获取优先级颜�?
const borderColor = getPriorityColor('important'); // '#dc663c'

// 条件样式
const style = conditionalStyle(
  isSelected,
  { backgroundColor: '#dc663c' },
  { backgroundColor: '#f0f0f0' }
);
```

## 最佳实�?

### 1. 使用常量而非硬编�?

�?不推荐：
```typescript
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
});
```

�?推荐�?
```typescript
import { FONT_SIZES, COLORS, SPACING } from '../utils/constants';

const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
});
```

### 2. 使用全局样式

�?不推荐：
```typescript
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
    标题
  </Text>
</View>
```

�?推荐�?
```typescript
import { containerStyles, textStyles } from '../utils/globalStyles';

<View style={containerStyles.centerContainer}>
  <Text style={textStyles.title}>标题</Text>
</View>
```

### 3. 使用主题感知

�?不推荐：
```typescript
<View style={{ backgroundColor: '#ffffff' }}>
  <Text style={{ color: '#000000' }}>内容</Text>
</View>
```

�?推荐�?
```typescript
const { theme } = useTheme();

<View style={{ backgroundColor: theme.card }}>
  <Text style={{ color: theme.text }}>内容</Text>
</View>
```

### 4. 使用响应式工�?

�?不推荐：
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 16,
    fontSize: 14,
  },
});
```

�?推荐�?
```typescript
import { responsive } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    padding: responsive.moderateScale(16, 0.3),
    fontSize: responsive.scaleFontSize(14),
  },
});
```

### 5. 组合样式

�?不推荐：
```typescript
<View style={{
  backgroundColor: '#ffffff',
  borderRadius: 8,
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
}}>
```

�?推荐�?
```typescript
import { containerStyles, shadowStyles } from '../utils/globalStyles';

<View style={[containerStyles.card, shadowStyles.shadow]}>
```

## 性能优化

### 1. 避免内联样式

内联样式会在每次渲染时创建新对象，影响性能�?

### 2. 使用 StyleSheet.create

使用 `StyleSheet.create` 创建样式对象，可以优化性能�?

### 3. 使用 React.memo

对于样式复杂的组件，使用 `React.memo` 避免不必要的重渲染�?

### 4. 动画使用 useNativeDriver

所有动画尽可能使用 `useNativeDriver: true`，在原生线程执行�?

## 维护指南

### 添加新颜�?

1. �?`constants.ts` 中添加颜色常�?
2. 如果是主题相关，同时更新 `DARK_COLORS`
3. �?`theme.ts` 中更新主题对象（如需要）
4. 更新本文�?

### 添加新组件样�?

1. �?`globalStyles.ts` 中添加样式定�?
2. 或创建专用的样式工具函数�?`styleUtils.ts`
3. 添加使用示例到本文档

### 更新响应式规�?

1. �?`responsive.ts` 中更新相关函�?
2. 测试不同屏幕尺寸的表�?
3. 更新文档说明

## 总结

Detter 的样式系统提供了�?

- �?完整的颜色和字体系统
- �?统一的间距和尺寸规范
- �?可复用的全局样式
- �?响应式设计工�?
- �?主题切换支持
- �?丰富的工具函�?
- �?性能优化最佳实�?

遵循本指南可以确保应用的视觉一致性和代码可维护性�?
