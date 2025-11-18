# Windows端预览Detter App指南

本指南介绍如何在Windows系统上预览和测试Detter React Native应用�?

## 预览方法概览

在Windows上有以下几种方法预览React Native应用�?

1. **Android模拟�?* (推荐) - 使用Android Studio的模拟器
2. **真实Android设备** - 通过USB连接手机
3. **Expo Go** (如果使用Expo) - 扫码预览

## 方法1: 使用Android模拟�?(推荐)

### 前置要求

1. **安装Android Studio**
   - 下载地址: https://developer.android.com/studio
   - 安装时确保勾�?"Android Virtual Device"

2. **配置环境变量**
   ```cmd
   # 添加到系统环境变�?
   ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk
   
   # 添加到Path
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

### 步骤1: 创建Android虚拟设备 (AVD)

1. 打开Android Studio
2. 点击 "More Actions" > "Virtual Device Manager"
3. 点击 "Create Device"
4. 选择设备型号（推�? Pixel 5 �?Pixel 6�?
5. 选择系统镜像（推�? Android 13 �?Android 12�?
6. 点击 "Download" 下载系统镜像
7. 配置AVD设置�?
   - RAM: 至少 2048 MB
   - 启用硬件加�?
8. 点击 "Finish" 完成创建

### 步骤2: 启动模拟�?

**方法A: 通过Android Studio**
```
1. 打开 Virtual Device Manager
2. 点击 AVD 旁边的播放按�?�?
```

**方法B: 通过命令�?*
```cmd
# 列出所有可用的AVD
emulator -list-avds

# 启动指定的AVD
emulator -avd Pixel_5_API_33
```

### 步骤3: 运行应用

打开命令提示符或PowerShell，进入项目目录：

```cmd
cd DetterApp

# 确保依赖已安�?
npm install

# 启动Metro bundler
npm start
```

在另一个终端窗口中�?

```cmd
cd DetterApp

# 运行Android应用
npm run android
# �?
npx react-native run-android
```

应用会自动安装到模拟器并启动�?

## 方法2: 使用真实Android设备

### 步骤1: 准备设备

1. **启用开发者选项**
   - 进入 设置 > 关于手机
   - 连续点击 "版本�? 7�?
   - 返回设置，找�?"开发者选项"

2. **启用USB调试**
   - 进入 开发者选项
   - 开�?"USB调试"
   - 开�?"USB安装" (如果�?

3. **连接设备**
   - 使用USB线连接手机到电脑
   - 手机上会弹出授权提示，点�?"允许"

### 步骤2: 验证连接

```cmd
# 检查设备是否连�?
adb devices

# 应该显示类似:
# List of devices attached
# XXXXXXXXXX    device
```

### 步骤3: 运行应用

```cmd
cd DetterApp

# 启动Metro bundler
npm start
```

在另一个终端：

```cmd
cd DetterApp

# 运行到真实设�?
npm run android
```

### 无线调试 (Android 11+)

1. 确保手机和电脑在同一WiFi网络
2. 在开发者选项中启�?"无线调试"
3. 点击 "无线调试" > "使用配对码配对设�?
4. 在电脑上运行�?
   ```cmd
   adb pair <IP地址>:<端口>
   # 输入配对�?
   
   adb connect <IP地址>:<端口>
   ```

## 快速启动脚�?

### 创建启动脚本

创建 `start-dev.bat` 文件�?

```batch
@echo off
echo ====================================
echo   Detter App 开发环境启�?
echo ====================================
echo.

REM 检查是否有设备连接
echo [1/4] 检查Android设备...
adb devices
echo.

REM 启动Metro bundler
echo [2/4] 启动Metro bundler...
start "Metro Bundler" cmd /k "cd /d %~dp0 && npm start"

REM 等待Metro启动
echo [3/4] 等待Metro启动...
timeout /t 5 /nobreak > nul

REM 运行Android应用
echo [4/4] 启动Android应用...
call npm run android

echo.
echo ====================================
echo   应用已启动！
echo ====================================
pause
```

使用方法�?
```cmd
# 双击 start-dev.bat 或在命令行运�?
start-dev.bat
```

## 常见问题解决

### 问题1: 模拟器启动失�?

**错误**: "HAXM is not installed"

**解决方案**:
1. 打开Android Studio
2. Tools > SDK Manager > SDK Tools
3. 勾�?"Intel x86 Emulator Accelerator (HAXM)"
4. 点击 Apply 安装

或者启用Hyper-V（Windows 10/11 Pro）：
```powershell
# 以管理员身份运行PowerShell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

