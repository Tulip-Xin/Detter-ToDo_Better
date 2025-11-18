# Detter App 文档目录

本目录包含Detter应用的所有开发文档和指南。

## 📁 文档结构

```
docs/
├── README.md                          # 本文档（文档索引）
├── 01_USER_GUIDE.md                   # 用户使用指南
├── 02_DEVELOPER_GUIDE.md              # 开发者指南
├── 03_SETUP.md                        # 项目设置指南
├── 04_PROJECT_STRUCTURE.md            # 项目结构说明
├── 05_STYLING_GUIDE.md                # 样式开发指南
├── 06_STYLE_QUICK_REFERENCE.md        # 样式快速参考
├── 07_PERFORMANCE_OPTIMIZATION.md     # 性能优化指南
├── 08_TESTING_GUIDE.md                # 测试指南
├── 09_TEST_SUMMARY.md                 # 测试总结
├── 10_ACCEPTANCE_TEST_CHECKLIST.md    # 验收测试清单
├── 11_KNOWN_ISSUES.md                 # 已知问题和限制
├── 12_RELEASE_PREPARATION.md          # 发布准备指南
├── 13_ERROR_FIX_SUMMARY.md            # 错误修复总结
├── 14_FILE_ORGANIZATION_SUMMARY.md    # 文件组织总结
└── completions/                       # 任务完成文档
    ├── README.md                      # 任务文档索引
    ├── TASK_1_COMPLETION.md           # 任务1-18完成文档
    └── ...
```

## 📚 文档分类与编号

### 用户文档 (01)
- **01_USER_GUIDE.md** - 用户使用指南，包含快速入门、功能说明、使用技巧

### 开发文档 (02-07)
- **02_DEVELOPER_GUIDE.md** - 开发者指南，包含架构设计、开发规范、构建部署
- **03_SETUP.md** - 项目设置指南，详细的环境搭建步骤
- **04_PROJECT_STRUCTURE.md** - 项目结构说明，目录和文件组织
- **05_STYLING_GUIDE.md** - 样式开发指南，样式系统和组件样式
- **06_STYLE_QUICK_REFERENCE.md** - 样式快速参考，常用样式速查
- **07_PERFORMANCE_OPTIMIZATION.md** - 性能优化指南，优化技巧和最佳实践

### 测试文档 (08-10)
- **08_TESTING_GUIDE.md** - 测试指南，测试策略和方法
- **09_TEST_SUMMARY.md** - 测试总结，测试结果汇总
- **10_ACCEPTANCE_TEST_CHECKLIST.md** - 验收测试清单，发布前检查

### 问题与发布 (11-14)
- **11_KNOWN_ISSUES.md** - 已知问题和限制，当前版本的限制说明
- **12_RELEASE_PREPARATION.md** - 发布准备指南，发布流程和检查清单
- **13_ERROR_FIX_SUMMARY.md** - 错误修复总结，已修复的问题记录
- **14_FILE_ORGANIZATION_SUMMARY.md** - 文件组织总结，项目文件整理说明

### 任务完成记录
- **completions/** - 所有任务的完成文档（TASK_1 到 TASK_20），记录每个功能的实现细节

## 🚀 推荐阅读顺序

### 新用户
1. **01_USER_GUIDE.md** - 了解如何使用应用
2. **11_KNOWN_ISSUES.md** - 了解当前限制

### 新开发者
1. **02_DEVELOPER_GUIDE.md** - 了解项目架构和开发规范
2. **03_SETUP.md** - 搭建开发环境
3. **04_PROJECT_STRUCTURE.md** - 熟悉项目结构
4. **05_STYLING_GUIDE.md** - 学习样式系统
5. **completions/** - 查看功能实现细节

### 测试人员
1. **08_TESTING_GUIDE.md** - 了解测试方法
2. **10_ACCEPTANCE_TEST_CHECKLIST.md** - 执行验收测试
3. **09_TEST_SUMMARY.md** - 查看测试结果

### 发布准备
1. **12_RELEASE_PREPARATION.md** - 发布准备流程
2. **10_ACCEPTANCE_TEST_CHECKLIST.md** - 发布前检查
3. **11_KNOWN_ISSUES.md** - 确认已知问题

## 📖 其他文档位置

### Android相关文档
位于 `android/` 目录：
- `SIGNING_README.md` - 应用签名配置
- `APK_OPTIMIZATION.md` - APK优化指南
- `BUILD_AND_DEPLOY.md` - 构建和部署指南
- `RELEASE_CHECKLIST.md` - 发布检查清单

### 预览工具文档
位于 `preview-tools/` 目录：
- `README.md` - 预览工具说明
- `WINDOWS_PREVIEW_GUIDE.md` - Windows预览指南
- `HOW_TO_BUILD_NOW.md` - 快速构建指南

## 💡 使用建议

1. **首次使用**: 从 01_USER_GUIDE.md 开始
2. **开始开发**: 按顺序阅读 02-07 号文档
3. **遇到问题**: 查看 11_KNOWN_ISSUES.md 和 13_ERROR_FIX_SUMMARY.md
4. **了解实现**: 查看 completions/ 目录下的任务完成文档
5. **准备发布**: 参考 12_RELEASE_PREPARATION.md 和 android/ 目录下的文档

## 🔄 文档更新

文档会随着项目开发持续更新。如果发现文档有误或需要补充，请及时更新。

---

**最后更新**: 2025-11-18  
**项目版本**: 1.0.0  
**文档总数**: 14 个主要文档 + 20 个任务完成文档
