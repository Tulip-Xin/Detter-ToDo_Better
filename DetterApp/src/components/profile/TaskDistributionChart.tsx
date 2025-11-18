/**
 * TaskDistributionChart - 任务分布图表组件
 * 使用 react-native-chart-kit 显示任务分布饼图
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../contexts/ThemeContext';
import StatisticsService, { TaskDistribution } from '../../services/StatisticsService';
import { COLORS } from '../../utils/constants';

const TaskDistributionChart: React.FC = () => {
  const { theme } = useTheme();
  const [distribution, setDistribution] = useState<TaskDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await StatisticsService.getTaskDistribution();
      setDistribution(result);
    } catch (error) {
      console.error('Error loading task distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!distribution) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          暂无数据
        </Text>
      </View>
    );
  }

  const total = distribution.important + distribution.urgent + distribution.trivial;

  if (total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          暂无任务数据
        </Text>
      </View>
    );
  }

  const chartData = [
    {
      name: '重要',
      count: distribution.important,
      color: COLORS.PRIORITY_IMPORTANT,
      legendFontColor: theme.text,
      legendFontSize: 14,
    },
    {
      name: '紧急',
      count: distribution.urgent,
      color: COLORS.PRIORITY_URGENT,
      legendFontColor: theme.text,
      legendFontSize: 14,
    },
    {
      name: '琐事',
      count: distribution.trivial,
      color: COLORS.PRIORITY_TRIVIAL,
      legendFontColor: theme.text,
      legendFontSize: 14,
    },
  ];

  const screenWidth = Dimensions.get('window').width - 64;

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: (opacity = 1) => theme.primary,
          labelColor: (opacity = 1) => theme.text,
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            总任务数：
          </Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            {total}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  summary: {
    marginTop: 16,
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskDistributionChart;