### 问题2: adb devices 显示 "unauthorized"

**解决方案**:
1. 拔掉USB�?
2. 在手机上：设�?> 开发者选项 > 撤销USB调试授权
3. 重新连接USB
4. 在手机上点击 "允许"

### 问题3: Metro bundler 端口被占�?

**错误**: "Port 8081 already in use"

**解决方案**:
```cmd
# 查找占用端口的进�?
netstat -ano | findstr :8081

# 结束进程 (替换PID为实际进程ID)
taskkill /PID <PID> /F

# 或者使用不同端�?
npx react-native start --port 8088
```

### 问题4: 应用安装失败

**错误**: "INSTALL_FAILED_INSUFFICIENT_STORAGE"

**解决方案**:
- 清理模拟�?设备存储空间
- 卸载旧版本应用：`adb uninstall com.detterapp`

### 问题5: 白屏或红屏错�?

**解决方案**:
```cmd
# 清理缓存
cd DetterApp
npm start -- --reset-cache

# 清理Android构建
cd android
gradlew clean
cd ..

# 重新安装依赖
rm -rf node_modules
npm install

# 重新运行
npm run android
```

## 开发工�?

### React Native Debugger

1. 下载安装: https://github.com/jhen0409/react-native-debugger/releases
2. 启动应用后，在模拟器中按 `Ctrl + M` (或摇晃真实设�?
3. 选择 "Debug"

### Chrome DevTools

1. 在应用中打开开发菜�?(`Ctrl + M`)
2. 选择 "Debug"
3. 在Chrome中打开 `chrome://inspect`

### 热重�?

应用支持热重载，修改代码后会自动刷新�?
- 快速刷�?(Fast Refresh): 自动
- 手动刷新: �?`R` 两次
- 重新加载: `Ctrl + M` > Reload

## 性能优化建议

### 模拟器性能优化

1. **增加RAM分配**
   - Virtual Device Manager > Edit AVD
   - 增加RAM�?4096 MB

2. **启用硬件加�?*
   - 确保启用�?HAXM �?Hyper-V

3. **使用较新的系统镜�?*
   - 推荐使用 Android 12 �?13

### 开发体验优�?

1. **使用快速刷�?*
   ```javascript
   // 在开发菜单中启用 Fast Refresh
   ```

2. **减少日志输出**
   ```javascript
   // 在开发时可以临时禁用某些日志
   console.log = () => {};
   ```

3. **使用Flipper调试**
   - 内置在React Native�?
   - 提供网络、布局、日志等调试功能

## 推荐的开发流�?

1. **启动模拟�?*
   ```cmd
   emulator -avd Pixel_5_API_33
   ```

2. **启动Metro**
   ```cmd
   cd DetterApp
   npm start
   ```

3. **运行应用**
   ```cmd
   # 在另一个终�?
   npm run android
   ```

4. **开发和测试**
   - 修改代码
   - 应用自动刷新
   - 测试功能

5. **调试**
   - 使用Chrome DevTools
   - 查看日志: `adb logcat`
   - 使用React Native Debugger

## 有用的命�?

```cmd
# 查看设备列表
adb devices

# 查看应用日志
adb logcat | findstr DetterApp

# 清除应用数据
adb shell pm clear com.detterapp

# 卸载应用
adb uninstall com.detterapp

# 安装APK
adb install path/to/app.apk

# 截图
adb shell screencap -p /sdcard/screen.png
adb pull /sdcard/screen.png

# 录屏
adb shell screenrecord /sdcard/demo.mp4
# 按Ctrl+C停止
adb pull /sdcard/demo.mp4

# 查看应用信息
adb shell dumpsys package com.detterapp

# 重启adb服务
adb kill-server
adb start-server
```

## 资源链接

- [React Native官方文档](https://reactnative.dev/)
- [Android Studio下载](https://developer.android.com/studio)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [ADB命令参考](https://developer.android.com/studio/command-line/adb)

## 总结

推荐使用 **Android模拟�?* 进行日常开发，因为�?
- �?不需要物理设�?
- �?可以测试不同设备和Android版本
- �?方便截图和录�?
- �?开发工具集成良�?

使用 **真实设备** 进行最终测试，因为�?
- �?性能更接近真实用户体�?
- �?可以测试传感器、相机等硬件功能
- �?可以测试真实网络环境

祝开发顺利！🚀
