/**
 * NotificationService - 通知服务（基础版）
 * 负责本地通知调度和权限管理
 */

import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native';
import PermissionService from './PermissionService';
import { AppError, ErrorType } from '../models/types';

const NOTIFICATION_ENABLED_KEY = '@detter_notification_enabled';
const CHANNEL_ID = 'task-reminders';
const CHANNEL_NAME = '任务提醒';

class NotificationService {
  private notificationEnabled: boolean = false;
  private channelCreated: boolean = false;

  /**
   * 初始化通知服务
   */
  async init(): Promise<void> {
    try {
      const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
      this.notificationEnabled = enabled === 'true';
      
      // 创建通知渠道（仅 Android）
      if (Platform.OS === 'android') {
        await this.createNotificationChannel();
      }
      
      console.log('Notification service initialized, enabled:', this.notificationEnabled);
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  /**
   * 创建通知渠道（Android）
   */
  private async createNotificationChannel(): Promise<void> {
    if (this.channelCreated) {
      return;
    }

    try {
      await notifee.createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
      this.channelCreated = true;
      console.log('Notification channel created');
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }

  /**
   * 请求通知权限
   */
  async requestPermission(): Promise<boolean> {
    try {
      return await PermissionService.requestNotificationPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw new AppError(
        ErrorType.PERMISSION_ERROR,
        '请求通知权限失败',
        error
      );
    }
  }

  /**
   * 检查通知权限
   */
  async checkPermission(): Promise<boolean> {
    try {
      return await PermissionService.checkNotificationPermission();
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  /**
   * 启用通知
   */
  async enableNotifications(): Promise<boolean> {
    try {
      const hasPermission = await this.checkPermission();
      
      if (!hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          return false;
        }
      }

      this.notificationEnabled = true;
      await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
      console.log('Notifications enabled');
      return true;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      throw new AppError(
        ErrorType.PERMISSION_ERROR,
        '启用通知失败',
        error
      );
    }
  }

  /**
   * 禁用通知
   */
  async disableNotifications(): Promise<void> {
    try {
      this.notificationEnabled = false;
      await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, 'false');
      // 取消所有已调度的通知
      await this.cancelAllNotifications();
      console.log('Notifications disabled');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      throw new AppError(
        ErrorType.UNKNOWN_ERROR,
        '禁用通知失败',
        error
      );
    }
  }

  /**
   * 获取通知启用状态
   */
  isEnabled(): boolean {
    return this.notificationEnabled;
  }

  /**
   * 调度任务提醒通知
   * @param taskId 任务 ID
   * @param title 任务标题
   * @param reminderTime 提醒时间
   */
  async scheduleTaskReminder(
    taskId: string,
    title: string,
    reminderTime: Date
  ): Promise<void> {
    if (!this.notificationEnabled) {
      console.log('Notifications are disabled, skipping schedule');
      return;
    }

    try {
      // 检查提醒时间是否在未来
      const now = new Date();
      if (reminderTime <= now) {
        console.log('Reminder time is in the past, skipping schedule');
        return;
      }

      // 确保通知渠道已创建
      if (Platform.OS === 'android' && !this.channelCreated) {
        await this.createNotificationChannel();
      }

      // 创建触发器
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: reminderTime.getTime(),
      };

      // 调度通知
      await notifee.createTriggerNotification(
        {
          id: taskId,
          title: '任务提醒',
          body: title,
          android: {
            channelId: CHANNEL_ID,
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            smallIcon: 'ic_notification',
            sound: 'default',
          },
          ios: {
            sound: 'default',
          },
        },
        trigger
      );

      console.log('Scheduled notification for task:', taskId, 'at', reminderTime);
    } catch (error) {
      console.error('Error scheduling task reminder:', error);
      throw new AppError(
        ErrorType.UNKNOWN_ERROR,
        '调度任务提醒失败',
        error
      );
    }
  }

  /**
   * 取消任务提醒通知
   * @param taskId 任务 ID
   */
  async cancelTaskReminder(taskId: string): Promise<void> {
    try {
      await notifee.cancelNotification(taskId);
      console.log('Cancelled notification for task:', taskId);
    } catch (error) {
      console.error('Error canceling task reminder:', error);
    }
  }

  /**
   * 取消所有通知
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * 获取所有已调度的通知
   */
  async getTriggerNotifications(): Promise<any[]> {
    try {
      const notifications = await notifee.getTriggerNotifications();
      return notifications;
    } catch (error) {
      console.error('Error getting trigger notifications:', error);
      return [];
    }
  }

  /**
   * 显示即时通知（用于测试）
   * @param title 通知标题
   * @param body 通知内容
   */
  async displayNotification(title: string, body: string): Promise<void> {
    if (!this.notificationEnabled) {
      console.log('Notifications are disabled, skipping display');
      return;
    }

    try {
      // 确保通知渠道已创建
      if (Platform.OS === 'android' && !this.channelCreated) {
        await this.createNotificationChannel();
      }

      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_notification',
        },
      });

      console.log('Displayed notification:', title);
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }
}

export default new NotificationService();
