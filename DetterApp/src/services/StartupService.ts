/**
 * StartupService - 应用启动优化服务
 * 负责数据预加载和启动流程优化
 */

import DatabaseService from './DatabaseService';
import NotificationService from './NotificationService';
import TaskService from './TaskService';
import PermissionService from './PermissionService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class StartupService {
  private static instance: StartupService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): StartupService {
    if (!StartupService.instance) {
      StartupService.instance = new StartupService();
    }
    return StartupService.instance;
  }

  /**
   * 初始化应用
   * 按优先级顺序执行初始化任务
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    const startTime = Date.now();
    console.log('[StartupService] Starting app initialization...');

    try {
      // 阶段1: 关键服务初始化（必须完成）
      await this.initializeCriticalServices();

      // 阶段2: 数据预加载（并行执行）
      await this.preloadData();

      // 阶段3: 非关键服务初始化（后台执行）
      this.initializeNonCriticalServices();

      this.isInitialized = true;
      const duration = Date.now() - startTime;
      console.log(`[StartupService] Initialization completed in ${duration}ms`);
    } catch (error) {
      console.error('[StartupService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * 初始化关键服务
   * 这些服务必须在应用启动前完成
   */
  private async initializeCriticalServices(): Promise<void> {
    console.log('[StartupService] Initializing critical services...');
    
    // 初始化数据库（最高优先级）
    await DatabaseService.init();
    console.log('[StartupService] Database initialized');
  }

  /**
   * 预加载数据
   * 并行加载今天的任务和用户设置
   */
  private async preloadData(): Promise<void> {
    console.log('[StartupService] Preloading data...');

    try {
      // 并行执行多个预加载任务
      await Promise.all([
        this.preloadTodayTasks(),
        this.preloadUserSettings(),
      ]);
      console.log('[StartupService] Data preloaded successfully');
    } catch (error) {
      console.warn('[StartupService] Data preload failed:', error);
      // 预加载失败不应阻止应用启动
    }
  }

  /**
   * 预加载今天的任务
   */
  private async preloadTodayTasks(): Promise<void> {
    try {
      const today = new Date();
      const tasks = await TaskService.getTasksByDate(today);
      console.log(`[StartupService] Preloaded ${tasks.length} tasks for today`);
    } catch (error) {
      console.warn('[StartupService] Failed to preload today tasks:', error);
    }
  }

  /**
   * 预加载用户设置
   */
  private async preloadUserSettings(): Promise<void> {
    try {
      const settings = await AsyncStorage.multiGet([
        'theme_mode',
        'notification_enabled',
      ]);
      console.log('[StartupService] User settings preloaded');
    } catch (error) {
      console.warn('[StartupService] Failed to preload user settings:', error);
    }
  }

  /**
   * 初始化非关键服务
   * 这些服务可以在后台异步初始化
   */
  private initializeNonCriticalServices(): void {
    console.log('[StartupService] Initializing non-critical services...');

    // 异步请求权限（不阻塞启动）
    PermissionService.requestAllPermissions()
      .then((permissions) => {
        console.log('[StartupService] Permissions requested:', permissions);
        if (!permissions.storage) {
          console.warn('[StartupService] Storage permission denied');
        }
        if (!permissions.notification) {
          console.warn('[StartupService] Notification permission denied');
        }
      })
      .catch((error) => {
        console.warn('[StartupService] Permission request failed:', error);
      });

    // 异步初始化通知服务（不阻塞启动）
    NotificationService.init()
      .then(() => {
        console.log('[StartupService] Notification service initialized');
      })
      .catch((error) => {
        console.warn('[StartupService] Notification service initialization failed:', error);
      });
  }

  /**
   * 重置初始化状态（用于测试）
   */
  reset(): void {
    this.isInitialized = false;
  }
}

export default StartupService.getInstance();
