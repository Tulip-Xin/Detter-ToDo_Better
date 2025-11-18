# Detter 样式系统快速参�?

## 快速导�?

```typescript
// 方式 1: 导入常量
import { COLORS, SPACING, FONT_SIZES, SIZES } from './utils/constants';

// 方式 2: 导入全局样式
import { containerStyles, textStyles, buttonStyles } from './utils/globalStyles';

// 方式 3: 导入响应式工�?
import { responsive, scaleWidth, moderateScale } from './utils/responsive';

// 方式 4: 导入工具函数
import { createCardStyle, getPriorityColor } from './utils/styleUtils';

// 方式 5: 统一导入
import styles from './utils/styles';
```

## 常用颜色

```typescript
COLORS.PRIMARY           // #dc663c - 主色�?
COLORS.SECONDARY         // #eb9e28 - 次要�?
COLORS.BACKGROUND        // #ecfaf6 - 全局背景
COLORS.BACKGROUND_CARD   // #ffffff - 卡片背景
COLORS.TEXT_PRIMARY      // #000000 - 主要文本
COLORS.TEXT_SECONDARY    // #666666 - 次要文本
COLORS.SUCCESS           // #4caf50 - 成功
COLORS.ERROR             // #f44336 - 错误
COLORS.WARNING           // #ff9800 - 警告
```

## 常用间距

```typescript
SPACING.xs   // 4
SPACING.sm   // 8
SPACING.md   // 16  �?默认
SPACING.lg   // 24
SPACING.xl   // 32
```

## 常用字体

```typescript
FONT_SIZES.SMALL    // 12
FONT_SIZES.MEDIUM   // 14
FONT_SIZES.REGULAR  // 16  �?默认
FONT_SIZES.LARGE    // 18
FONT_SIZES.TITLE    // 28
```

## 快速样�?

### 容器

```typescript
// 基础容器
<View style={containerStyles.container} />

// 居中容器
<View style={containerStyles.centerContainer} />

// 卡片
<View style={containerStyles.card} />

// 行布局
<View style={containerStyles.row} />
<View style={containerStyles.rowSpaceBetween} />
```

### 文本

```typescript
// 标题
<Text style={textStyles.title}>标题</Text>
<Text style={textStyles.heading}>副标�?/Text>

// 正文
<Text style={textStyles.body}>正文</Text>
<Text style={textStyles.secondary}>次要文本</Text>

// 按钮文本
<Text style={textStyles.button}>按钮</Text>
```

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
```

## 响应�?

```typescript
// 缩放尺寸
const width = scaleWidth(100);
const height = scaleHeight(50);

// 适度缩放（推荐）
const fontSize = moderateScale(16);
const padding = moderateScale(16, 0.3);

// 百分�?
const cardWidth = responsive.widthPercentage(90);

// 根据设备返回不同�?
const spacing = responsive.responsiveValue(8, 12, 16, 24);
```

## 工具函数

```typescript
// 创建卡片
const cardStyle = createCardStyle(true); // 带阴�?

// 获取优先级颜�?
const color = getPriorityColor('important'); // #dc663c

// 条件样式
const style = conditionalStyle(
  isSelected,
  { backgroundColor: COLORS.PRIMARY },
  { backgroundColor: COLORS.BACKGROUND }
);

// 创建按钮
const btnStyle = createButtonStyle('primary', 'large');
```

## 主题

```typescript
import { useTheme } from './contexts/ThemeContext';

const MyComponent = () => {
  const { theme, isDark, setThemeMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>内容</Text>
    </View>
  );
};
```

## 常用组合

### 卡片组件

```typescript
<View style={[
  containerStyles.card,
  shadowStyles.shadow,
  { backgroundColor: theme.card }
]}>
  <Text style={[textStyles.heading, { color: theme.text }]}>
    标题
  </Text>
  <Text style={[textStyles.secondary, { color: theme.textSecondary }]}>
    描述
  </Text>
</View>
```

### 标签

```typescript
<View style={{
  backgroundColor: COLORS.ACCENT,
  borderRadius: SIZES.BORDER_RADIUS_ROUND,
  paddingHorizontal: SPACING.sm,
  paddingVertical: SPACING.xs,
}}>
  <Text style={{
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  }}>
    #标签
  </Text>
</View>
```

### 输入�?

```typescript
<View style={inputStyles.container}>
  <Text style={inputStyles.label}>标题</Text>
  <TextInput
    style={inputStyles.input}
    placeholder="请输�?
    placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
  />
</View>
```

## 优先级颜�?

```typescript
getPriorityColor('important')  // #dc663c
getPriorityColor('urgent')     // #eb9e28
getPriorityColor('trivial')    // #8c8c8c
```

## 阴影

```typescript
import { shadowStyles } from './utils/globalStyles';

<View style={shadowStyles.shadow_sm} />   // 轻微
<View style={shadowStyles.shadow} />      // 中等
<View style={shadowStyles.shadow_lg} />   // 明显
```

## 间距工具�?

```typescript
import { spacingStyles } from './utils/globalStyles';

<View style={spacingStyles.p_md} />    // padding: 16
<View style={spacingStyles.mt_lg} />   // marginTop: 24
<View style={spacingStyles.px_sm} />   // paddingHorizontal: 8
<View style={spacingStyles.my_xl} />   // marginVertical: 32
```

## 设备判断

```typescript
import { deviceType } from './utils/responsive';

if (deviceType.isSmallDevice) {
  // 小屏幕处�?
}

if (deviceType.isTablet) {
  // 平板处理
}

if (deviceType.isAndroid) {
  // Android 特殊处理
}
```

## 最佳实�?

### �?推荐

```typescript
// 使用常量
fontSize: FONT_SIZES.REGULAR,
color: COLORS.TEXT_PRIMARY,
padding: SPACING.md,

// 使用全局样式
<Text style={textStyles.body}>文本</Text>

// 使用主题
<View style={{ backgroundColor: theme.background }} />

// 使用响应�?
const size = moderateScale(16);
```

### �?避免

```typescript
// 硬编码�?
fontSize: 16,
color: '#000000',
padding: 16,

// 内联样式
<Text style={{ fontSize: 16, color: '#000' }}>文本</Text>

// 固定颜色
<View style={{ backgroundColor: '#ffffff' }} />

// 固定尺寸
const size = 16;
```

## 性能提示

1. 使用 `StyleSheet.create` 创建样式
2. 避免内联样式对象
3. 使用 `React.memo` 优化组件
4. 动画使用 `useNativeDriver: true`

## 更多信息

详细文档请参�?`STYLING_GUIDE.md`
