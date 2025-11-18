# 需求文档

## 简介

Detter (ToDo Better) 是一款基于React Native开发的Android待办事项管理应用，核心理念是"一件事情要么紧急，要么重要"，并在任务完成后引导用户进行反思复盘。应用采用极简设计风格，包含三个核心模块：行（任务管理）、思（复盘反思）、我（个人中心）。

## 术语表

- **Detter_System**: Detter应用系统，包含所有功能模块
- **Task_Module**: "行"模块，负责任务的创建、管理和完成
- **Reflection_Module**: "思"模块，负责已完成任务的复盘和反思
- **Profile_Module**: "我"模块，负责数据统计、设置和用户信息
- **Task_Item**: 任务项，包含标题、描述、优先级、标签等属性
- **Priority_Container**: 优先级容器，用于组织和展示不同优先级的任务
- **Reflection_Note**: 复盘笔记，用户对已完成任务的反思记录
- **Date_Selector**: 日期选择器，用于选择任务日期
- **Bottom_Sheet**: 底部弹出面板，用于添加或编辑任务
- **Card_List_View**: 卡片列表视图，以动态缩放方式展示已完成任务
- **Checklist_View**: 清单列表视图，以列表形式展示已完成任务
- **Local_Storage**: 本地存储，使用SQLite数据库

## 需求

### 需求 1: 应用导航与全局设计

**用户故事:** 作为用户，我希望通过底部导航栏快速切换应用的主要功能模块，以便高效管理任务和进行复盘。

#### 验收标准

1. Detter_System 应当显示一个底部Tab栏，包含三个导航入口，分别标记为"行"、"思"和"我"
2. 当应用启动时，Detter_System 应当将"行"设置为默认激活的标签页
3. Detter_System 应当将背景色 #ecfaf6 应用到所有主屏幕
4. 当用户点击底部导航栏中的某个标签时，Detter_System 应当在100毫秒内切换到相应的模块

### 需求 2: 日期选择器

**用户故事:** 作为用户，我希望能够通过横向滚动的日期选择器查看和选择不同日期的任务，以便管理多日的待办事项。

#### 验收标准

1. Task_Module 应当在屏幕顶部显示一个横向可滚动的 Date_Selector，展示一周的日期
2. Date_Selector 应当以垂直布局格式显示每个日期，包含星期名称和日期数字
3. Date_Selector 应当将背景色 #f5eefb 应用到日期选择器组件
4. 当 Task_Module 加载时，Date_Selector 应当默认高亮显示今天的日期
5. 当用户点击 Date_Selector 中的某个日期时，Task_Module 应当在100毫秒内刷新任务看板，显示所选日期的任务
6. 当用户在 Date_Selector 上左右滑动时，Date_Selector 应当以平滑动画滚动显示上一周或下一周的日期


### 需求 3: 任务看板与优先级容器

**用户故事:** 作为用户，我希望任务按照优先级分类展示，以便清晰地了解任务的重要程度和紧急程度。

#### 验收标准

1. Task_Module 应当以垂直排列方式显示三个 Priority_Container 区域，分别标记为"重要"、"紧急"和"琐事"
2. Task_Module 应当将背景色 #f0f0f0 应用到每个 Priority_Container
3. Task_Module 应当将左边框颜色 #dc663c 应用到"重要"容器
4. Task_Module 应当将左边框颜色 #eb9e28 应用到"紧急"容器
5. Task_Module 应当将左边框颜色 #8c8c8c 应用到"琐事"容器
6. 当 Priority_Container 不包含任何任务时，Priority_Container 应当显示占位文本"点击添加ToDo"
7. 当用户点击空 Priority_Container 中的占位符时，Task_Module 应当打开 Bottom_Sheet 并预选相应的优先级

### 需求 4: 任务项展示与状态管理

**用户故事:** 作为用户，我希望清晰地看到每个任务的详细信息和优先级顺序，并能够标记任务完成状态。

#### 验收标准

1. Task_Item 应当在左侧显示一个方形复选框，其中包含数字优先级顺序
2. Task_Item 应当显示任务标题、灰色较小字号的描述，以及带圆角胶囊形状的标签
3. 当用户点击 Task_Item 的复选框时，Task_Module 应当将该任务标记为已完成
4. 当任务被标记为已完成时，Task_Module 应当填充复选框颜色、显示对勾图标、移除优先级数字、为标题添加删除线并降低整体透明度
5. 当任务被标记为已完成时，Task_Module 应当显示一个 Bottom_Sheet，其中包含占位文本"如何Do Better？"用于可选的复盘输入
6. 当用户在复盘 Bottom_Sheet 中输入文本时，Task_Module 应当将输入保存为与已完成任务关联的 Reflection_Note

### 需求 5: 任务交互操作

**用户故事:** 作为用户，我希望能够通过多种手势操作管理任务，包括编辑、排序、删除等，以便灵活地组织我的待办事项。

#### 验收标准

