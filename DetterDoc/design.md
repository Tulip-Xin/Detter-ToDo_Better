# 设计文档

## 概述

Detter是一款基于React Native开发的跨平台待办事项管理应用，优先支持Android平台。应用采用模块化架构，分为三个主要功能模块：任务管理（行）、复盘反思（思）和个人中心（我）。技术栈包括React Native、React Navigation、SQLite数据库、以及react-native-reanimated和react-native-gesture-handler用于高性能动画和手势处理。

## 架构

### 整体架构

应用采用分层架构模式：

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Native Components & Screens)    │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│     (Hooks, Context, State Management)  │
├─────────────────────────────────────────┤
│         Data Access Layer               │
│      (Repository Pattern, Services)     │
├─────────────────────────────────────────┤
│         Storage Layer                   │
│         (SQLite Database)               │
└─────────────────────────────────────────┘
```

### 技术栈

- **框架**: React Native 0.72+
- **导航**: React Navigation 6.x (Bottom Tabs + Stack Navigator)
- **状态管理**: React Context API + useReducer
- **数据库**: react-native-sqlite-storage
- **动画**: react-native-reanimated 3.x
- **手势**: react-native-gesture-handler 2.x
- **日期处理**: date-fns
- **图表**: react-native-chart-kit
- **样式**: StyleSheet (内置)


## 组件与接口

### 核心模块结构

```
src/
├── components/           # 可复用组件
│   ├── common/          # 通用组件
│   │   ├── BottomSheet.tsx
│   │   ├── DateSelector.tsx
│   │   ├── Calendar.tsx
│   │   └── TagInput.tsx
│   ├── task/            # 任务相关组件
│   │   ├── TaskItem.tsx
│   │   ├── PriorityContainer.tsx
│   │   ├── TaskBoard.tsx
│   │   └── SubTaskList.tsx
│   └── reflection/      # 复盘相关组件
│       ├── CardListView.tsx
│       ├── ChecklistView.tsx
│       └── ReflectionCard.tsx
├── screens/             # 屏幕组件
│   ├── TaskScreen.tsx
│   ├── ReflectionScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── TaskEditScreen.tsx
│   └── ReflectionDetailScreen.tsx
├── navigation/          # 导航配置
│   └── AppNavigator.tsx
├── contexts/            # Context状态管理
│   ├── TaskContext.tsx
│   └── ThemeContext.tsx
├── services/            # 业务逻辑服务
│   ├── DatabaseService.ts
│   ├── TaskService.ts
│   └── NotificationService.ts
├── models/              # 数据模型
│   ├── Task.ts
│   ├── Reflection.ts
│   └── types.ts
├── utils/               # 工具函数
│   ├── dateUtils.ts
│   ├── colorUtils.ts
│   └── constants.ts
└── hooks/               # 自定义Hooks
    ├── useDatabase.ts
    ├── useTasks.ts
    └── useAnimatedCard.ts
