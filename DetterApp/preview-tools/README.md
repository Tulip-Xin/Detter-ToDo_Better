# Detter App 预览工具

本目录包含在Windows上预览和运行Detter应用所需的所有工具和文档�?

## 📁 目录内容

```
preview-tools/
├── README.md                    # 本文�?
├── start-dev.bat                # 一键启动脚�?�?
├── check-environment.bat        # 环境检查工�?
├── QUICK_START.md               # 快速启动指�?
└── WINDOWS_PREVIEW_GUIDE.md     # 完整预览指南
```

## 🚀 快速开�?

### 第一次使�?

1. **检查环�?*
   ```cmd
   check-environment.bat
   ```
   这会检查：
   - Node.js 是否安装
   - npm 是否可用
   - Java JDK 是否安装
   - Android SDK 是否配置
   - ADB 是否可用
   - 是否有设备连�?

2. **启动应用**
   ```cmd
   start-dev.bat
   ```
   这会自动�?
   - 检查设备连�?
   - 安装依赖（如果需要）
   - 启动Metro服务�?
   - 构建并安装应�?

### 已经配置好环�?

直接运行�?
```cmd
start-dev.bat
```

## 📱 准备设备

### 选项1: Android模拟器（推荐�?

1. 安装Android Studio
2. 打开Virtual Device Manager
3. 创建虚拟设备（推荐Pixel 5, Android 13�?
4. 启动模拟�?
5. 运行 `start-dev.bat`

### 选项2: 真实Android设备

1. 在手机上启用开发者选项（连续点击版本号7次）
2. 启用USB调试
3. 用USB线连接电�?
4. 在手机上授权电脑调试
5. 运行 `start-dev.bat`

## 📖 文档说明

### QUICK_START.md
- 最简洁的启动指南
- 常用命令速查
- 快速问题解�?

### WINDOWS_PREVIEW_GUIDE.md
- 完整的Windows预览指南
- 详细的环境配置步�?
- 模拟器和真实设备配置
- 常见问题详细解答
- 开发工具介�?

## 🛠�?工具说明

### start-dev.bat
**一键启动开发环�?*

功能�?
- �?自动检查设备连�?
- �?自动安装依赖
- �?启动Metro bundler
- �?构建并安装应�?
- �?显示详细的进度信�?

使用方法�?
```cmd
# 在preview-tools目录�?
start-dev.bat

# 或在项目根目�?
preview-tools\start-dev.bat
```

### check-environment.bat
**环境检查工�?*

检查项目：
- �?Node.js 版本
- �?npm 版本
- �?Java JDK
- �?Android SDK
- �?ADB工具
- �?连接的设�?
- �?项目依赖

使用方法�?
```cmd
# 在preview-tools目录�?
check-environment.bat

# 或在项目根目�?
preview-tools\check-environment.bat
```

## 💡 使用技�?

### 首次运行
1. 先运�?`check-environment.bat` 确保环境正确
2. 解决所有环境问�?
3. 启动模拟器或连接设备
4. 运行 `start-dev.bat`

### 日常开�?
直接运行 `start-dev.bat` 即可

### 遇到问题
1. 运行 `check-environment.bat` 检查环�?
2. 查看 `WINDOWS_PREVIEW_GUIDE.md` 的常见问题部�?
3. 尝试清理缓存重新运行

## 🔧 常用命令

```cmd
# 检查环�?
check-environment.bat

# 启动开�?
start-dev.bat

# 手动启动（在项目根目录）
npm start              # 终端1: 启动Metro
npm run android        # 终端2: 运行Android

# 清理缓存
npm start -- --reset-cache

# 查看设备
adb devices

# 查看日志
adb logcat | findstr DetterApp
```

## �?快捷�?

在模拟器/设备上：
- `Ctrl + M` - 打开开发菜�?
- `R R` - 快速刷�?
- 修改代码自动热重�?

## 🐛 常见问题

### 端口被占�?
```cmd
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### 设备未授�?
```cmd
adb kill-server
adb start-server
```

### 应用白屏
```cmd
npm start -- --reset-cache
```

更多问题解决方案请查�?`WINDOWS_PREVIEW_GUIDE.md`

## 📚 相关文档

- [项目主页](../README.md)
- [项目设置](../docs/SETUP.md)
- [项目结构](../docs/PROJECT_STRUCTURE.md)
- [文档索引](../DOCUMENTATION_INDEX.md)

## 🎯 目标

让你能够�?
- �?快速启动开发环�?
- �?轻松预览应用效果
- �?高效进行开发调�?
- �?快速解决常见问�?

---

**提示**: 所有脚本都可以直接双击运行，也可以在命令行中执行�?

**最后更�?*: 2025
