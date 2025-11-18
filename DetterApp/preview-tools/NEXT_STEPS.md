# 🎉 设备已连接！下一步操作指�?

你的设备已经成功连接，Metro服务器也已经启动。现在按照以下步骤运行应用：

## �?当前状�?

- �?设备已连�?
- �?Metro服务器正在运行（端口8081�?

## 📱 下一步操�?

### 方法1: 使用命令行（推荐�?

打开一�?*新的命令提示符或PowerShell窗口**，然后运行：

```cmd
cd "D:\Users\LEO\Downloads\Jike Coding\DetterApp"
npm run android
```

这会�?
1. 构建Android应用（首次需要几分钟�?
2. 自动安装到你的设�?
3. 启动应用

### 方法2: 在Metro窗口中按 'a'

如果Metro服务器窗口还在运行：
1. 切换到Metro服务器窗�?
2. 按键盘上�?`a` �?
3. 等待构建和安装完�?

## ⏱️ 预期时间

- **首次构建**: 3-5分钟（需要下载依赖和编译�?
- **后续构建**: 30�?1分钟

## 📊 构建过程

你会看到类似这样的输出：

```
> react-native run-android

info Running jetifier to migrate libraries to AndroidX.
info Starting JS server...
info Installing the app...

> Task :app:installDebug
Installing APK 'app-debug.apk' on 'Device Name'
Installed on 1 device.

BUILD SUCCESSFUL in 2m 15s
```

## �?应用启动�?

应用会自动在你的设备上启动，你会看到�?

1. **启动屏幕** - Detter Logo
2. **主界�?* - 三个标签页：
   - 📝 **�?* - 任务管理
   - 🤔 **�?* - 每日复盘
   - 👤 **�?* - 个人中心

## 🎮 开发菜�?

在设备上�?
- **打开菜单**: 摇晃设备 �?按菜单键
- **刷新**: �?`R` 两次
- **调试**: 选择 "Debug"

在模拟器上：
- **打开菜单**: `Ctrl + M`
- **刷新**: `R R`

## 🔥 热重�?

修改代码后，应用会自动刷新！无需手动操作�?

## 🐛 如果遇到问题

### 构建失败

```cmd
# 清理缓存
npm start -- --reset-cache

# 清理Android构建
cd android
gradlew clean
cd ..

# 重新运行
npm run android
```

### 设备未识�?

```cmd
# 检查设备连�?
adb devices

# 如果显示 "unauthorized"，在手机上重新授�?
```

### 端口被占�?

```cmd
# 查找占用8081端口的进�?
netstat -ano | findstr :8081

# 结束进程（替�?PID>为实际进程ID�?
taskkill /PID <PID> /F
```

## 📝 测试功能

应用启动后，你可以测试：

### 任务管理（行�?
1. 点击 "+" 添加任务
2. 选择优先级（重要/紧�?琐事�?
3. 设置到期时间
4. 添加标签
5. 滑动任务完成/删除
6. 拖拽任务重新排序

### 复盘功能（思）
1. 点击 "+" 添加复盘
2. 输入今日总结
3. 添加收获和待改进
4. 查看历史复盘
5. 卡片滑动浏览

### 个人中心（我�?
1. 查看统计数据
2. 切换主题（浅�?深色�?
3. 导出数据
4. 导入数据
5. 设置通知

## 🎨 界面特点

- 🎨 **主色�?*: 橙红�?(#dc663c)
- 🌈 **背景�?*: 薄荷�?(#ecfaf6)
- 🌙 **深色模式**: 支持
- �?**动画**: 流畅的过渡和手势

## 📸 截图建议

测试时可以截图记录：
- 任务看板界面
- 复盘卡片视图
- 统计图表
- 主题切换效果

## 🚀 下一�?

应用运行后：
1. 测试所有功�?
2. 检查UI效果
3. 测试手势交互
4. 验证数据持久�?
5. 测试主题切换

## 💡 提示

- 首次运行会创建数据库
- 所有数据存储在本地
- 支持离线使用
- 修改代码会自动刷�?

---

**准备好了吗？打开新终端运�?`npm run android`�?* 🎉

**需要帮助？** 查看 [WINDOWS_PREVIEW_GUIDE.md](WINDOWS_PREVIEW_GUIDE.md) 获取详细指南�?
