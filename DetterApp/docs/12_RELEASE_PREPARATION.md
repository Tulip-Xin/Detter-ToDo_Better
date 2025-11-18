# Detter 发布准备指南

本文档提供完整的发布准备流程，包括应用图标、启动画面、截图、宣传材料和最�?APK 打包�?

## 📋 目录

- [发布前检查清单](#发布前检查清�?
- [应用图标准备](#应用图标准备)
- [启动画面配置](#启动画面配置)
- [应用截图](#应用截图)
- [宣传材料](#宣传材料)
- [版本信息更新](#版本信息更新)
- [最�?APK 打包](#最�?apk-打包)
- [发布渠道](#发布渠道)

---

## 发布前检查清�?

### �?代码质量

- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] �?ESLint 警告
- [ ] �?TypeScript 错误
- [ ] 性能测试通过
- [ ] 内存泄漏检�?

### �?功能验收

- [ ] 完成验收测试清单
- [ ] 所有核心功能正�?
- [ ] 边界情况处理正确
- [ ] 错误处理完善
- [ ] 用户体验良好

### �?文档完善

- [ ] README.md 更新
- [ ] CHANGELOG.md 更新
- [ ] 用户指南完成
- [ ] 开发者文档完�?
- [ ] API 文档完成

### �?版本信息

- [ ] 更新 versionCode
- [ ] 更新 versionName
- [ ] 更新 package.json version
- [ ] 更新 CHANGELOG.md

### �?资源准备

- [ ] 应用图标准备
- [ ] 启动画面配置
- [ ] 应用截图准备
- [ ] 宣传材料准备

---

## 应用图标准备

### 图标规格

Android 需要多种尺寸的图标�?

| 密度 | 尺寸 | 路径 |
|------|------|------|
| mdpi | 48x48 | android/app/src/main/res/mipmap-mdpi/ |
| hdpi | 72x72 | android/app/src/main/res/mipmap-hdpi/ |
| xhdpi | 96x96 | android/app/src/main/res/mipmap-xhdpi/ |
| xxhdpi | 144x144 | android/app/src/main/res/mipmap-xxhdpi/ |
| xxxhdpi | 192x192 | android/app/src/main/res/mipmap-xxxhdpi/ |

### 图标设计要求

**设计规范**:
- 简洁明了，易于识别
- 符合 Material Design 规范
- 使用应用主色�?
- 避免过多细节
- 支持圆形、方形、圆角方�?

**Detter 图标建议**:
- 主色: #dc663c (重要) �?#eb9e28 (紧�?
- 图形: 复选框 + 对勾
- 风格: 极简、现�?
- 背景: 纯色或渐�?

### 生成图标

**方式 1: 在线工具**
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [App Icon Generator](https://appicon.co/)

**方式 2: 手动创建**
```bash
# 使用 ImageMagick 批量生成
magick convert icon-512.png -resize 48x48 mipmap-mdpi/ic_launcher.png
magick convert icon-512.png -resize 72x72 mipmap-hdpi/ic_launcher.png
magick convert icon-512.png -resize 96x96 mipmap-xhdpi/ic_launcher.png
magick convert icon-512.png -resize 144x144 mipmap-xxhdpi/ic_launcher.png
magick convert icon-512.png -resize 192x192 mipmap-xxxhdpi/ic_launcher.png
```

### 圆形图标

Android 8.0+ 支持自适应图标�?

```xml
<!-- android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml -->
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

---

## 启动画面配置

### 当前配置

启动画面已配置在 `android/app/src/main/res/drawable/launch_screen.xml`

### 自定义启动画�?

**方式 1: 纯色背景**
```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@mipmap/ic_launcher"/>
    </item>
</layer-list>
```

**方式 2: 品牌启动画面**
```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
    <item android:gravity="bottom">
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_text"/>
    </item>
</layer-list>
```

### 启动画面资源

准备以下资源�?

1. **背景�?*: `#ecfaf6` (应用主背景色)
2. **Logo**: 应用图标或品�?Logo
3. **文字**: "Detter" �?"ToDo Better"

---

## 应用截图

### 截图要求

**Google Play 要求**:
- 最�?2 张，最�?8 �?
- 格式: JPEG �?PNG
- 尺寸: 320-3840 像素
- 推荐: 1080x1920 (9:16) �?1920x1080 (16:9)

### 截图内容建议

1. **主界�?* - 任务看板，展示三个优先级容器
2. **添加任务** - 底部面板，展示添加任务界�?
3. **日历视图** - 展开的日历，显示公历和农�?
4. **卡片列表** - 复盘模块的卡片视图，展示动态效�?
5. **清单列表** - 复盘模块的清单视�?
6. **数据统计** - 个人中心的图表展�?
7. **主题切换** - 浅色和深色主题对�?
8. **任务完成** - 完成任务和复盘流�?

### 截图技�?

**准备测试数据**:
```typescript
// 创建示例任务
const sampleTasks = [
  { title: '完成项目报告', priority: 'important', tags: ['工作'] },
  { title: '回复客户邮件', priority: 'urgent', tags: ['工作', '紧�?] },
  { title: '购买生活用品', priority: 'trivial', tags: ['生活'] },
];
```

**使用模拟器截�?*:
```bash
# Android Studio 模拟�?
# 点击侧边栏的相机图标

# 或使�?adb
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

**美化截图**:
- 使用 [Mockuphone](https://mockuphone.com/) 添加设备边框
- 使用 [Figma](https://www.figma.com/) 添加说明文字
- 使用 [Canva](https://www.canva.com/) 制作宣传�?

---

## 宣传材料

### 应用商店描述

**简短描�?* (80 字符以内):
```
Detter - 待办事项管理与每日复盘，让你 Do Better�?
```

**完整描述**:
```
Detter (ToDo Better) 是一款简洁高效的待办事项管理应用，帮助你更好地规划任务、完成目标、反思成长�?

�?核心功能

📝 任务管理
�?按优先级（重�?紧�?琐事）管理待办事�?
�?支持子任务、标签、提醒等丰富功能
�?拖拽排序，灵活调整任务顺�?
�?日历视图，显示公历和农历

🤔 每日复盘
�?完成任务后即时记录反�?
�?卡片列表，沉浸式浏览体验
�?清单列表，快速查看所有复�?
�?搜索筛选，轻松找到历史记录

📊 数据统计
�?完成率统计，了解执行�?
�?任务分布图表，优化时间管�?
�?复盘习惯统计，培养反思习�?

🎨 个性化
�?浅色/深色主题切换
�?数据导入导出，安全备�?
�?完全离线使用，保护隐�?

💡 核心理念

"一件事情要么紧急，要么重要"
避免"重要且紧�?的情况，提前规划，从容应对�?

"Do Better"
不仅完成任务，更要反思总结，持续改进�?

🚀 立即下载，开始你的高效之旅！
```

### 宣传�?

**特性海�?* (1920x1080):
- 标题: "Detter - ToDo Better"
- 副标�? "待办事项管理 + 每日复盘"
- 核心特性图标展�?
- 应用截图拼贴

**功能介绍�?* (1080x1920):
- 任务管理功能
- 复盘功能
- 数据统计功能
- 每个功能配截图和说明

### 宣传视频

**脚本大纲** (30-60 �?:
1. 开�?(5s): Logo + Slogan
2. 问题 (5s): 任务太多，无从下手？
3. 解决方案 (15s): 展示任务管理功能
4. 特色功能 (15s): 展示复盘功能
5. 结尾 (5s): 下载二维�?+ Slogan

---

## 版本信息更新

### 1. 更新 build.gradle

```gradle
// android/app/build.gradle
android {
    defaultConfig {
        versionCode 1          // 每次发布递增
        versionName "1.0.0"    // 语义化版本号
    }
}
```

### 2. 更新 package.json

```json
{
  "name": "DetterApp",
  "version": "1.0.0",
  "description": "Detter - 待办事项管理与每日复�?
}
```

### 3. 更新 CHANGELOG.md

添加新版本的变更记录�?
```markdown
## [1.0.0] - 2025-11-18

### 新增
- 初始版本发布
- 任务管理功能
- 复盘功能
- ...
```

### 4. 更新 README.md

更新版本号和状态：
```markdown
**版本**: 1.0.0  
**状�?*: 已发�?�?
```

---

## 最�?APK 打包

### 1. 清理项目

```cmd
cd android
gradlew clean
cd ..
```

### 2. 配置签名

确保已配置签名密钥：
```cmd
# 检�?keystore 文件
dir android\app\detter-release-key.keystore

# 设置环境变量
set KEYSTORE_PASSWORD=your_password
set KEY_ALIAS=detter-key
set KEY_PASSWORD=your_password
```

### 3. 构建 Release APK

```cmd
cd android
build-release.bat
```

或手动构建：
```cmd
cd android
gradlew assembleRelease
```

### 4. 验证 APK

**检查文�?*:
```cmd
dir app\build\outputs\apk\release\
```

**安装测试**:
```cmd
adb install app\build\outputs\apk\release\app-release.apk
```

**测试所有功�?*:
- 参�?[ACCEPTANCE_TEST_CHECKLIST.md](ACCEPTANCE_TEST_CHECKLIST.md)
- 在真实设备上完整测试
- 验证性能指标

### 5. 构建 AAB (Google Play)

```cmd
cd android
gradlew bundleRelease
```

输出: `app\build\outputs\bundle\release\app-release.aab`

### 6. 签名验证

```cmd
# 验证 APK 签名
jarsigner -verify -verbose -certs app-release.apk

# 查看签名信息
keytool -printcert -jarfile app-release.apk
```

---

## 发布渠道

### Google Play Store

**准备材料**:
- [ ] AAB 文件
- [ ] 应用图标 (512x512)
- [ ] 特色图片 (1024x500)
- [ ] 应用截图 (2-8 �?
- [ ] 应用描述
- [ ] 隐私政策链接
- [ ] 内容分级问卷

**发布步骤**:
1. 登录 [Google Play Console](https://play.google.com/console)
2. 创建应用
3. 填写应用信息
4. 上传 AAB
5. 设置定价和分�?
6. 提交审核

### 其他应用商店

**国内应用商店**:
- 华为应用市场
- 小米应用商店
- OPPO 软件商店
- Vivo 应用商店
- 应用宝（腾讯�?
- 豌豆�?
- 360 手机助手

**准备材料**:
- APK 文件
- 应用图标
- 应用截图
- 应用描述
- 软件著作权（部分商店需要）

### 直接分发

**GitHub Releases**:
```bash
# 创建 Release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 上传 APK �?GitHub Releases
```

**自建下载�?*:
- 提供 APK 下载链接
- 显示版本信息
- 提供安装说明
- 添加更新日志

---

## 发布后工�?

### 监控和反�?

- [ ] 监控崩溃报告
- [ ] 收集用户反馈
- [ ] 跟踪下载量和评分
- [ ] 回复用户评论

### 持续改进

- [ ] 修复发现�?Bug
- [ ] 优化性能问题
- [ ] 添加用户建议的功�?
- [ ] 准备下一个版�?

### 营销推广

- [ ] 社交媒体宣传
- [ ] 技术博客文�?
- [ ] 产品介绍视频
- [ ] 用户案例分享

---

## 检查清单总结

### 发布前最终检�?

- [ ] 所有测试通过
- [ ] 文档完善
- [ ] 版本号更�?
- [ ] 应用图标准备
- [ ] 启动画面配置
- [ ] 应用截图准备
- [ ] 宣传材料准备
- [ ] Release APK 构建
- [ ] 真机测试通过
- [ ] 签名验证通过

### 发布材料清单

- [ ] app-release.apk
- [ ] app-release.aab
- [ ] 应用图标 (512x512)
- [ ] 特色图片 (1024x500)
- [ ] 应用截图 (2-8 �?
- [ ] 应用描述文本
- [ ] CHANGELOG.md
- [ ] 隐私政策

---

**准备完成后，即可开始发布流程！** 🚀

**文档版本**: 1.0  
**最后更�?*: 2025-11-18
