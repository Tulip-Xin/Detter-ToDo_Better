/**
 * NotificationSettings - 通知设置组件
 * 允许用户启用或禁用任务提醒通知
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationService from '../../services/NotificationService';

const NotificationSettings: React.FC = () => {
  const { theme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotificationStatus();
  }, []);

  const loadNotificationStatus = async () => {
    try {
      await NotificationService.init();
      setEnabled(NotificationService.isEnabled());
    } catch (error) {
      console.error('Error loading notification status:', error);
    }
  };

  const handleToggle = async (value: boolean) => {
    if (loading) return;

    try {
      setLoading(true);

      if (value) {
        const success = await NotificationService.enableNotifications();
        if (success) {
          setEnabled(true);
          Alert.alert('成功', '通知已启用');
        } else {
          Alert.alert(
            '权限被拒绝',
            '无法启用通知，请在系统设置中授予通知权限',
            [{ text: '确定' }]
          );
        }
      } else {
        await NotificationService.disableNotifications();
        setEnabled(false);
        Alert.alert('成功', '通知已禁用');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('错误', '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>
            任务提醒
          </Text>
          <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
            在设置的提醒时间收到通知
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          disabled={loading}
          trackColor={{ false: '#e0e0e0', true: theme.primary }}
          thumbColor={enabled ? '#ffffff' : '#f4f3f4'}
        />
      </View>

      {enabled && (
        <View style={[styles.infoBox, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            💡 提示：在添加或编辑任务时，可以设置提醒时间。系统会在指定时间发送通知。
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default NotificationSettings;
