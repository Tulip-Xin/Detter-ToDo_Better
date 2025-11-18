# Detter 开发者文档

本文档面向开发者，提供项目架构、开发流程、构建部署等详细信息。

## 📋 目录

- [项目概述](#项目概述)
- [架构设计](#架构设计)
- [开发环境搭建](#开发环境搭建)
- [项目结构](#项目结构)
- [核心模块说明](#核心模块说明)
- [开发规范](#开发规范)
- [构建和部署](#构建和部署)
- [测试指南](#测试指南)
- [性能优化](#性能优化)
- [故障排查](#故障排查)

---

## 项目概述

### 技术栈

```
┌─────────────────────────────────────────┐
│        React Native 0.72+              │
│        TypeScript 4.9+                 │
├─────────────────────────────────────────┤
│ UI Layer                               │
│ - React Navigation 6.x                 │
│ - React Native Reanimated 3.x          │
│ - React Native Gesture Handler 2.x     │
├─────────────────────────────────────────┤
│ State Management                       │
│ - React Context API                    │
│ - useReducer                           │
├─────────────────────────────────────────┤
│ Data Layer                             │
│ - SQLite (react-native-sqlite-storage) │
│ - Repository Pattern                   │
├─────────────────────────────────────────┤
│ Platform                               │
│ - Android 9.0+ (API 28+)               │
└─────────────────────────────────────────┘
```

### 核心依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| react-native | 0.72+ | 核心框架 |
| typescript | 4.9+ | 类型系统 |
| @react-navigation/native | 6.x | 导航管理 |
| react-native-reanimated | 3.x | 高性能动画 |
| react-native-gesture-handler | 2.x | 手势处理 |
| react-native-sqlite-storage | 6.x | 本地数据库 |
| @gorhom/bottom-sheet | 4.x | 底部面板 |
| date-fns | 2.x | 日期处理 |
| react-native-chart-kit | 6.x | 图表展示 |
| @notifee/react-native | 7.x | 本地通知 |

---

## 架构设计

### 分层架构

```
┌──────────────────────────────────────────────┐
│ Presentation Layer (UI Components)          │
│ - Screens (TaskScreen, ReflectionScreen)    │
│ - Components (TaskItem, CardListView)       │
│ - Navigation (BottomTabNavigator)           │
├──────────────────────────────────────────────┤
│ Business Logic Layer                        │
│ - Contexts (TaskContext, ThemeContext)      │
│ - Hooks (useTasks, useDatabase)             │
│ - Utils (dateUtils, filterUtils)            │
├──────────────────────────────────────────────┤
│ Data Access Layer                           │
│ - Services (TaskService, ReflectionService) │
│ - Repository Pattern                        │
├──────────────────────────────────────────────┤
│ Storage Layer                               │
│ - DatabaseService (SQLite)                  │
│ - Local Storage                             │
└──────────────────────────────────────────────┘
```

### 数据流

```
User Action
    ↓
Component Event Handler
    ↓
Context Action Dispatcher
    ↓
Service Layer (Business Logic)
    ↓
DatabaseService (Data Persistence)
    �?
SQLite Database
    �?
Service Layer (Data Retrieval)
    �?
Context State Update
    �?
Component Re-render
```

### 状态管�?

使用 React Context API + useReducer 模式�?

```typescript
// TaskContext 示例
interface TaskState {
  tasks: Task[];
  selectedDate: Date;
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  // Reducer logic
};
```

---

## 开发环境搭�?

### 系统要求

**Windows 开发环�?*:
- Windows 10/11 (64-bit)
- Node.js 16+ (推荐 18 LTS)
- JDK 11 �?17
- Android Studio Arctic Fox 或更高版�?
- Android SDK (API 28-33)

**必需的环境变�?*:
```cmd
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-17
```

### 快速开�?

```cmd
# 1. 克隆项目
git clone https://github.com/yourusername/detter.git
cd detter/DetterApp

# 2. 安装依赖
npm install

# 3. 检查环�?
preview-tools\check-environment.bat

# 4. 启动开发服务器
npm start

# 5. 运行 Android (新终�?
npm run android
```

### 详细配置步骤

参考以下文档：
- [开发环境配置](SETUP.md) - 详细的环境搭建步�?
- [Windows 预览指南](../preview-tools/WINDOWS_PREVIEW_GUIDE.md) - Windows 特定配置

---

## 项目结构

### 目录组织

```
DetterApp/
├── android/                    # Android 原生代码
�?  ├── app/
�?  �?  ├── src/main/
�?  �?  �?  ├── AndroidManifest.xml
�?  �?  �?  └── res/          # 资源文件
�?  �?  ├── build.gradle      # 应用级构建配�?
�?  �?  └── proguard-rules.pro
�?  ├── gradle/               # Gradle 配置
�?  └── build.gradle          # 项目级构建配�?
�?
├── src/                       # 源代�?
�?  ├── components/           # UI 组件
�?  �?  ├── common/          # 通用组件
�?  �?  �?  ├── BottomSheet.tsx
�?  �?  �?  ├── DateSelector.tsx
�?  �?  �?  ├── Calendar.tsx
�?  �?  �?  ├── SearchBar.tsx
�?  �?  �?  ├── FilterPanel.tsx
�?  �?  �?  ├── TagInput.tsx
�?  �?  �?  └── TimePicker.tsx
�?  �?  ├── task/            # 任务相关组件
�?  �?  �?  ├── TaskItem.tsx
�?  �?  �?  ├── PriorityContainer.tsx
�?  �?  �?  ├── TaskBoard.tsx
�?  �?  �?  ├── TaskAddPanel.tsx
�?  �?  �?  ├── TaskEditPanel.tsx
�?  �?  �?  ├── SubTaskList.tsx
�?  �?  �?  ├── SwipeableTaskItem.tsx
�?  �?  �?  └── DraggableTaskList.tsx
�?  �?  ├── reflection/      # 复盘相关组件
�?  �?  �?  ├── CardListView.tsx
�?  �?  �?  ├── ChecklistView.tsx
�?  �?  �?  ├── ReflectionCard.tsx
�?  �?  �?  └── ReflectionInputPanel.tsx
�?  �?  └── profile/         # 个人中心组件
�?  �?      ├── CompletionRateChart.tsx
�?  �?      ├── TaskDistributionChart.tsx
�?  �?      ├── ReflectionStatsCard.tsx
�?  �?      ├── ThemeSettings.tsx
�?  �?      ├── NotificationSettings.tsx
�?  �?      ├── DataExport.tsx
�?  �?      ├── DataImport.tsx
�?  �?      ├── DataClear.tsx
�?  �?      └── AboutAndHelp.tsx
�?  �?
�?  ├── screens/              # 页面组件
�?  �?  ├── TaskScreen.tsx
�?  �?  ├── ReflectionScreen.tsx
�?  �?  ├── ProfileScreen.tsx
�?  �?  ├── TaskEditScreen.tsx
�?  �?  └── ReflectionDetailScreen.tsx
�?  �?
�?  ├── navigation/           # 导航配置
�?  �?  └── BottomTabNavigator.tsx
�?  �?
�?  ├── contexts/             # 状态管�?
�?  �?  ├── TaskContext.tsx
�?  �?  └── ThemeContext.tsx
�?  �?
�?  ├── services/             # 业务逻辑服务
�?  �?  ├── DatabaseService.ts
�?  �?  ├── TaskService.ts
�?  �?  ├── ReflectionService.ts
�?  �?  ├── StatisticsService.ts
�?  �?  └── NotificationService.ts
�?  �?
�?  ├── models/               # 数据模型
�?  �?  ├── types.ts
�?  �?  └── index.ts
�?  �?
�?  ├── utils/                # 工具函数
�?  �?  ├── constants.ts
�?  �?  ├── dateUtils.ts
�?  �?  ├── filterUtils.ts
�?  �?  └── theme.ts
�?  �?
�?  └── hooks/                # 自定�?Hooks
�?      └── (待实�?
�?
├── __tests__/                # 测试文件
�?  ├── unit/                # 单元测试
�?  ├── integration/         # 集成测试
�?  └── performance/         # 性能测试
�?
├── docs/                     # 项目文档
�?  ├── completions/         # 任务完成文档
�?  ├── USER_GUIDE.md        # 用户指南
�?  ├── DEVELOPER_GUIDE.md   # 开发者指�?
�?  ├── KNOWN_ISSUES.md      # 已知问题
�?  └── ...
�?
├── preview-tools/            # 预览工具
�?  ├── start-dev.bat        # 启动脚本
�?  ├── check-environment.bat
�?  └── ...
�?
├── App.tsx                   # 应用入口
├── index.js                  # React Native 入口
├── package.json              # 依赖配置
├── tsconfig.json             # TypeScript 配置
├── babel.config.js           # Babel 配置
├── jest.config.js            # Jest 配置
└── .eslintrc.js              # ESLint 配置
```

### 文件命名规范

- **组件文件**: PascalCase (例如: `TaskItem.tsx`)
- **工具文件**: camelCase (例如: `dateUtils.ts`)
- **常量文件**: camelCase (例如: `constants.ts`)
- **测试文件**: `*.test.ts` �?`*.test.tsx`
- **类型文件**: `types.ts` �?`*.types.ts`

---

## 核心模块说明

### 1. 数据�?(Services)

#### DatabaseService

负责 SQLite 数据库的初始化和管理�?

```typescript
class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  
  async init(): Promise<void>;
  async createTables(): Promise<void>;
  async transaction(callback: Function): Promise<void>;
  async executeSql(sql: string, params?: any[]): Promise<any>;
}
```

**关键功能**:
- 数据库初始化
- 表结构创�?
- 事务管理
- SQL 执行

#### TaskService

任务相关的业务逻辑�?

```typescript
class TaskService {
  async createTask(task: Omit<Task, 'id'>): Promise<Task>;
  async getTasksByDate(date: Date): Promise<Task[]>;
  async updateTask(task: Task): Promise<void>;
  async deleteTask(taskId: string): Promise<void>;
  async getCompletedTasks(): Promise<Task[]>;
  async updateTaskOrders(updates: Array<{id: string; order: number}>): Promise<void>;
}
```

**数据库表结构**:
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL,
  tags TEXT,
  subtasks TEXT,
  due_date INTEGER NOT NULL,
  reminder_time INTEGER,
  completed INTEGER DEFAULT 0,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  task_order INTEGER NOT NULL,
  archived INTEGER DEFAULT 0
);
```

#### ReflectionService

复盘笔记相关的业务逻辑�?

```typescript
class ReflectionService {
  async createReflection(reflection: Omit<Reflection, 'id'>): Promise<Reflection>;
  async getReflectionByTaskId(taskId: string): Promise<Reflection | null>;
  async updateReflection(reflection: Reflection): Promise<void>;
  async deleteReflection(reflectionId: string): Promise<void>;
}
```

### 2. 状态管�?(Contexts)

#### TaskContext

管理任务相关的全局状态�?

```typescript
interface TaskContextValue {
  state: TaskState;
  loadTasks: (date: Date) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
}
```

**使用示例**:
```typescript
const { state, loadTasks, addTask } = useContext(TaskContext);

useEffect(() => {
  loadTasks(new Date());
}, []);
```

#### ThemeContext

管理主题相关的全局状态�?

```typescript
interface ThemeContextValue {
  theme: Theme;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}
```

### 3. UI 组件

#### 通用组件 (common/)

**BottomSheet**: 底部弹出面板
- 使用 `@gorhom/bottom-sheet`
- 支持多个 snap points
- 自动键盘处理

**DateSelector**: 日期选择�?
- 横向滚动
- 预加载前后数�?
- 高亮当前日期

**Calendar**: 日历组件
- 公历 + 农历显示
- 月份切换
- 日期选择

#### 任务组件 (task/)

**TaskItem**: 任务�?
- 复选框
- 标题、描述、标签显�?
- 完成状态动�?

**PriorityContainer**: 优先级容�?
- 三个优先级分�?
- 空状态占位符
- 拖拽排序支持

**TaskBoard**: 任务看板
- 组合三个优先级容�?
- 下拉刷新
- 日期切换

#### 复盘组件 (reflection/)

**CardListView**: 卡片列表视图
- 动态缩放效�?
- 自动居中对齐
- 惯性滚动控�?

**ChecklistView**: 清单列表视图
- 简洁列表展�?
- 复盘状态标�?
- 日期排序

---

## 开发规�?

### TypeScript 规范

```typescript
// �?好的实践
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const createTask = (data: Omit<Task, 'id'>): Task => {
  return {
    id: uuid.v4(),
    ...data,
  };
};

// �?避免
const createTask = (data: any): any => {
  // ...
};
```

### 组件规范

```typescript
// �?函数组件 + TypeScript
interface TaskItemProps {
  task: Task;
  onPress: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(task.id);
  }, [task.id, onPress]);
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{task.title}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(TaskItem);
```

### 样式规范

```typescript
// �?使用 StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

// �?避免内联样式
<View style={{ flex: 1, backgroundColor: '#fff' }}>
```

### 命名规范

```typescript
// 组件: PascalCase
TaskItem, DateSelector, BottomSheet

// 函数: camelCase
loadTasks, handlePress, formatDate

// 常量: UPPER_SNAKE_CASE
COLORS, SIZES, API_URL

// 类型/接口: PascalCase
Task, TaskState, TaskAction

// 文件: 与导出内容一�?
TaskItem.tsx, dateUtils.ts, constants.ts
```

### Git 提交规范

```bash
# 格式: <type>(<scope>): <subject>

# 类型
feat: 新功�?
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关

# 示例
feat(task): 添加任务拖拽排序功能
fix(reflection): 修复卡片缩放动画卡顿
docs(readme): 更新安装说明
```

---

## 构建和部�?

### 开发构�?

```cmd
# 启动 Metro bundler
npm start

# 运行 Android (Debug)
npm run android

# 清理缓存
npm start -- --reset-cache
```

### 生产构建

#### 1. 配置签名

生成 keystore:
```cmd
cd android
generate-keystore.bat
```

配置环境变量:
```cmd
set KEYSTORE_PASSWORD=your_password
set KEY_ALIAS=detter-key
set KEY_PASSWORD=your_password
```

#### 2. 构建 APK

```cmd
# 方式 1: 使用脚本
cd android
build-release.bat

# 方式 2: 手动构建
cd android
gradlew assembleRelease
```

输出位置: `android/app/build/outputs/apk/release/app-release.apk`

#### 3. 构建 AAB (Google Play)

```cmd
cd android
gradlew bundleRelease
```

输出位置: `android/app/build/outputs/bundle/release/app-release.aab`

### APK 优化

参�?[APK_OPTIMIZATION.md](../android/APK_OPTIMIZATION.md):

1. **启用 ProGuard**
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

2. **启用 Hermes**
```gradle
project.ext.react = [
    enableHermes: true
]
```

3. **分离 ABI**
```gradle
splits {
    abi {
        enable true
        reset()
        include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        universalApk false
    }
}
```

### 发布检查清�?

参�?[RELEASE_CHECKLIST.md](../android/RELEASE_CHECKLIST.md):

- [ ] 更新版本�?(versionCode, versionName)
- [ ] 测试所有核心功�?
- [ ] 检查性能指标
- [ ] 更新 CHANGELOG
- [ ] 生成签名 APK/AAB
- [ ] 测试 Release 版本
- [ ] 准备应用商店资源

---

## 测试指南

### 测试结构

```
__tests__/
├── unit/                    # 单元测试
�?  ├── services/
�?  ├── utils/
�?  └── contexts/
├── integration/             # 集成测试
�?  ├── TaskCreationFlow.test.tsx
�?  ├── TaskCompletionFlow.test.tsx
�?  └── DataImportExportFlow.test.tsx
└── performance/             # 性能测试
    ├── StartupPerformance.test.tsx
    ├── ListPerformance.test.tsx
    └── AnimationPerformance.test.tsx
```

### 运行测试

```cmd
# 运行所有测�?
npm test

# 运行特定测试
npm test -- TaskService.test.ts

# 生成覆盖率报�?
npm test -- --coverage

# 监听模式
npm test -- --watch
```

### 测试示例

**单元测试**:
```typescript
describe('TaskService', () => {
  it('should create a new task', async () => {
    const taskData = {
      title: '测试任务',
      priority: 'important',
      dueDate: new Date(),
      // ...
    };
    
    const task = await TaskService.createTask(taskData);
    
    expect(task.id).toBeDefined();
    expect(task.title).toBe('测试任务');
  });
});
```

**组件测试**:
```typescript
describe('TaskItem', () => {
  it('should render task title', () => {
    const { getByText } = render(
      <TaskItem task={mockTask} onPress={jest.fn()} />
    );
    
    expect(getByText('测试任务')).toBeTruthy();
  });
});
```

### 测试覆盖率目�?

- 核心业务逻辑: 90%+
- UI 组件: 70%+
- 工具函数: 95%+

---

## 性能优化

### 1. 渲染优化

```typescript
// 使用 React.memo
const TaskItem = React.memo(({ task, onPress }) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.updatedAt === nextProps.task.updatedAt;
});

// 使用 useCallback
const handlePress = useCallback(() => {
  onPress(task.id);
}, [task.id, onPress]);

// 使用 useMemo
const sortedTasks = useMemo(() => {
  return tasks.sort((a, b) => a.order - b.order);
}, [tasks]);
```

### 2. 列表优化

```typescript
<FlatList
  data={tasks}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  // 性能优化配置
  windowSize={10}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews={true}
  initialNumToRender={10}
/>
```

### 3. 动画优化

```typescript
// 使用 react-native-reanimated
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: withSpring(pressed.value ? 0.95 : 1) }
    ],
  };
});
```

### 4. 数据库优�?

```sql
-- 添加索引
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- 使用事务
BEGIN TRANSACTION;
-- 批量操作
COMMIT;
```

---

## 故障排查

### 常见问题

#### 1. Metro bundler 启动失败

```cmd
# 清理缓存
npm start -- --reset-cache

# 删除临时文件
rmdir /s /q %TEMP%\metro-*
rmdir /s /q %TEMP%\haste-map-*
```

#### 2. Android 构建失败

```cmd
# 清理构建
cd android
gradlew clean

# 删除 build 目录
rmdir /s /q app\build

# 重新构建
gradlew assembleDebug
```

#### 3. 依赖安装问题

```cmd
# 清理并重新安�?
rmdir /s /q node_modules
del package-lock.json
npm install
```

#### 4. 数据库错�?

```typescript
// 检查数据库初始�?
await DatabaseService.init();

// 查看数据库文�?
// Android: /data/data/com.detterapp/databases/detter.db
```

#### 5. 性能问题

```typescript
// 使用 Performance Monitor
import { PerformanceObserver } from 'react-native';

// 检查渲染性能
console.log('Render time:', performance.now());
```

### 调试工具

**React Native Debugger**:
```cmd
# 启动调试�?
npm start

# 在模拟器中按 Ctrl+M (Windows) �?Cmd+D (Mac)
# 选择 "Debug"
```

**Flipper**:
- 网络请求监控
- 数据库查�?
- 布局检�?
- 性能分析

**Chrome DevTools**:
- Console 日志
- Network 监控
- Source 调试

---

## 贡献指南

### 开发流�?

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### Code Review 检查项

- [ ] 代码符合项目规范
- [ ] 添加了必要的测试
- [ ] 测试全部通过
- [ ] 更新了相关文�?
- [ ] 没有引入新的警告
- [ ] 性能没有明显下降

---

## 相关文档

- [用户使用指南](USER_GUIDE.md)
- [已知问题和限制](KNOWN_ISSUES.md)
- [项目结构说明](PROJECT_STRUCTURE.md)
- [开发环境配置](SETUP.md)
- [Android 构建部署](../android/BUILD_AND_DEPLOY.md)
- [测试指南](TESTING_GUIDE.md)

---

## 联系方式

- **项目主页**: https://github.com/yourusername/detter
- **问题反馈**: https://github.com/yourusername/detter/issues
- **邮件**: dev@detter.app

---

**最后更�?*: 2025  
**版本**: v1.0.0  
**文档版本**: 1.0
