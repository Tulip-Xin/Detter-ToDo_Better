/**
 * Performance Monitor - 性能监控工具
 * 用于监控应用性能指标，包括帧率、渲染时间等
 */

import { InteractionManager } from 'react-native';

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameTimestamps: number[] = [];
  private readonly MAX_SAMPLES = 60; // 保留最近60帧的数据

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 记录帧时间戳
   */
  recordFrame(): void {
    const now = Date.now();
    this.frameTimestamps.push(now);

    // 只保留最近的样本
    if (this.frameTimestamps.length > this.MAX_SAMPLES) {
      this.frameTimestamps.shift();
    }
  }

  /**
   * 计算当前帧率
   * @returns 当前帧率（FPS）
   */
  getCurrentFPS(): number {
    if (this.frameTimestamps.length < 2) {
      return 0;
    }

    const firstTimestamp = this.frameTimestamps[0];
    const lastTimestamp = this.frameTimestamps[this.frameTimestamps.length - 1];
    const duration = lastTimestamp - firstTimestamp;

    if (duration === 0) {
      return 0;
    }

    const fps = ((this.frameTimestamps.length - 1) / duration) * 1000;
    return Math.round(fps);
  }

  /**
   * 测量操作执行时间
   * @param operation 要测量的操作
   * @param label 操作标签
   */
  async measureOperation<T>(
    operation: () => Promise<T>,
    label: string
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      console.log(`[Performance] ${label}: ${duration}ms`);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[Performance] ${label} failed after ${duration}ms:`, error);
      throw error;
    }
  }

  /**
   * 等待交互完成后执行操作
   * 用于延迟非关键操作，避免阻塞UI
   */
  runAfterInteractions(callback: () => void): void {
    InteractionManager.runAfterInteractions(() => {
      callback();
    });
  }

  /**
   * 重置监控数据
   */
  reset(): void {
    this.frameTimestamps = [];
  }

  /**
   * 获取性能报告
   */
  getReport(): {
    currentFPS: number;
    sampleCount: number;
  } {
    return {
      currentFPS: this.getCurrentFPS(),
      sampleCount: this.frameTimestamps.length,
    };
  }
}

export default PerformanceMonitor.getInstance();
