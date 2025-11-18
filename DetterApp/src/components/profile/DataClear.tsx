/**
 * DataClear - 数据清空组件
 * 允许用户清空所有数据
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import DatabaseService from '../../services/DatabaseService';

const DataClear: React.FC = () => {
  const { theme } = useTheme();
  const [clearing, setClearing] = useState(false);

  const handleClearData = () => {
    if (clearing) return;

    Alert.alert(
      '确认清空数据',
      '此操作将删除所有任务和复盘笔记，且不可恢复。建议先导出数据作为备份。\n\n确定要继续吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确认清空',
          style: 'destructive',
          onPress: () => {
            // 二次确认
            Alert.alert(
              '最后确认',
              '请再次确认：所有数据将被永久删除！',
              [
                {
                  text: '取消',
                  style: 'cancel',
                },
                {
                  text: '确定删除',
                  style: 'destructive',
                  onPress: performClear,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const performClear = async () => {
    try {
      setClearing(true);

      await DatabaseService.clearAllData();

      Alert.alert(
        '清空成功',
        '所有数据已被清空',
        [
          {
            text: '确定',
            onPress: () => {
              // 可以在这里触发应用重新加载或导航到初始页面
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('错误', '清空数据失败，请重试');
    } finally {
      setClearing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.warningBox, { backgroundColor: '#ffebee' }]}>
        <Text style={[styles.warningTitle, { color: '#c62828' }]}>
          ⚠️ 危险操作
        </Text>
        <Text style={[styles.warningText, { color: '#c62828' }]}>
          清空数据将永久删除所有任务和复盘笔记，此操作不可撤销。
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          在清空数据前，强烈建议先使用"数据导出"功能备份您的数据。
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.clearButton,
          {
            backgroundColor: '#f44336',
            opacity: clearing ? 0.6 : 1,
          },
        ]}
        onPress={handleClearData}
        disabled={clearing}
      >
        {clearing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.clearButtonText}>清空所有数据</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  warningBox: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  clearButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DataClear;