1. 当用户点击 Task_Item 时，Task_Module 应当导航到任务编辑屏幕
2. 当用户长按并在 Priority_Container 内拖拽 Task_Item 时，Task_Module 应当允许重新排序并实时更新优先级数字
3. 当用户在 Task_Item 上左滑时，Task_Module 应当显示操作按钮，标记为"归档"、"删除"、"上移"和"下移"
4. 当用户从任务列表顶部下拉时，Task_Module 应当刷新当前日期的任务
5. 当用户点击已滑出的 Task_Item 上的"删除"按钮时，Task_Module 应当以动画方式从列表中移除该任务
6. 当用户点击已滑出的 Task_Item 上的"上移"或"下移"按钮时，Task_Module 应当调整任务位置并相应更新优先级数字


### 需求 6: 添加新任务

**用户故事:** 作为用户，我希望能够快速添加新任务并设置详细信息，包括日期、优先级、子任务和提醒时间。

#### 验收标准

1. 当用户点击悬浮的"+"按钮或空 Priority_Container 占位符时，Task_Module 应当从屏幕底部显示 Bottom_Sheet 面板
2. 当 Bottom_Sheet 打开时，Detter_System 应当自动显示键盘并将焦点设置在任务标题输入框
3. Bottom_Sheet 应当显示三个快捷日期选择按钮，标记为"今"、"明"和"日"，默认高亮"今"
4. 当用户点击"日"按钮时，Bottom_Sheet 应当展开显示带有月份导航的日历视图
5. 日历视图应当显示公历日期，每个日期下方显示农历日期或节日
6. 日历视图应当用特殊背景色标记今天的日期并显示"今"字
7. Bottom_Sheet 应当提供任务标题输入框（占位符"准备做什么？"）和描述输入框（占位符"描述"）
8. Bottom_Sheet 应当提供子任务输入框（占位符"添加子任务"）并允许添加多个子任务
9. 当用户输入子任务文本并按回车或点击"+"时，Bottom_Sheet 应当将子任务添加到带有复选框和删除按钮的列表中
10. Bottom_Sheet 应当显示三个圆角矩形样式的优先级按钮，标记为"重要"、"紧急"和"琐事"
11. 当用户点击底部工具栏中的闹钟图标时，Bottom_Sheet 应当打开24小时制的时间选择器用于设置任务提醒
12. 当用户点击底部工具栏中的"#"图标时，Bottom_Sheet 应当在描述输入框末尾插入"#"符号并建议现有标签
13. 当用户填写任务标题后，Bottom_Sheet 应当启用右上角的"添加"按钮
14. 当用户点击已启用的"添加"按钮时，Task_Module 应当保存新任务并关闭 Bottom_Sheet

### 需求 7: 复盘模块主界面

**用户故事:** 作为用户，我希望能够以不同的视图方式查看已完成的任务，以便选择最适合我的复盘方式。

#### 验收标准

1. Reflection_Module 应当在屏幕顶部显示两个标签选项，标记为"卡片列表"和"清单列表"
2. Reflection_Module 应当仅显示在 Task_Module 中被标记为已完成的任务
3. 当用户点击某个标签选项时，Reflection_Module 应当在100毫秒内在 Card_List_View 和 Checklist_View 之间切换
4. Reflection_Module 应当在屏幕右上角显示搜索图标

### 需求 8: 复盘功能

**用户故事:** 作为用户，我希望能够为已完成的任务添加复盘笔记，以便记录经验和改进方向。

#### 验收标准

1. 当用户在 Card_List_View 或 Checklist_View 中点击已完成的任务时，Reflection_Module 应当导航到复盘详情屏幕
2. 复盘详情屏幕应当在顶部显示原始任务标题、描述、标签和完成日期
3. 复盘详情屏幕应当提供一个文本输入区域，占位符为"思：这次做得怎么样？下次如何做得更好？"
4. 复盘详情屏幕应当在右上角显示"保存"按钮
5. 当用户输入复盘文本并点击"保存"时，Reflection_Module 应当保存 Reflection_Note 并将其与已完成任务关联
6. 当任务有关联的 Reflection_Note 时，Reflection_Module 应当在 Checklist_View 中将任务状态标记为"思"


### 需求 9: 卡片列表视图动态效果

**用户故事:** 作为用户，我希望在卡片列表视图中获得沉浸式的浏览体验，通过动态缩放和自动居中来聚焦当前查看的任务。

#### 验收标准

1. Card_List_View 应当根据卡片距离屏幕中心的距离对卡片应用动态缩放
2. 当卡片的中心点与屏幕中心点对齐时，Card_List_View 应当以1.0的缩放比例显示卡片
3. 当卡片的中心点远离屏幕中心时，Card_List_View 应当按比例减小卡片的缩放比例，最小缩放比例为0.8
4. 当用户滚动 Card_List_View 时，Card_List_View 应当实时平滑地动画显示所有卡片的缩放变化
5. 当用户停止滚动时，Card_List_View 应当自动滚动以使最近的卡片居中，并带有减速动画
6. 当用户执行快速滑动手势时，Card_List_View 应当继续惯性滚动，最多滚动3张卡片
7. 当滚动到达列表边界时，Card_List_View 应当应用回弹或阻尼效果

