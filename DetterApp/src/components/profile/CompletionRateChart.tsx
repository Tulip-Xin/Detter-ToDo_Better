/**
 * CompletionRateChart - 完成率图表组件
 * 使用 react-native-chart-kit 显示完成率折线图
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../contexts/ThemeContext';
import StatisticsService, { CompletionRateData } from '../../services/StatisticsService';

type Period = 'day' | 'week' | 'month';

interface CompletionRateChartProps {
  period: Period;
}

const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ period }) => {
  const { theme } = useTheme();
  const [data, setData] = useState<CompletionRateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setLoading(true);
      let result: CompletionRateData[];
      
      switch (period) {
        case 'day':
          result = await StatisticsService.getDailyCompletionRate(7);
          break;
        case 'week':
          result = await StatisticsService.getWeeklyCompletionRate(4);
          break;
        case 'month':
          result = await StatisticsService.getMonthlyCompletionRate(6);
          break;
        default:
          result = [];
      }
      
      setData(result);
    } catch (error) {
      console.error('Error loading completion rate data:', error);
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

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          暂无数据
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        data: data.map(d => d.rate * 100),
        color: (opacity = 1) => theme.primary,
        strokeWidth: 2,
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width - 64;

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: theme.cardBackground,
          backgroundGradientFrom: theme.cardBackground,
          backgroundGradientTo: theme.cardBackground,
          decimalPlaces: 0,
          color: (opacity = 1) => theme.primary,
          labelColor: (opacity = 1) => theme.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.primary,
          },
        }}
        bezier
        style={styles.chart}
        formatYLabel={(value) => `${value}%`}
      />
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: theme.textSecondary }]}>
          完成率趋势
        </Text>
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    marginTop: 8,
  },
  legendText: {
    fontSize: 12,
  },
});

export default CompletionRateChart;