```

### 主要组件接口

#### TaskItem 组件

```typescript
interface TaskItemProps {
  task: Task;
  priorityOrder: number;
  onComplete: (taskId: string) => void;
  onPress: (taskId: string) => void;
  onSwipeAction: (taskId: string, action: SwipeAction) => void;
  onDragStart: () => void;
  onDragEnd: (newOrder: number) => void;
}
```

#### PriorityContainer 组件

```typescript
interface PriorityContainerProps {
  priority: 'important' | 'urgent' | 'trivial';
  tasks: Task[];
  onAddTask: (priority: string) => void;
  onReorder: (taskIds: string[]) => void;
}
```

#### BottomSheet 组件

```typescript
interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  initialData?: Partial<Task>;
  onSave: (task: Task) => void;
}
```

#### CardListView 组件

```typescript
interface CardListViewProps {
  tasks: Task[];
  onCardPress: (taskId: string) => void;
}
```


## 数据模型

### Task 模型

```typescript
interface Task {
  id: string;                    // UUID
  title: string;                 // 任务标题
  description?: string;          // 任务描述
  priority: 'important' | 'urgent' | 'trivial';  // 优先级
  tags: string[];                // 标签数组
  subtasks: SubTask[];           // 子任务列表
  dueDate: Date;                 // 到期日期
  reminderTime?: Date;           // 提醒时间
  completed: boolean;            // 完成状态
  completedAt?: Date;            // 完成时间
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
  order: number;                 // 在优先级容器中的顺序
  archived: boolean;             // 归档状态
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}
```

### Reflection 模型

```typescript
interface Reflection {
  id: string;                    // UUID
  taskId: string;                // 关联的任务ID
  content: string;               // 复盘内容
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
}
```

### 数据库表结构

#### tasks 表

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL,
  tags TEXT,                     -- JSON数组字符串
  subtasks TEXT,                 -- JSON数组字符串
  due_date INTEGER NOT NULL,     -- Unix时间戳
  reminder_time INTEGER,         -- Unix时间戳
  completed INTEGER DEFAULT 0,   -- 0或1
  completed_at INTEGER,          -- Unix时间戳
  created_at INTEGER NOT NULL,   -- Unix时间戳
  updated_at INTEGER NOT NULL,   -- Unix时间戳
  task_order INTEGER NOT NULL,
  archived INTEGER DEFAULT 0     -- 0或1
);

CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

#### reflections 表

```sql
CREATE TABLE reflections (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX idx_reflections_task_id ON reflections(task_id);
```


## 核心功能设计

### 1. 任务管理模块（行）

#### 日期选择器设计

- 使用 `FlatList` 实现横向滚动
- 每个日期项包含星期和日期数字的垂直布局
- 使用 `useSharedValue` 和 `useAnimatedStyle` 实现高亮动画
- 预加载前后各2周的日期数据

```typescript
// 日期选择器状态管理
const [selectedDate, setSelectedDate] = useState(new Date());
const [dateRange, setDateRange] = useState(generateDateRange(new Date(), 7));

// 滚动到今天
const scrollToToday = () => {
  const todayIndex = dateRange.findIndex(d => isSameDay(d, new Date()));
  flatListRef.current?.scrollToIndex({ index: todayIndex, animated: true });
};
```

#### 任务看板设计

- 三个优先级容器使用 `ScrollView` 垂直排列
- 每个容器内使用 `react-native-draggable-flatlist` 实现拖拽排序
- 空状态显示占位符，点击触发添加任务
- 任务顺序通过 `order` 字段维护

#### 任务项交互

**完成任务流程:**
1. 点击复选框 → 更新任务状态为已完成
2. 触发动画：复选框填充、标题添加删除线、透明度降低
3. 延迟300ms后弹出复盘输入面板
4. 用户可选择输入复盘或关闭面板

**左滑操作:**
- 使用 `react-native-gesture-handler` 的 `Swipeable` 组件
- 右侧显示四个操作按钮：归档、删除、上移、下移
- 删除操作需要确认对话框

**拖拽排序:**
- 长按触发拖拽模式
- 实时更新优先级数字
- 拖拽结束后批量更新数据库中的 `order` 字段

#### 添加任务面板（BottomSheet）

使用 `@gorhom/bottom-sheet` 库实现：

```typescript
const snapPoints = useMemo(() => ['50%', '90%'], []);

// 日历展开时切换到90%高度
const handleDateModeChange = (mode: 'quick' | 'calendar') => {
  if (mode === 'calendar') {
    bottomSheetRef.current?.snapToIndex(1);
  }
};
```

**日历组件设计:**
- 使用 `react-native-calendars` 或自定义实现
- 显示公历和农历（使用 `lunar-javascript` 库）
- 支持月份切换，左右滑动
- 今天特殊标记

**标签输入:**
- 输入 `#` 后触发标签建议
- 从数据库查询已有标签
- 使用 `FlatList` 显示建议列表


### 2. 复盘模块（思）

#### 卡片列表视图动态效果实现

这是应用中最复杂的UI功能，需要使用 `react-native-reanimated` 和 `react-native-gesture-handler` 实现。

**核心实现思路:**

```typescript
// 使用 Animated.ScrollView 监听滚动
const scrollY = useSharedValue(0);
const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});

// 卡片组件内部计算缩放
const CardItem = ({ task, index, scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    // 计算卡片中心点位置
    const cardCenter = CARD_HEIGHT * index + CARD_HEIGHT / 2;
    // 计算屏幕中心点
    const screenCenter = SCREEN_HEIGHT / 2 + scrollY.value;
    // 计算距离
    const distance = Math.abs(cardCenter - screenCenter);
    // 映射到缩放值
    const scale = interpolate(
      distance,
      [0, SCREEN_HEIGHT / 2],
      [1, 0.8],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
    };
  });
  
  return <Animated.View style={[styles.card, animatedStyle]}>...</Animated.View>;
};
```

**自动居中对齐（Snap-to-Center）:**

```typescript
const onScrollEnd = useAnimatedScrollHandler({
  onMomentumEnd: (event) => {
    const offsetY = event.contentOffset.y;
    const screenCenter = SCREEN_HEIGHT / 2;
    
    // 找到最接近中心的卡片索引
    const targetIndex = Math.round((offsetY + screenCenter) / CARD_HEIGHT);
    const targetOffset = targetIndex * CARD_HEIGHT - screenCenter + CARD_HEIGHT / 2;
    
    // 平滑滚动到目标位置
    scrollTo(scrollViewRef, 0, targetOffset, true);
  },
});
```

**惯性滑动控制:**

```typescript
// 限制最大滚动距离
const onGestureEvent = useAnimatedGestureHandler({
  onEnd: (event) => {
    const velocity = event.velocityY;
    const maxCards = 3;
    const maxDistance = CARD_HEIGHT * maxCards;
    
    // 根据速度计算目标位置，但限制最大距离
    let targetOffset = scrollY.value + velocity * 0.5;
    targetOffset = Math.max(
      scrollY.value - maxDistance,
      Math.min(scrollY.value + maxDistance, targetOffset)
    );
    
    // 应用snap逻辑
    const targetIndex = Math.round(targetOffset / CARD_HEIGHT);
    scrollTo(scrollViewRef, 0, targetIndex * CARD_HEIGHT, true);
  },
});
```

**性能优化:**
- 使用 `FlatList` 的 `windowSize` 和 `maxToRenderPerBatch` 优化渲染
- 卡片内容使用 `React.memo` 避免不必要的重渲染
- 图片使用 `FastImage` 库缓存

#### 清单列表视图

- 使用标准 `FlatList` 实现
- 按完成日期降序排序
- 有复盘笔记的任务背景色 `#f2f2fd`
- 支持下拉刷新

#### 搜索与筛选

基于需求11，复盘模块提供强大的搜索和筛选功能：

**搜索功能** (需求11.1, 11.2):
- 点击搜索图标显示搜索输入框
- 实时搜索，输入时即时更新结果
- 搜索范围：任务标题、描述、标签、复盘笔记内容
- 支持模糊匹配

**筛选功能** (需求11.3, 11.4):
- 完成日期范围筛选
- 标签筛选（支持多选）
- 复盘状态筛选（已思/待思）
- 多个筛选条件可组合使用（AND逻辑）

**清除功能** (需求11.5):
- 一键清除所有搜索和筛选条件
- 恢复完整的已完成任务列表

```typescript
interface FilterOptions {
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  hasReflection?: boolean;
}

// 搜索和筛选逻辑
const filterTasks = (tasks: Task[], keyword: string, filters: FilterOptions) => {
  return tasks.filter(task => {
    // 关键词匹配（模糊搜索）
    const matchKeyword = !keyword || 
      task.title.toLowerCase().includes(keyword.toLowerCase()) ||
      task.description?.toLowerCase().includes(keyword.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())) ||
      task.reflection?.content.toLowerCase().includes(keyword.toLowerCase());
    
    // 日期范围筛选
    const matchDateRange = !filters.dateRange ||
      (task.completedAt >= filters.dateRange.start &&
       task.completedAt <= filters.dateRange.end);
    
    // 标签筛选（任意标签匹配）
    const matchTags = !filters.tags?.length ||
      filters.tags.some(tag => task.tags.includes(tag));
    
    // 复盘状态筛选
    const matchReflection = filters.hasReflection === undefined ||
      (filters.hasReflection ? !!task.reflection : !task.reflection);
    
    return matchKeyword && matchDateRange && matchTags && matchReflection;
  });
};
```

**设计决策理由**:
- 实时搜索提供即时反馈，提升用户体验
- 不区分大小写的模糊匹配更友好
- 筛选条件持久化，切换视图时保持
- 使用防抖优化搜索性能


### 3. 个人中心模块（我）

#### 数据统计设计

基于需求12，个人中心需要展示以下统计数据：

**1. 完成率图表** (需求12.1):
- 展示每日/每周/每月的任务完成数量和百分比
- 使用折线图或柱状图展示趋势
- 支持时间范围切换

**2. 任务分布图表** (需求12.2):
- 展示不同优先级任务的比例
- 使用饼图或环形图展示
- 显示具体数量和百分比

**3. 复盘习惯统计** (需求12.3):
- 计算有复盘笔记的任务占已完成任务的比率
- 展示复盘率趋势
- 鼓励用户提高复盘率

**4. 实时更新** (需求12.4):
- 任务数据变化时自动刷新统计
- 使用Context监听数据变化

使用 `react-native-chart-kit` 实现图表：

**完成率统计:**
```typescript
// 计算每日/每周/每月完成率
const calculateCompletionRate = (tasks: Task[], period: 'day' | 'week' | 'month') => {
  const now = new Date();
  const grouped = groupBy(tasks, task => {
    if (period === 'day') return format(task.completedAt, 'yyyy-MM-dd');
    if (period === 'week') return format(startOfWeek(task.completedAt), 'yyyy-MM-dd');
    return format(startOfMonth(task.completedAt), 'yyyy-MM');
  });
  
  return Object.entries(grouped).map(([date, tasks]) => ({
    date,
    completed: tasks.filter(t => t.completed).length,
    total: tasks.length,
    rate: tasks.filter(t => t.completed).length / tasks.length,
  }));
};
```

**任务分布图:**
```typescript
// 饼图数据
const taskDistribution = {
  important: tasks.filter(t => t.priority === 'important').length,
  urgent: tasks.filter(t => t.priority === 'urgent').length,
  trivial: tasks.filter(t => t.priority === 'trivial').length,
};
```

**复盘习惯统计:**
```typescript
const reflectionRate = {
  withReflection: tasks.filter(t => t.completed && t.reflection).length,
  completed: tasks.filter(t => t.completed).length,
  rate: tasks.filter(t => t.completed && t.reflection).length / 
        tasks.filter(t => t.completed).length,
};
```

**设计决策理由**:
- 图表库选择react-native-chart-kit，轻量且满足需求
- 统计数据缓存避免重复计算
- 使用useMemo优化性能
- 空数据状态提供友好提示

#### 主题切换

基于需求13.1和13.2，应用支持三种主题模式：

- **浅色模式**: 默认主题，背景色#ecfaf6
- **深色模式**: 护眼主题，背景色#1a1a1a
- **跟随系统**: 自动根据系统设置切换

使用 Context API 管理主题：

```typescript
interface Theme {
  background: string;
  text: string;
  primary: string;
  cardBackground: string;
  border: string;
  // ... 其他颜色
}

const lightTheme: Theme = {
  background: '#ecfaf6',
  text: '#000000',
  primary: '#dc663c',
  cardBackground: '#ffffff',
  border: '#e0e0e0',
  // ...
};

const darkTheme: Theme = {
  background: '#1a1a1a',
  text: '#ffffff',
  primary: '#dc663c',
  cardBackground: '#2a2a2a',
  border: '#404040',
  // ...
};

const ThemeContext = createContext<{
  theme: Theme;
  themeMode: 'light' | 'dark' | 'system';
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
}>({
  theme: lightTheme,
  themeMode: 'light',
  setTheme: () => {},
});
```

**设计决策理由**:
- Context API足够满足全局主题管理需求
- 主题配置持久化到AsyncStorage
- 跟随系统模式使用Appearance API监听系统变化
- 主题切换立即生效，无需重启应用

#### 数据导入导出

基于需求13.4和13.5，应用提供完整的数据导入导出功能：

**导出功能**:
- 支持JSON和CSV两种格式
- 包含所有任务和复盘笔记
- 文件保存到用户可访问的目录（Downloads或Documents）
- 支持分享导出文件

**导入功能**:
- 支持从JSON文件导入
- 验证数据格式和完整性
- 处理数据冲突（ID重复时生成新ID）
- 导入失败时回滚，不影响现有数据

```typescript
// 导出为JSON
const exportData = async (format: 'json' | 'csv') => {
  const tasks = await TaskService.getAllTasks();
  const reflections = await ReflectionService.getAllReflections();
  
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    tasks,
    reflections,
  };
  
  if (format === 'json') {
    const jsonString = JSON.stringify(data, null, 2);
    const filePath = `${RNFS.DownloadDirectoryPath}/detter_backup_${Date.now()}.json`;
    await RNFS.writeFile(filePath, jsonString, 'utf8');
    return filePath;
  } else {
    // CSV导出逻辑
    const csvContent = convertToCSV(tasks);
    const filePath = `${RNFS.DownloadDirectoryPath}/detter_tasks_${Date.now()}.csv`;
    await RNFS.writeFile(filePath, csvContent, 'utf8');
    return filePath;
  }
};

// 导入数据
const importData = async (filePath: string) => {
  try {
    const jsonString = await RNFS.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonString);
    
    // 验证数据格式
    if (!validateImportData(data)) {
      throw new Error('数据格式无效');
    }
    
    // 检查版本兼容性
    if (data.version !== '1.0') {
      throw new Error('数据版本不兼容');
    }
    
    // 使用事务批量插入数据
    await DatabaseService.transaction(async (tx) => {
      for (const task of data.tasks) {
        // 检查ID冲突，如有冲突生成新ID
        const existingTask = await TaskService.getTaskById(task.id);
        if (existingTask) {
          task.id = uuid.v4();
        }
        await TaskService.createTask(task, tx);
      }
      
      for (const reflection of data.reflections) {
        // 确保关联的任务存在
        const taskExists = await TaskService.getTaskById(reflection.taskId);
        if (taskExists) {
          await ReflectionService.createReflection(reflection, tx);
        }
      }
    });
    
    return { success: true, imported: data.tasks.length };
  } catch (error) {
    throw new Error(`导入失败: ${error.message}`);
  }
};

// 数据验证
const validateImportData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!data.version || !data.tasks || !Array.isArray(data.tasks)) return false;
  
  // 验证每个任务的必填字段
  for (const task of data.tasks) {
    if (!task.id || !task.title || !task.priority || !task.dueDate) {
      return false;
    }
  }
  
  return true;
};
```

**设计决策理由**:
- JSON格式保留完整数据结构，适合完整备份
- CSV格式便于在Excel等工具中查看和编辑
- 事务确保导入的原子性，失败时不会部分导入
- ID冲突处理避免覆盖现有数据


## 状态管理

### TaskContext 设计

```typescript
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
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const TaskProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  
  // 加载任务
  const loadTasks = useCallback(async (date: Date) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await TaskService.getTasksByDate(date);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);
  
  // 其他操作方法...
  
  return (
    <TaskContext.Provider value={{ state, dispatch, loadTasks, ... }}>
      {children}
    </TaskContext.Provider>
  );
};
```


## 数据访问层

### 数据存储要求

基于需求15，应用的数据存储必须满足：

- **存储方式**: SQLite本地数据库（react-native-sqlite-storage）
- **数据持久化**: 所有任务和复盘数据立即保存
- **数据加载**: 应用启动后1秒内完成数据加载
- **数据完整性**: 使用事务确保数据一致性

**设计决策理由**:
- SQLite提供关系型数据库能力，支持复杂查询和索引
- 本地存储确保离线可用，无需网络依赖
- 事务机制保证数据完整性，避免部分写入
- 索引优化查询性能，满足1秒加载要求

### DatabaseService

```typescript
class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  
  async init(): Promise<void> {
    this.db = await SQLite.openDatabase({ name: 'detter.db', location: 'default' });
    await this.createTables();
  }
  
  private async createTables(): Promise<void> {
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS tasks (
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
    `);
    
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS reflections (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );
    `);
    
    // 创建索引
    await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)');
    await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)');
    await this.db.executeSql('CREATE INDEX IF NOT EXISTS idx_reflections_task_id ON reflections(task_id)');
  }
  
  async transaction(callback: (tx: SQLite.Transaction) => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(
        async (tx) => {
          try {
            await callback(tx);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(error)
      );
    });
  }
}

export default new DatabaseService();
```

