/**
 * StatisticsCard - 统计卡片组件
 * 显示统计数据的卡片容器
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface StatisticsCardProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, children, style }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }, style]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  content: {
    marginTop: 8,
  },
});

export default StatisticsCard;
