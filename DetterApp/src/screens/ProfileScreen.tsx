/**
 * 个人中心屏幕（我）
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  StatisticsCard,
  CompletionRateChart,
  TaskDistributionChart,
  ReflectionStatsCard,
  ThemeSettings,
  NotificationSettings,
  DataExport,
  DataImport,
  DataClear,
  AboutAndHelp,
} from '../components/profile';

type Period = 'day' | 'week' | 'month';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('day');

  const periods: { key: Period; label: string }[] = [
    { key: 'day', label: '每日' },
    { key: 'week', label: '每周' },
    { key: 'month', label: '每月' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 完成率统计 */}
        <StatisticsCard title="完成率统计">
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && {
                    backgroundColor: theme.primary,
                  },
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    {
                      color:
                        selectedPeriod === period.key
                          ? '#ffffff'
                          : theme.text,
                    },
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <CompletionRateChart period={selectedPeriod} />
        </StatisticsCard>

        {/* 任务分布统计 */}
        <StatisticsCard title="任务分布">
          <TaskDistributionChart />
        </StatisticsCard>

        {/* 复盘习惯统计 */}
        <StatisticsCard title="复盘习惯">
          <ReflectionStatsCard />
        </StatisticsCard>

        {/* 主题设置 */}
        <StatisticsCard title="主题设置">
          <ThemeSettings />
        </StatisticsCard>

        {/* 通知设置 */}
        <StatisticsCard title="通知设置">
          <NotificationSettings />
        </StatisticsCard>

        {/* 数据导出 */}
        <StatisticsCard title="数据导出">
          <DataExport />
        </StatisticsCard>

        {/* 数据导入 */}
        <StatisticsCard title="数据导入">
          <DataImport />
        </StatisticsCard>

        {/* 数据清空 */}
        <StatisticsCard title="数据管理">
          <DataClear />
        </StatisticsCard>

        {/* 关于和帮助 */}
        <StatisticsCard title="关于 Detter">
          <AboutAndHelp />
        </StatisticsCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileScreen;