### TaskService

```typescript
class TaskService {
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const id = uuid.v4();
    const now = Date.now();
    
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
    
    await DatabaseService.transaction(async (tx) => {
      await tx.executeSql(
        `INSERT INTO tasks (id, title, description, priority, tags, subtasks, 
         due_date, reminder_time, completed, completed_at, created_at, updated_at, 
         task_order, archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newTask.id,
          newTask.title,
          newTask.description || null,
          newTask.priority,
          JSON.stringify(newTask.tags),
          JSON.stringify(newTask.subtasks),
          newTask.dueDate.getTime(),
          newTask.reminderTime?.getTime() || null,
          newTask.completed ? 1 : 0,
          newTask.completedAt?.getTime() || null,
          newTask.createdAt.getTime(),
          newTask.updatedAt.getTime(),
          newTask.order,
          newTask.archived ? 1 : 0,
        ]
      );
    });
    
    return newTask;
  }
  
  async getTasksByDate(date: Date): Promise<Task[]> {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);
    
    const [results] = await DatabaseService.db.executeSql(
      `SELECT * FROM tasks 
       WHERE due_date >= ? AND due_date <= ? AND archived = 0
       ORDER BY priority, task_order`,
      [startOfDay, endOfDay]
    );
    
    return this.mapResultsToTasks(results.rows.raw());
  }
  
  async updateTask(task: Task): Promise<void> {
    const now = Date.now();
    
    await DatabaseService.transaction(async (tx) => {
      await tx.executeSql(
        `UPDATE tasks SET title = ?, description = ?, priority = ?, tags = ?, 
         subtasks = ?, due_date = ?, reminder_time = ?, completed = ?, 
         completed_at = ?, updated_at = ?, task_order = ?, archived = ?
         WHERE id = ?`,
        [
          task.title,
          task.description || null,
          task.priority,
          JSON.stringify(task.tags),
          JSON.stringify(task.subtasks),
          task.dueDate.getTime(),
          task.reminderTime?.getTime() || null,
          task.completed ? 1 : 0,
          task.completedAt?.getTime() || null,
          now,
          task.order,
          task.archived ? 1 : 0,
          task.id,
        ]
      );
    });
  }
  
  async deleteTask(taskId: string): Promise<void> {
    await DatabaseService.transaction(async (tx) => {
      await tx.executeSql('DELETE FROM tasks WHERE id = ?', [taskId]);
    });
  }
  
  async getCompletedTasks(): Promise<Task[]> {
    const [results] = await DatabaseService.db.executeSql(
      `SELECT t.*, r.content as reflection_content, r.id as reflection_id
       FROM tasks t
       LEFT JOIN reflections r ON t.id = r.task_id
       WHERE t.completed = 1
       ORDER BY t.completed_at DESC`
    );
    
    return this.mapResultsToTasks(results.rows.raw());
  }
  
  private mapResultsToTasks(rows: any[]): Task[] {
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      tags: JSON.parse(row.tags || '[]'),
      subtasks: JSON.parse(row.subtasks || '[]'),
      dueDate: new Date(row.due_date),
      reminderTime: row.reminder_time ? new Date(row.reminder_time) : undefined,
      completed: row.completed === 1,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      order: row.task_order,
      archived: row.archived === 1,
      reflection: row.reflection_content ? {
        id: row.reflection_id,
        taskId: row.id,
        content: row.reflection_content,
      } : undefined,
    }));
  }
}

