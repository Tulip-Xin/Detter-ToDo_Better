# Detter App - 项目结构说明

## 目录结构

```
DetterApp/
├── android/                    # Android 原生代码
├── ios/                        # iOS 原生代码
├── src/                        # 源代码目�?
�?  ├── components/            # 可复用组�?
�?  �?  ├── common/           # 通用组件（BottomSheet, DateSelector, Calendar等）
�?  �?  ├── task/             # 任务相关组件（TaskItem, PriorityContainer等）
�?  �?  └── reflection/       # 复盘相关组件（CardListView, ChecklistView等）
�?  ├── screens/              # 屏幕组件
�?  �?  ├── TaskScreen.tsx
�?  �?  ├── ReflectionScreen.tsx
�?  �?  ├── ProfileScreen.tsx
�?  �?  ├── TaskEditScreen.tsx
�?  �?  └── ReflectionDetailScreen.tsx
�?  ├── navigation/           # 导航配置
�?  �?  └── AppNavigator.tsx
�?  ├── contexts/             # Context 状态管�?
�?  �?  ├── TaskContext.tsx
�?  �?  └── ThemeContext.tsx
�?  ├── services/             # 业务逻辑服务
�?  �?  ├── DatabaseService.ts
�?  �?  ├── TaskService.ts
�?  �?  ├── ReflectionService.ts
�?  �?  └── NotificationService.ts
�?  ├── models/               # 数据模型和类型定�?
�?  �?  ├── types.ts
�?  �?  └── index.ts
�?  ├── utils/                # 工具函数
�?  �?  ├── constants.ts      # 常量定义
�?  �?  ├── dateUtils.ts      # 日期处理工具
�?  �?  ├── theme.ts          # 主题配置
�?  �?  └── index.ts
�?  └── hooks/                # 自定�?Hooks
�?      ├── useDatabase.ts
�?      ├── useTasks.ts
�?      └── useAnimatedCard.ts
├── App.tsx                    # 应用入口
├── index.js                   # React Native 入口
├── package.json              # 依赖配置
├── tsconfig.json             # TypeScript 配置
├── babel.config.js           # Babel 配置
└── .eslintrc.js              # ESLint 配置
```

## 技术栈

- **框架**: React Native 0.72
- **语言**: TypeScript
- **导航**: React Navigation 6.x
- **状态管�?*: React Context API + useReducer
- **数据�?*: react-native-sqlite-storage
- **动画**: react-native-reanimated 3.x
- **手势**: react-native-gesture-handler 2.x
- **日期处理**: date-fns
- **图表**: react-native-chart-kit
- **其他**: @gorhom/bottom-sheet, lunar-javascript, react-native-fs

## 开发规�?

### 命名规范
- 组件文件：PascalCase (例如：TaskItem.tsx)
- 工具函数文件：camelCase (例如：dateUtils.ts)
- 常量：UPPER_SNAKE_CASE (例如：COLORS, SIZES)
- 类型/接口：PascalCase (例如：Task, Priority)

### 代码组织
- 每个功能模块独立目录
- 使用 barrel exports (index.ts) 简化导�?
- 组件按功能分类（common, task, reflection�?
- 服务层负责数据访问和业务逻辑

### TypeScript
- 启用严格模式
- 为所有函数参数和返回值添加类�?
- 使用接口定义数据结构
- 避免使用 any 类型

## 下一�?

项目基础架构已搭建完成，接下来的任务将按照以下顺序实现：

1. 数据层实现（DatabaseService, TaskService, ReflectionService�?
2. 状态管理（TaskContext, ThemeContext�?
3. 导航结构
4. 通用组件
5. 任务管理模块
6. 复盘模块
7. 个人中心模块
8. 性能优化和测�?

## 安装依赖

```bash
# 安装 npm 依赖
npm install

# iOS 依赖（仅 macOS�?
cd ios && pod install && cd ..

# 运行 Android
npm run android

# 运行 iOS（仅 macOS�?
npm run ios
```
