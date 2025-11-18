# Detter - ToDo Better
## 总结与反思
<img width="1728" height="924" alt="68cac84f-93b5-42f2-8b1d-8f42bb9c3f69" src="https://github.com/user-attachments/assets/5e1c371e-2d0e-4aee-ac5f-3af591138f6d" />

- 很完蛋啊很完蛋，vibe coding大失败。之前浅浅用过Kiro，恰逢拿到了一个月的Pro+，于是打算用Kiro开发ToDo工具，思路是通过需求、design、task的拆分来分步推进项目开发，17日下午打包apk失败，一路改到18日，且中间造成所有文档出现乱码，未备份，改了大半。
- 体验Kiro的感受是，基础功能不够完善，如：撤回和回退；上下文很短，prompt增强等等，不如Cursor和Augment，反复纠正的体验还不如TRAE。
- 你觉得这个实现的最大亮点是什么？  
  - 试图实现的亮点是只区分紧急和重要（还有事务），来倒逼对事务的思考；反思已完成ToDo的过程，来反哺之后的ToDo；以及类似小宇宙播客广场的交互（ https://github.com/iftechio/SquareLayoutManager 、 https://juejin.cn/post/7569946369989836863 ）。

## 项目概述

**项目名称**: Detter - ToDo Better

理念：一件事情要么紧急，要么重要。在ToDo完成后，反思复盘下一次如何更好地行事。

结构：行Tab，正常的ToDo List；思Tab，类似于小宇宙播客广场的交互，卡片式回顾ToDo，写下思考，来为之后的ToDo做方法论层面的指引，调整做事的方式，优化“时间管理”

灵感：E162 对话张云帆：如果命运可以改写，往前叫穿越，往后就是规划你的人生

https://www.xiaoyuzhoufm.com/episode/671b521ceb46cd6655a82f9b

## 1. 技术选型

- **编程语言**：TypeScript 4.9+

   \- 理由：提供强类型支持，减少运行时错误，提升代码可维护性

   \- 优势：IDE 智能提示、编译时类型检查、更好的重构支持

- **框架/库**：React Native 0.72+

   \- 理由：跨平台开发能力，一套代码可同时支持 Android 和 iOS（未来）

   \- 优势：庞大的社区生态、丰富的第三方库、接近原生的性能表现。  

- **数据库/存储**：SQLite (react-native-sqlite-storage 6.x)

  - 理由：
    1. 轻量级关系型数据库，无需服务器
    2. 支持复杂查询、事务、索引，性能优秀
    3. 数据完整性保障，支持外键约束
    4. 完全离线工作，无需网络依赖

- 替代方案对比：

  - **AsyncStorage**: 仅支持键值对存储，不支持复杂查询和关系数据
  - **Realm**: 学习曲线陡峭，对于本项目需求过于复杂
  - **本地文件 (JSON)**: 无法高效查询，数据量大时性能差，无事务支持

## 2. 项目结构设计

### 2.1 整体架构

Detter 采用**分层架构模式**，清晰分离关注点：

```
┌───────────────────────────────────────┐
│   Presentation Layer (表现层)          │
│   - Screens (页面)                     │
│   - Components (UI组件)                │
│   - Navigation (导航)                  │
├───────────────────────────────────────┤
│   Business Logic Layer (业务逻辑层)    │
│   - Contexts (全局状态)                │
│   - Hooks (自定义钩子)                 │
│   - Utils (工具函数)                   │
├───────────────────────────────────────┤
│   Data Access Layer (数据访问层)       │
│   - Services (业务服务)                │
│   - Repository Pattern (仓储模式)      │
├───────────────────────────────────────┤
│   Storage Layer (存储层)               │
│   - DatabaseService (数据库服务)        │
│   - SQLite Database (SQLite数据库)     │
└───────────────────────────────────────┘
```

### 2.2 目录结构