export default new TaskService();
```


## 错误处理

### 错误类型定义

```typescript
enum ErrorType {
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

class AppError extends Error {
  type: ErrorType;
  details?: any;
  
  constructor(type: ErrorType, message: string, details?: any) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = 'AppError';
  }
}
```

### 错误处理策略

1. **数据库错误**: 
   - 捕获并记录错误日志
   - 向用户显示友好的错误提示
   - 提供重试机制

2. **验证错误**:
   - 在UI层进行输入验证
   - 显示具体的验证错误信息
   - 阻止无效数据提交

3. **权限错误**:
   - 检查必要权限（存储、通知）
   - 引导用户授予权限
   - 提供降级功能

### 全局错误边界

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误到日志服务
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text>出现了一些问题</Text>
          <Button title="重新加载" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    
    return this.props.children;
  }
}
```

### 网络请求错误处理（未来扩展）

```typescript
const handleApiError = (error: any): AppError => {
  if (error.response) {
    // 服务器返回错误
    return new AppError(
      ErrorType.NETWORK_ERROR,
      error.response.data.message || '服务器错误',
      error.response.data
    );
  } else if (error.request) {
    // 请求发送但无响应
    return new AppError(
      ErrorType.NETWORK_ERROR,
      '网络连接失败，请检查网络设置'
    );
  } else {
    // 其他错误
    return new AppError(
      ErrorType.UNKNOWN_ERROR,
      error.message || '未知错误'
    );
  }
};
```


