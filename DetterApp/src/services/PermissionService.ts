import { Platform, PermissionsAndroid, Alert } from 'react-native';

export interface PermissionStatus {
  storage: boolean;
  notification: boolean;
}

class PermissionService {
  /**
   * Request all necessary permissions for the app
   */
  async requestAllPermissions(): Promise<PermissionStatus> {
    if (Platform.OS !== 'android') {
      return { storage: true, notification: true };
    }

    const storage = await this.requestStoragePermission();
    const notification = await this.requestNotificationPermission();

    return { storage, notification };
  }

  /**
   * Request storage permission for data import/export
   */
  async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const apiLevel = Platform.Version as number;

      // Android 13+ uses granular media permissions
      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: '存储权限',
            message: 'Detter需要访问存储以导入和导出数据',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // Android 6-12 uses READ/WRITE_EXTERNAL_STORAGE
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '存储权限',
          message: 'Detter需要访问存储以导入和导出数据',
          buttonNeutral: '稍后询问',
          buttonNegative: '拒绝',
          buttonPositive: '允许',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  }

  /**
   * Request notification permission for task reminders
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const apiLevel = Platform.Version as number;

      // Android 13+ requires POST_NOTIFICATIONS permission
      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: '通知权限',
            message: 'Detter需要发送通知以提醒您的待办事项',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // Android 12 and below don't require runtime permission for notifications
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Check if storage permission is granted
   */
  async checkStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const apiLevel = Platform.Version as number;

      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return granted;
      }

      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted;
    } catch (error) {
      console.error('Error checking storage permission:', error);
      return false;
    }
  }

  /**
   * Check if notification permission is granted
   */
  async checkNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const apiLevel = Platform.Version as number;

      if (apiLevel >= 33) {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted;
      }

      return true;
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  /**
   * Show alert when permission is denied
   */
  showPermissionDeniedAlert(permissionType: 'storage' | 'notification'): void {
    const messages = {
      storage: {
        title: '存储权限被拒绝',
        message: '无法导入或导出数据。请在设置中授予存储权限。',
      },
      notification: {
        title: '通知权限被拒绝',
        message: '无法发送任务提醒。请在设置中授予通知权限。',
      },
    };

    const { title, message } = messages[permissionType];

    Alert.alert(title, message, [
      { text: '取消', style: 'cancel' },
      { text: '去设置', onPress: () => this.openAppSettings() },
    ]);
  }

  /**
   * Open app settings (placeholder - requires additional library)
   */
  private openAppSettings(): void {
    // This would require react-native-permissions or similar library
    // For now, just log
    console.log('Open app settings');
    Alert.alert('提示', '请在系统设置中找到Detter应用并授予权限');
  }
}

export default new PermissionService();
