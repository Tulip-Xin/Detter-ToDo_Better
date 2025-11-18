# Detter App - 开发环境配置指�?

## 前置要求

### 必需软件
- Node.js >= 16
- npm �?yarn
- JDK 11 或更高版�?
- Android Studio（用�?Android 开发）
- Android SDK（API Level 31 或更高）

### 环境变量配置
确保以下环境变量已正确配置：
- `ANDROID_HOME`: Android SDK 路径
- `JAVA_HOME`: JDK 路径

## 安装步骤

### 1. 安装依赖

```bash
# 进入项目目录
cd DetterApp

# 安装 npm 依赖
npm install
```

### 2. 配置 Android 环境

确保 Android Studio 已安装并配置�?Android SDK�?

检�?Android 环境�?
```bash
npx react-native doctor
```

### 3. 链接原生依赖

某些依赖需要链接到原生代码�?

```bash
# react-native-reanimated 需要在 babel.config.js 中配置（已完成）
# react-native-gesture-handler 需要在入口文件中导入（后续任务�?
# react-native-sqlite-storage 需要原生链接（自动完成�?
```

### 4. 运行应用

#### Android
```bash
# 启动 Metro bundler
npm start

# 在另一个终端运�?Android
npm run android
```

#### iOS（仅 macOS�?
```bash
# 安装 CocoaPods 依赖
cd ios
pod install
cd ..

# 运行 iOS
npm run ios
```

## 项目配置说明

### TypeScript 配置
- 启用严格模式
- 配置路径别名 `@/*` 指向 `src/*`
- 包含 `src` 目录下所有文�?

### Babel 配置
- 使用 metro-react-native-babel-preset
- 添加 react-native-reanimated/plugin 插件（必须放在最后）

### ESLint 配置
- 继承 @react-native 配置
- 添加 TypeScript 支持
- 自定义规则：
  - 警告内联样式
  - 错误未使用变量（忽略 `_` 开头的参数�?
  - 警告 console.log（允�?warn �?error�?

## 核心依赖说明

### 导航
- `@react-navigation/native`: 核心导航�?
- `@react-navigation/bottom-tabs`: 底部标签导航
- `@react-navigation/stack`: 堆栈导航
- `react-native-screens`: 原生屏幕优化
- `react-native-safe-area-context`: 安全区域处理

### 数据存储
- `react-native-sqlite-storage`: SQLite 数据�?

### 动画和手�?
- `react-native-reanimated`: 高性能动画�?
- `react-native-gesture-handler`: 手势处理
- `@gorhom/bottom-sheet`: 底部弹出面板

### 工具�?
- `date-fns`: 日期处理
- `uuid`: 生成唯一 ID
- `lunar-javascript`: 农历计算
- `react-native-fs`: 文件系统操作

### UI 组件
- `react-native-chart-kit`: 图表组件
- `react-native-svg`: SVG 支持

## 常见问题

### 1. Metro bundler 缓存问题
```bash
npm start -- --reset-cache
```

### 2. Android 构建失败
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### 3. 依赖链接问题
```bash
# 清理并重新安�?
rm -rf node_modules
npm install
```

### 4. TypeScript 类型错误
确保所有依赖都已安装：
```bash
npm install
```

## 开发工具推�?

- **IDE**: Visual Studio Code
- **插件**:
  - ESLint
  - Prettier
  - React Native Tools
  - TypeScript and JavaScript Language Features

## 下一�?

项目初始化完成后，可以开始实现具体功能：
1. 数据层（DatabaseService, TaskService�?
2. 状态管理（Context�?
3. 导航结构
4. UI 组件

参�?`PROJECT_STRUCTURE.md` 了解项目结构详情�?