## 性能要求与优化策略

### 性能目标

基于需求14，应用必须满足以下性能指标：

- **冷启动时间**: ≤ 2秒（从点击图标到显示主屏幕）
- **UI交互响应**: ≤ 100毫秒（所有点击、滑动等操作）
- **滚动帧率**: 60 FPS（卡片列表视图和任务列表）
- **大数据量渲染**: 支持100+任务项无性能下降

**设计决策理由**: 
- 2秒启动时间符合用户对移动应用的期望
- 100毫秒响应时间确保用户感知到即时反馈
- 60 FPS保证流畅的视觉体验
- 100+任务支持满足重度用户需求

### 1. 渲染优化

- 使用 `React.memo` 包裹纯组件
- 使用 `useMemo` 和 `useCallback` 避免不必要的重新计算
- 列表使用 `FlatList` 的虚拟化特性
- 图片使用 `react-native-fast-image` 进行缓存

```typescript
// 示例：优化TaskItem组件
const TaskItem = React.memo(({ task, onPress }: TaskItemProps) => {
  const handlePress = useCallback(() => {
    onPress(task.id);
  }, [task.id, onPress]);
  
  return (
    <TouchableOpacity onPress={handlePress}>
      {/* 任务内容 */}
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.updatedAt === nextProps.task.updatedAt;
});
```

