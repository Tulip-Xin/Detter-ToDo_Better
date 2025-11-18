# Detter - 待办事项管理应用

一个基于React Native开发的待办事项管理应用，支持任务管理、每日复盘和数据统计功能。

## ✨ 主要功能

- 📝 **任务管理** - 按优先级（重要/紧急/琐事）管理待办事项
- 🤔 **每日复盘** - 记录和回顾每日的思考和总结
- 📊 **数据统计** - 可视化展示任务完成情况和趋势
- 🎨 **主题切换** - 支持浅色/深色主题
- 💾 **数据导入导出** - 支持JSON和CSV格式
- 🔔 **任务提醒** - 本地通知提醒
- 🔍 **搜索筛选** - 快速查找任务和复盘

## 🚀 快速开始

### 方式1: 使用启动脚本（推荐）

```cmd
# 检查环境
preview-tools\check-environment.bat

# 启动应用
preview-tools\start-dev.bat
```

### 方式2: 手动启动

```cmd
# 安装依赖
npm install

# 启动Metro
npm start

# 运行Android应用（新终端）
npm run android
```

详细指南请查看: [DetterApp/preview-tools/QUICK_START.md](DetterApp/preview-tools/QUICK_START.md)

## 📱 预览应用

### Android模拟器
1. 安装Android Studio
2. 创建虚拟设备
3. 运行 `preview-tools\start-dev.bat`

### 真实设备
1. 启用USB调试
2. 连接设备
3. 运行 `preview-tools\start-dev.bat`

详细指南请查看: [DetterApp/preview-tools/WINDOWS_PREVIEW_GUIDE.md](DetterApp/preview-tools/WINDOWS_PREVIEW_GUIDE.md)

## 📚 文档

### 用户文档
- [用户使用指南](DetterApp/docs/USER_GUIDE.md) - 完整的功能使用说明
- [已知问题和限制](DetterApp/docs/KNOWN_ISSUES.md) - 当前限制和解决方案

### 预览和启动
- [预览工具](DetterApp/preview-tools/) - Windows预览工具集
- [快速启动](DetterApp/preview-tools/QUICK_START.md) - 最快的启动方式
- [Windows预览指南](DetterApp/preview-tools/WINDOWS_PREVIEW_GUIDE.md) - 完整预览指南

### 开发指南
- [项目设置](DetterApp/docs/SETUP.md) - 详细的设置步骤
- [项目结构](DetterApp/docs/PROJECT_STRUCTURE.md) - 代码结构说明
- [样式指南](DetterApp/docs/STYLING_GUIDE.md) - 样式开发规范
- [性能优化](DetterApp/docs/PERFORMANCE_OPTIMIZATION.md) - 性能优化技巧

### Android发布
- [签名配置](DetterApp/android/SIGNING_README.md) - 配置应用签名
- [APK优化](DetterApp/android/APK_OPTIMIZATION.md) - 减小APK体积
- [构建部署](DetterApp/android/BUILD_AND_DEPLOY.md) - 构建和发布流程
- [发布检查清单](DetterApp/android/RELEASE_CHECKLIST.md) - 发布前检查

### 任务完成文档
查看 [DetterApp/docs/completions/](DetterApp/docs/completions/) 目录了解每个功能的实现细节。

## 🛠️ 技术栈

- **框架**: React Native 0.72+
- **语言**: TypeScript
- **状态管理**: React Context API
- **数据库**: SQLite (react-native-sqlite-storage)
- **导航**: React Navigation
- **动画**: React Native Reanimated
- **手势**: React Native Gesture Handler
- **通知**: Notifee
- **图表**: React Native Chart Kit

## 📦 项目结构

```
DetterApp/
├── src/
│   ├── components/      # UI组件
│   ├── screens/         # 页面组件
│   ├── services/        # 业务逻辑服务
│   ├── contexts/        # 状态管理
│   ├── navigation/      # 导航配置
│   ├── models/          # 数据模型
│   └── utils/           # 工具函数
├── android/             # Android原生代码
├── docs/                # 项目文档
│   └── completions/     # 任务完成文档
├── start-dev.bat        # 启动脚本
└── check-environment.bat # 环境检查
```

详细说明: [DetterApp/docs/PROJECT_STRUCTURE.md](DetterApp/docs/PROJECT_STRUCTURE.md)

## 🔧 开发工具

### 预览工具
- `preview-tools/start-dev.bat` - 一键启动开发环境
- `preview-tools/check-environment.bat` - 检查开发环境配置

### 常用命令
```cmd
# 启动开发服务器
npm start

# 运行Android
npm run android

# 运行测试
npm test

# 代码检查
npm run lint

# TypeScript检查
npx tsc --noEmit
```

## 🐛 问题排查

遇到问题？查看:
- [错误修复总结](DetterApp/docs/ERROR_FIX_SUMMARY.md)
- [Windows预览指南 - 常见问题](DetterApp/preview-tools/WINDOWS_PREVIEW_GUIDE.md#常见问题解决)

## 📝 开发进度

- ✅ 数据模型和数据库 (Task 1)
- ✅ 业务逻辑服务 (Task 2)
- ✅ 状态管理 (Task 3)
- ✅ 导航结构 (Task 4)
- ✅ 通用组件 (Task 5)
- ✅ 任务看板 (Task 6)
- ✅ 任务添加编辑 (Task 7)
- ✅ 复盘功能 (Tasks 8-10)
- ✅ 搜索筛选 (Task 11)
- ✅ 个人中心 (Task 12)
- ✅ 任务编辑 (Task 13)
- ✅ 错误处理 (Task 14)
- ✅ 组件完善 (Task 15)
- ✅ 性能优化 (Task 16)
- ✅ 样式系统 (Task 17)
- ✅ Android打包 (Task 18)
- ✅ 测试 (Task 19)
- ✅ 文档与交付 (Task 20)

**完成度: 20/20 (100%)** 🎉

查看完整项目总结: [PROJECT_COMPLETION_SUMMARY.md](PROJECT_COMPLETION_SUMMARY.md)

## 📄 许可证

本项目仅供学习和个人使用。

## 🤝 贡献

欢迎提出问题和建议！

---

**版本**: 1.0.0  
**最后更新**: 2025-11-18  
**状态**: 开发完成，准备发布 ✅🚀
