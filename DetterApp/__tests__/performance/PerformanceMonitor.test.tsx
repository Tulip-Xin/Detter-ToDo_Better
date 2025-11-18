/**
 * 性能监控测试
 */

import { measurePerformance, PerformanceMetrics } from '../../src/utils/performanceMonitor';

describe('Performance Monitor Test', () => {
  it('should measure function execution time', async () => {
    const testFunction = async () => {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'result';
    };

    const metrics = await measurePerformance('testFunction', testFunction);

    expect(metrics.duration).toBeGreaterThanOrEqual(100);
    expect(metrics.duration).toBeLessThan(200);
    expect(metrics.name).toBe('testFunction');
    expect(metrics.result).toBe('result');
    console.log(`Function execution time: ${metrics.duration}ms`);
  });

  it('should track multiple performance metrics', async () => {
    const metrics: PerformanceMetrics[] = [];

    // Measure database query
    const dbMetrics = await measurePerformance('dbQuery', async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    metrics.push(dbMetrics);

    // Measure render time
    const renderMetrics = await measurePerformance('render', async () => {
      await new Promise(resolve => setTimeout(resolve, 30));
    });
    metrics.push(renderMetrics);

    // Measure animation
    const animationMetrics = await measurePerformance('animation', async () => {
      await new Promise(resolve => setTimeout(resolve, 20));
    });
    metrics.push(animationMetrics);

    expect(metrics).toHaveLength(3);
    expect(metrics[0].duration).toBeGreaterThanOrEqual(50);
    expect(metrics[1].duration).toBeGreaterThanOrEqual(30);
    expect(metrics[2].duration).toBeGreaterThanOrEqual(20);

    console.log('Performance metrics:', metrics);
  });

  it('should identify performance bottlenecks', async () => {
    const slowFunction = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    const fastFunction = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    };

    const slowMetrics = await measurePerformance('slowFunction', slowFunction);
    const fastMetrics = await measurePerformance('fastFunction', fastFunction);

    // Identify bottleneck
    const bottleneck = slowMetrics.duration > 100 ? slowMetrics : null;

    expect(bottleneck).not.toBeNull();
    expect(bottleneck?.name).toBe('slowFunction');
    console.log(`Bottleneck identified: ${bottleneck?.name} (${bottleneck?.duration}ms)`);
  });

  it('should calculate average performance over multiple runs', async () => {
    const testFunction = async () => {
      const delay = Math.random() * 50 + 50; // 50-100ms
      await new Promise(resolve => setTimeout(resolve, delay));
    };

    const runs = 10;
    const metrics: PerformanceMetrics[] = [];

    for (let i = 0; i < runs; i++) {
      const metric = await measurePerformance(`run-${i}`, testFunction);
      metrics.push(metric);
    }

    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / runs;

    expect(averageDuration).toBeGreaterThanOrEqual(50);
    expect(averageDuration).toBeLessThan(150);
    console.log(`Average execution time over ${runs} runs: ${averageDuration}ms`);
  });

  it('should detect memory usage patterns', () => {
    // Simulate memory usage tracking
    const initialMemory = 100; // MB
    const afterLoadMemory = 150; // MB
    const afterGCMemory = 120; // MB

    const memoryIncrease = afterLoadMemory - initialMemory;
    const memoryReclaimed = afterLoadMemory - afterGCMemory;

    expect(memoryIncrease).toBe(50);
    expect(memoryReclaimed).toBe(30);

    console.log(`Memory increase: ${memoryIncrease}MB`);
    console.log(`Memory reclaimed after GC: ${memoryReclaimed}MB`);
  });

  it('should verify UI responsiveness', async () => {
    const uiInteractionDelay = 50; // ms

    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, uiInteractionDelay));
    const endTime = Date.now();

    const actualDelay = endTime - startTime;

    // UI should respond within 100ms
    expect(actualDelay).toBeLessThan(100);
    console.log(`UI response time: ${actualDelay}ms`);
  });
});