### 2. 数据库优化

- 使用索引加速查询
- 批量操作使用事务
- 定期清理归档数据
- 使用连接查询减少数据库访问次数

```typescript
// 批量更新任务顺序
async updateTaskOrders(updates: Array<{ id: string; order: number }>): Promise<void> {
  await DatabaseService.transaction(async (tx) => {
    for (const { id, order } of updates) {
      await tx.executeSql('UPDATE tasks SET task_order = ? WHERE id = ?', [order, id]);
    }
  });
}
```

### 3. 动画性能

- 使用 `react-native-reanimated` 在UI线程执行动画
- 避免在动画过程中进行复杂计算
- 使用 `useNativeDriver: true` 启用原生驱动

```typescript
// 使用 reanimated 优化动画
const animatedStyle = useAnimatedStyle(() => {
  return {
    opacity: withTiming(visible.value ? 1 : 0, { duration: 300 }),
    transform: [
      { scale: withSpring(pressed.value ? 0.95 : 1) }
    ],
  };
});
```

### 4. 启动优化

- 延迟加载非关键模块
- 使用 `react-native-splash-screen` 优化启动体验
- 预加载关键数据

```typescript
// App启动流程
const App = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const prepare = async () => {
      try {
        // 初始化数据库
        await DatabaseService.init();
        // 加载用户设置
        await loadUserSettings();
        // 预加载今天的任务
        await preloadTodayTasks();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsReady(true);
        SplashScreen.hide();
      }
    };
    
    prepare();
  }, []);
  
  if (!isReady) {
    return null;
  }
  
  return <AppNavigator />;
};
```