### 需求 10: 清单列表视图

**用户故事:** 作为用户，我希望以简洁的列表形式查看所有已完成的任务，并能够快速识别哪些任务已经完成复盘。

#### 验收标准

1. Checklist_View 应当以单列列表形式显示已完成的任务，按完成日期降序排序
2. Checklist_View 应当为每个列表项显示任务标题、完成日期和标签
3. 当任务有关联的 Reflection_Note 时，Checklist_View 应当将背景色 #f2f2fd 应用到列表项
4. 当任务没有 Reflection_Note 时，Checklist_View 应当将默认背景色应用到列表项

### 需求 11: 搜索与筛选

**用户故事:** 作为用户，我希望能够通过关键词搜索和条件筛选快速找到特定的已完成任务，以便高效地进行复盘。

#### 验收标准

1. 当用户点击 Reflection_Module 中的搜索图标时，Reflection_Module 应当显示搜索输入框
2. 当用户在搜索框中输入关键词时，Reflection_Module 应当筛选标题、描述、标签或 Reflection_Note 内容中匹配关键词的任务
3. Reflection_Module 应当提供完成日期范围、标签和复盘状态的筛选选项
4. 当用户应用筛选条件时，Reflection_Module 应当仅显示符合所有选定筛选条件的任务
5. 当用户清除搜索或筛选时，Reflection_Module 应当恢复已完成任务的完整列表


### 需求 12: 个人中心数据统计

**用户故事:** 作为用户，我希望能够查看我的任务完成情况和复盘习惯的统计数据，以便了解自己的进度和改进空间。

#### 验收标准

1. Profile_Module 应当显示完成率图表，展示每日、每周和每月的任务完成数量和百分比
2. Profile_Module 应当显示任务分布图表，展示"重要且紧急"、"重要"、"紧急"、"琐事"和"无标识"类别中任务的比例
3. Profile_Module 应当计算并显示有 Reflection_Note 的任务与已完成任务总数的比率
4. Profile_Module 应当在任务数据变化时实时更新所有统计数据

### 需求 13: 应用设置

**用户故事:** 作为用户，我希望能够自定义应用的主题、通知和数据管理选项，以便根据个人偏好使用应用。

#### 验收标准

1. Profile_Module 应当提供浅色模式、深色模式和跟随系统的主题选项
2. 当用户选择主题选项时，Detter_System 应当立即将所选主题应用到所有屏幕
3. Profile_Module 应当提供任务提醒通知的开关按钮
4. Profile_Module 应当提供数据导出功能，将所有任务和 Reflection_Note 记录导出为JSON或CSV格式
5. Profile_Module 应当提供数据导入功能，从文件导入任务和 Reflection_Note 记录
6. Profile_Module 应当提供带确认对话框的清空数据功能
7. 当用户确认清空数据时，Profile_Module 应当从 Local_Storage 中删除所有数据
8. Profile_Module 应当在关于部分显示应用名称、版本号和开发者信息
9. Profile_Module 应当提供帮助指导和反馈联系信息

### 需求 14: 性能要求

**用户故事:** 作为用户，我希望应用响应迅速且运行流畅，以便获得良好的使用体验。

#### 验收标准

1. Detter_System 应当在2秒内完成冷启动并显示主屏幕
2. Detter_System 应当在100毫秒内响应所有UI交互
3. Card_List_View 应当保持60帧每秒的平滑滚动，无明显卡顿
4. Task_Module 应当在渲染多达100个任务项的列表时不出现性能下降

### 需求 15: 数据存储

**用户故事:** 作为用户，我希望我的任务和复盘数据能够可靠地保存在本地，以便离线使用应用。

#### 验收标准

1. Detter_System 应当使用SQLite数据库作为所有应用数据的 Local_Storage
2. Detter_System 应当持久化所有 Task_Item 数据，包括标题、描述、优先级、标签、子任务、提醒时间、创建日期和完成日期
3. Detter_System 应当持久化与已完成任务关联的所有 Reflection_Note 数据
4. 当用户创建或修改数据时，Detter_System 应当立即将更改保存到 Local_Storage
5. 当应用重启时，Detter_System 应当在1秒内从 Local_Storage 加载所有数据

### 需求 16: 平台兼容性

**用户故事:** 作为Android用户，我希望应用能够在我的设备上正常运行并适配不同的屏幕尺寸。

#### 验收标准

1. Detter_System 应当支持Android操作系统9.0及以上版本
2. Detter_System 应当适配不同的屏幕尺寸和分辨率，同时保持UI布局的一致性
3. Detter_System 应当打包为APK文件以供Android安装
4. Detter_System 应当在Android设备上请求必要的权限，包括存储访问和通知权限