```
DetterApp/
├── src/                          # 源代码目录
│   ├── components/              # UI 组件
│   │   ├── common/             # 通用组件
│   │   │   ├── BottomSheet.tsx      # 底部弹出面板
│   │   │   ├── DateSelector.tsx     # 日期选择器
│   │   │   ├── Calendar.tsx         # 日历组件
│   │   │   ├── SearchBar.tsx        # 搜索栏
│   │   │   ├── FilterPanel.tsx      # 筛选面板
│   │   │   ├── TagInput.tsx         # 标签输入
│   │   │   └── TimePicker.tsx       # 时间选择器
│   │   ├── task/               # 任务相关组件
│   │   │   ├── TaskItem.tsx         # 任务项
│   │   │   ├── PriorityContainer.tsx # 优先级容器
│   │   │   ├── TaskBoard.tsx        # 任务看板
│   │   │   ├── TaskAddPanel.tsx     # 添加任务面板
│   │   │   ├── TaskEditPanel.tsx    # 编辑任务面板
│   │   │   ├── SubTaskList.tsx      # 子任务列表
│   │   │   ├── SwipeableTaskItem.tsx # 可滑动任务项
│   │   │   └── DraggableTaskList.tsx # 可拖拽任务列表
│   │   ├── reflection/         # 复盘相关组件
│   │   │   ├── CardListView.tsx     # 卡片列表视图
│   │   │   ├── ChecklistView.tsx    # 清单列表视图
│   │   │   ├── ReflectionCard.tsx   # 复盘卡片
│   │   │   └── ReflectionInputPanel.tsx # 复盘输入面板
│   │   └── profile/            # 个人中心组件
│   │       ├── CompletionRateChart.tsx    # 完成率图表
│   │       ├── TaskDistributionChart.tsx  # 任务分布图表
│   │       ├── ReflectionStatsCard.tsx    # 复盘统计卡片
│   │       ├── ThemeSettings.tsx          # 主题设置
│   │       ├── NotificationSettings.tsx   # 通知设置
│   │       ├── DataExport.tsx             # 数据导出
│   │       ├── DataImport.tsx             # 数据导入
│   │       ├── DataClear.tsx              # 数据清空
│   │       └── AboutAndHelp.tsx           # 关于和帮助
│   │
│   ├── screens/                 # 页面组件
│   │   ├── TaskScreen.tsx           # 任务页面（行）
│   │   ├── ReflectionScreen.tsx     # 复盘页面（思）
│   │   ├── ProfileScreen.tsx        # 个人中心（我）
│   │   ├── TaskEditScreen.tsx       # 任务编辑页面
│   │   └── ReflectionDetailScreen.tsx # 复盘详情页面
│   │
│   ├── navigation/              # 导航配置
│   │   └── BottomTabNavigator.tsx   # 底部Tab导航
│   │
│   ├── contexts/                # 状态管理
│   │   ├── TaskContext.tsx          # 任务状态管理
│   │   └── ThemeContext.tsx         # 主题状态管理
│   │
│   ├── services/                # 业务逻辑服务
│   │   ├── DatabaseService.ts       # 数据库服务
│   │   ├── TaskService.ts           # 任务服务
│   │   ├── ReflectionService.ts     # 复盘服务
│   │   ├── StatisticsService.ts     # 统计服务
│   │   └── NotificationService.ts   # 通知服务
│   │
│   ├── models/                  # 数据模型
│   │   ├── types.ts                 # TypeScript 类型定义
│   │   └── index.ts
│   │
│   └── utils/                   # 工具函数
│       ├── constants.ts             # 常量定义
│       ├── dateUtils.ts             # 日期工具
│       ├── filterUtils.ts           # 筛选工具
│       └── theme.ts                 # 主题配置
│
├── __tests__/                   # 测试文件
│   ├── unit/                    # 单元测试
│   ├── integration/             # 集成测试
│   └── performance/             # 性能测试
│
├── android/                     # Android 原生代码
├── docs/                        # 项目文档
└── preview-tools/               # 预览工具脚本
```

### 2.3 模块职责说明

**Presentation Layer (表现层)**:

- **Screens**: 完整的页面组件，组合多个 Components，处理页面级逻辑
- **Components**: 可复用的 UI 组件，专注于展示和用户交互
- **Navigation**: 管理应用的路由和页面跳转

**Business Logic Layer (业务逻辑层)**:

- **Contexts**: 使用 React Context API + useReducer 管理全局状态
- **Hooks**: 封装可复用的业务逻辑和副作用
- **Utils**: 纯函数工具，如日期格式化、数据筛选等

**Data Access Layer (数据访问层)**:

- **Services**: 封装数据操作逻辑，提供统一的数据访问接口
- 采用 Repository 模式，隔离数据源变化对业务层的影响

**Storage Layer (存储层)**:

- **DatabaseService**: 管理 SQLite 数据库连接、表创建、事务处理
- 提供底层数据持久化能力

---

## 3. 需求细节与决策

### 3.1 任务描述字段

**决策**: 描述字段为**可选**

- 标题是必填项，用于快速识别任务
- 描述可选，用于补充详细信息
- 空输入处理：标题为空时禁用"添加"按钮，描述为空时存储为 null

### 3.2 已完成任务的显示

**在任务模块（行）中**:

- 已完成任务显示在原优先级容器中
- 视觉变化：复选框填充、标题添加删除线、整体透明度降低
- 保留在列表中便于用户查看当日完成情况
- 可通过左滑操作归档或删除

**在复盘模块（思）中**:

- 提供两种视图：卡片列表视图和清单列表视图
- 卡片视图：沉浸式浏览，动态缩放效果，适合逐个深入复盘
- 清单视图：简洁列表，快速浏览，已复盘任务有紫色背景标记
- 按完成日期降序排列，最新完成的任务在最前面

### 3.3 任务排序逻辑

**默认排序**: 按用户自定义的优先级顺序（order 字段）

- 每个优先级容器内独立排序
- 新任务默认添加到容器末尾

**用户可调整**:

- 长按拖拽：在同一优先级容器内重新排序
- 左滑操作：上移/下移调整顺序
- 实时更新优先级数字（1, 2, 3...）

## 4. AI 使用说明

- 是否使用 AI 工具？（ChatGPT / Copilot / Cursor / 其他）  

  - Kiro (Claude 4.5 Sonnet)、Gemini 2.5 Pro

- 使用 AI 的环节：  

  - 代码全程
  - 文档辅助    

- AI 输出如何修改：

  - 卡片列表动画实现

     **AI 初始方案**: 使用 Animated API 实现缩放动画

    **修改**: 改用 react-native-reanimated

    **理由**: Animated API 在 JS 线程执行，滚动时会有明显卡顿。Reanimated 在 UI 线程执行，能达到 60fps 的流畅度。

## 5. 运行与测试方式

- 本地运行方式（安装依赖、启动命令）。  
- 已测试过的环境（例如 Node.js v20，macOS）。  
- 已知问题与不足。  
  - 测试失败。