### 5. 内存管理

- 及时清理定时器和监听器
- 避免内存泄漏
- 大列表使用分页加载

```typescript
useEffect(() => {
  const subscription = eventEmitter.addListener('taskUpdated', handleTaskUpdate);
  
  return () => {
    subscription.remove();
  };
}, []);
```


## 测试策略

### 单元测试

使用 Jest 进行单元测试：

```typescript
// TaskService.test.ts
describe('TaskService', () => {
  beforeEach(async () => {
    await DatabaseService.init();
    await clearDatabase();
  });
  
  it('should create a new task', async () => {
    const taskData = {
      title: '测试任务',
      priority: 'important',
      dueDate: new Date(),
      tags: [],
      subtasks: [],
      completed: false,
      archived: false,
      order: 1,
    };
    
    const task = await TaskService.createTask(taskData);
    
    expect(task.id).toBeDefined();
    expect(task.title).toBe('测试任务');
    expect(task.priority).toBe('important');
  });
  
  it('should get tasks by date', async () => {
    const today = new Date();
    await TaskService.createTask({ ...taskData, dueDate: today });
    
    const tasks = await TaskService.getTasksByDate(today);
    
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('测试任务');
  });
});
```

### 组件测试

使用 React Native Testing Library：

```typescript
// TaskItem.test.tsx
import { render, fireEvent } from '@testing-library/react-native';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: '1',
    title: '测试任务',
    priority: 'important',
    completed: false,
    // ... 其他属性
  };
  
  it('should render task title', () => {
    const { getByText } = render(
      <TaskItem task={mockTask} priorityOrder={1} onComplete={jest.fn()} />
    );
    
    expect(getByText('测试任务')).toBeTruthy();
  });
  
  it('should call onComplete when checkbox is pressed', () => {
    const onComplete = jest.fn();
    const { getByTestId } = render(
      <TaskItem task={mockTask} priorityOrder={1} onComplete={onComplete} />
    );
    
    fireEvent.press(getByTestId('task-checkbox'));
    
    expect(onComplete).toHaveBeenCalledWith(mockTask.id);
  });
});
```

### 集成测试

测试完整的用户流程：

```typescript
describe('Task Creation Flow', () => {
  it('should create a task from empty state', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<App />);
    
    // 点击添加按钮
    fireEvent.press(getByTestId('add-task-button'));
    
    // 输入任务标题
    fireEvent.changeText(getByPlaceholderText('准备做什么？'), '新任务');
    
    // 选择优先级
    fireEvent.press(getByText('重要'));
    
    // 保存任务
    fireEvent.press(getByText('添加'));
    
    // 验证任务已创建
    await waitFor(() => {
      expect(getByText('新任务')).toBeTruthy();
    });
  });
});
```

### 性能测试

- 使用 React Native Performance Monitor 监控性能
- 测试大数据量下的列表滚动性能
- 测试动画帧率

### 测试覆盖率目标

- 核心业务逻辑：90%+
- UI组件：70%+
- 工具函数：95%+


## 安全性考虑

### 数据安全

**V1.0 实现**:

1. **SQL注入防护**:
   - 所有数据库操作使用参数化查询
   - 永不拼接SQL字符串
   
2. **数据验证**:
   - 导入数据时验证JSON格式和数据结构
   - 检查必填字段和数据类型
   - 防止恶意数据导入

3. **数据备份**:
   - 提供数据导出功能（JSON/CSV格式）
   - 建议用户定期备份
   - 导出文件存储在用户可访问的目录

**V2.0 考虑**:

4. **本地数据加密**:
   - 使用 `react-native-encrypted-storage` 加密敏感数据
   - 支持密码保护或生物识别
   
5. **导出文件加密**:
   - 可选的导出文件加密
   - 使用用户设置的密码

**设计决策理由**:
- V1.0专注核心功能，数据加密增加复杂度
- 参数化查询是防止SQL注入的最佳实践
- 数据验证防止应用崩溃和数据损坏

### 权限管理

基于需求16.4，应用需要请求以下Android权限：

- **存储权限**: 用于数据导入导出功能
- **通知权限**: 用于任务提醒功能（Android 13+需要运行时请求）

