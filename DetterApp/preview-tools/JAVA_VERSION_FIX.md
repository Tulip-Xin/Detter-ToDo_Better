# Java版本问题解决方案

## 🐛 问题描述

构建失败，错误信息：
```
Unsupported class file major version 65
```

这表示Java版本不兼容�?

## 📊 当前状�?

- **当前Java版本**: 1.8.0_361 (Java 8)
- **需要的版本**: Java 11 �?Java 17
- **问题**: Gradle 8.0.1 需要更新的Java版本

## �?解决方案

### 方案1: 安装Java 17 (推荐)

1. **下载Java 17**
   - Oracle JDK: https://www.oracle.com/java/technologies/downloads/#java17
   - �?OpenJDK: https://adoptium.net/

2. **安装Java 17**
   - 运行下载的安装程�?
   - 记住安装路径（例如：`C:\Program Files\Java\jdk-17`�?

3. **设置JAVA_HOME环境变量**
   
   打开PowerShell（管理员权限）：
   ```powershell
   # 设置JAVA_HOME
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'Machine')
   
   # 更新PATH
   $path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
   $newPath = "$env:JAVA_HOME\bin;$path"
   [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')
   ```

4. **重启命令提示�?*
   - 关闭所有命令提示符窗口
   - 重新打开

5. **验证Java版本**
   ```cmd
   java -version
   # 应该显示 java version "17.x.x"
   ```

### 方案2: 使用Java 11

如果你已经安装了Java 11�?

1. **找到Java 11安装路径**
   ```cmd
   where java
   ```

2. **设置JAVA_HOME**
   ```cmd
   setx JAVA_HOME "C:\Program Files\Java\jdk-11" /M
   ```

3. **重启命令提示符并验证**

### 方案3: 临时使用特定Java版本

如果你有多个Java版本�?

```cmd
# 设置临时JAVA_HOME（仅当前会话�?
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

# 验证
java -version

# 然后运行构建
cd DetterApp
npm run android
```

## 🔧 清理Gradle缓存

安装新Java版本后，清理Gradle缓存�?

```cmd
# 删除Gradle缓存
rmdir /s /q "%USERPROFILE%\.gradle\caches"

# 清理Android构建
cd DetterApp\android
gradlew clean
cd ..
```

## 🚀 重新构建

```cmd
cd DetterApp
npm run android
```

## 📝 验证步骤

1. **检查Java版本**
   ```cmd
   java -version
   javac -version
   ```
   应该显示 17.x.x �?11.x.x

2. **检查JAVA_HOME**
   ```cmd
   echo %JAVA_HOME%
   ```
   应该指向正确的Java安装目录

3. **检查PATH**
   ```cmd
   echo %PATH%
   ```
   应该包含 `%JAVA_HOME%\bin`

## 🎯 推荐配置

- **Java版本**: Java 17 (LTS)
- **Gradle版本**: 8.0.1 (已配�?
- **Android Gradle Plugin**: 8.1.0 (已配�?

## 📚 相关链接

- [Java 17 下载](https://www.oracle.com/java/technologies/downloads/#java17)
- [OpenJDK 下载](https://adoptium.net/)
- [React Native环境配置](https://reactnative.dev/docs/environment-setup)
- [Gradle Java兼容性](https://docs.gradle.org/current/userguide/compatibility.html)

## 💡 提示

- 安装Java后必须重启命令提示符
- 如果有多个Java版本，确保JAVA_HOME指向正确的版�?
- 清理Gradle缓存可以解决很多构建问题

---

**完成这些步骤后，重新运行 `npm run android` 即可�?*
