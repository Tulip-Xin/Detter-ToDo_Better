/**
 * AboutAndHelp - 关于和帮助组件
 * 显示应用信息、版本号、开发者信息和帮助指导
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const AboutAndHelp: React.FC = () => {
  const { theme } = useTheme();

  const appInfo = {
    name: 'Detter',
    fullName: 'Detter - ToDo Better',
    version: '1.0.0',
    buildNumber: '1',
    developer: 'Detter Team',
    email: 'support@detter.app',
    website: 'https://detter.app',
  };

  const handleEmailContact = () => {
    const email = appInfo.email;
    const subject = 'Detter 反馈';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('提示', `请发送邮件至：${email}`);
        }
      })
      .catch((error) => {
        console.error('Error opening email:', error);
        Alert.alert('提示', `请发送邮件至：${email}`);
      });
  };

  const handleWebsiteOpen = () => {
    Linking.canOpenURL(appInfo.website)
      .then((supported) => {
        if (supported) {
          Linking.openURL(appInfo.website);
        } else {
          Alert.alert('提示', '无法打开网站');
        }
      })
      .catch((error) => {
        console.error('Error opening website:', error);
        Alert.alert('提示', '无法打开网站');
      });
  };

  return (
    <View style={styles.container}>
      {/* 应用信息 */}
      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>D</Text>
        </View>
        <Text style={[styles.appName, { color: theme.text }]}>
          {appInfo.fullName}
        </Text>
        <Text style={[styles.version, { color: theme.textSecondary }]}>
          版本 {appInfo.version} ({appInfo.buildNumber})
        </Text>
      </View>

      {/* 开发者信息 */}
      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          开发者信息
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            开发团队
          </Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {appInfo.developer}
          </Text>
        </View>
      </View>

      {/* 帮助指导 */}
      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          使用指南
        </Text>
        <View style={styles.helpItem}>
          <Text style={[styles.helpTitle, { color: theme.text }]}>
            📝 任务管理
          </Text>
          <Text style={[styles.helpText, { color: theme.textSecondary }]}>
            在"行"页面添加任务，按优先级分类为重要、紧急和琐事。长按可拖拽排序，左滑显示更多操作。
          </Text>
        </View>
        <View style={styles.helpItem}>
          <Text style={[styles.helpTitle, { color: theme.text }]}>
            💭 复盘反思
          </Text>
          <Text style={[styles.helpText, { color: theme.textSecondary }]}>
            完成任务后可添加复盘笔记。在"思"页面查看所有已完成任务，支持卡片和列表两种视图。
          </Text>
        </View>
        <View style={styles.helpItem}>
          <Text style={[styles.helpTitle, { color: theme.text }]}>
            📊 数据统计
          </Text>
          <Text style={[styles.helpText, { color: theme.textSecondary }]}>
            在"我"页面查看完成率、任务分布和复盘习惯等统计数据，了解自己的进度。
          </Text>
        </View>
        <View style={styles.helpItem}>
          <Text style={[styles.helpTitle, { color: theme.text }]}>
            💾 数据备份
          </Text>
          <Text style={[styles.helpText, { color: theme.textSecondary }]}>
            定期使用数据导出功能备份您的数据，避免数据丢失。
          </Text>
        </View>
      </View>

      {/* 联系方式 */}
      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          联系我们
        </Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleEmailContact}>
          <Text style={[styles.contactButtonText, { color: theme.primary }]}>
            📧 发送反馈邮件
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={handleWebsiteOpen}>
          <Text style={[styles.contactButtonText, { color: theme.primary }]}>
            🌐 访问官网
          </Text>
        </TouchableOpacity>
      </View>

      {/* 版权信息 */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          © 2024 Detter Team. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#dc663c',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  appIconText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  helpItem: {
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
  },
  helpText: {
    fontSize: 13,
    lineHeight: 20,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default AboutAndHelp;