```typescript
// 权限请求
const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    // 存储权限（Android 10以下需要）
    const storagePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    
    // 通知权限（Android 13+必需）
    const notificationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    
    return {
      storage: storagePermission === PermissionsAndroid.RESULTS.GRANTED,
      notification: notificationPermission === PermissionsAndroid.RESULTS.GRANTED,
    };
  }
};
```

**权限处理策略**:
- 在首次使用相关功能时请求权限
- 权限被拒绝时提供降级功能或引导用户手动开启
- 存储权限被拒绝时，使用应用私有目录
- 通知权限被拒绝时，禁用提醒功能但不影响核心功能

## 平台兼容性与部署

### 平台要求

基于需求16，应用必须满足以下平台兼容性要求：

- **最低Android版本**: Android 9.0 (API Level 28)
- **目标Android版本**: Android 13+ (API Level 33+)
- **屏幕适配**: 支持4.5"到7"屏幕，分辨率从720p到2K+
- **打包格式**: APK（未来考虑AAB）

**设计决策理由**:
- Android 9.0覆盖95%+的活跃设备
- 响应式布局确保不同屏幕尺寸的一致体验
- 使用dp单位和flexbox实现自适应布局

### Android APK 打包

1. **配置签名**:

```gradle
// android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('detter-release-key.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

2. **构建命令**:

```bash
cd android
./gradlew assembleRelease
```

3. **APK位置**:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 版本管理

```json
// package.json
{
  "version": "1.0.0",
  "versionCode": 1
}
// android/app/build.gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

## 未来扩展考虑

### V2.0 功能规划

1. **云同步**:
   - 用户账号系统
   - 数据云端备份
   - 多设备同步

2. **智能功能**:
   - 复盘反思内容分析
   - 任务优先级智能建议
   - 习惯分析和改进建议

3. **跨平台**:
   - iOS版本开发
   - Web版本

### 技术债务管理

- 定期重构代码
- 更新依赖库版本
- 性能监控和优化
- 用户反馈收集和处理

## 设计决策记录

### 为什么选择SQLite而不是AsyncStorage？

- SQLite支持复杂查询和索引
- 更好的性能和数据完整性
- 支持事务和关系型数据

### 为什么使用react-native-reanimated？

- UI线程执行动画，性能更好
- 支持复杂的手势和动画组合
- 社区活跃，文档完善

### 为什么使用Context而不是Redux？

- 应用规模适中，Context足够
- 减少依赖和学习成本
- 更简洁的代码结构

### 卡片列表视图为什么不使用现成的库？

- 需求特殊（动态缩放+自动居中+惯性控制），现有库难以满足
- 自定义实现可以更好地控制性能和用户体验
- 学习和实践高级动画技术，提升团队能力

### 为什么不在V1.0实现数据加密？

- 专注核心功能，避免过度设计
- 数据加密增加实现复杂度和用户使用门槛
- 本地存储已提供基本安全性
- V2.0根据用户反馈决定是否添加

## 设计与需求对齐总结

本设计文档完整覆盖了需求文档中的所有16个需求：

| 需求编号 | 需求名称 | 设计覆盖 |
|---------|---------|---------|
| 需求1 | 应用导航与全局设计 | BottomTabNavigator + 全局主题配置 |
| 需求2 | 日期选择器 | DateSelector组件 + 横向滚动 + 动画 |
| 需求3 | 任务看板与优先级容器 | PriorityContainer + TaskBoard组件 |
| 需求4 | 任务项展示与状态管理 | TaskItem组件 + TaskContext状态管理 |
| 需求5 | 任务交互操作 | 手势处理 + 拖拽排序 + 左滑操作 |
| 需求6 | 添加新任务 | BottomSheet + TaskAddPanel + 子组件 |
| 需求7 | 复盘模块主界面 | ReflectionScreen + 双视图切换 |
| 需求8 | 复盘功能 | ReflectionDetailScreen + ReflectionService |
| 需求9 | 卡片列表视图动态效果 | CardListView + Reanimated动画 |
| 需求10 | 清单列表视图 | ChecklistView组件 |
| 需求11 | 搜索与筛选 | SearchBar + FilterPanel + 筛选逻辑 |
| 需求12 | 个人中心数据统计 | StatisticsService + Chart组件 |
| 需求13 | 应用设置 | ThemeContext + 数据导入导出 + 通知设置 |
| 需求14 | 性能要求 | 性能优化策略 + 启动优化 + 动画优化 |
| 需求15 | 数据存储 | DatabaseService + SQLite + 事务管理 |
| 需求16 | 平台兼容性 | Android适配 + 权限管理 + APK打包 |

所有设计决策都基于需求驱动，并充分考虑了性能、可维护性和用户体验。
