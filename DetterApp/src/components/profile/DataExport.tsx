/**
 * DataExport - 数据导出组件
 * 允许用户导出数据为 JSON 或 CSV 格式
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import DataExportService from '../../services/DataExportService';

const DataExport: React.FC = () => {
  const { theme } = useTheme();
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    if (exporting) return;

    try {
      setExporting(true);

      const filePath = await DataExportService.exportToJSON();

      Alert.alert(
        '导出成功',
        '数据已导出为 JSON 格式，是否分享文件？',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '分享',
            onPress: async () => {
              try {
                await DataExportService.shareFile(filePath);
              } catch (error) {
                Alert.alert('错误', '分享文件失败');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error exporting JSON:', error);
      Alert.alert('错误', '导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (exporting) return;

    try {
      setExporting(true);

      const filePath = await DataExportService.exportToCSV();

      Alert.alert(
        '导出成功',
        '任务数据已导出为 CSV 格式，是否分享文件？',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '分享',
            onPress: async () => {
              try {
                await DataExportService.shareFile(filePath);
              } catch (error) {
                Alert.alert('错误', '分享文件失败');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('错误', '导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          导出数据可用于备份或迁移到其他设备。JSON 格式包含完整数据，CSV 格式仅包含任务列表。
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.exportButton,
          {
            backgroundColor: theme.primary,
            opacity: exporting ? 0.6 : 1,
          },
        ]}
        onPress={handleExportJSON}
        disabled={exporting}
      >
        {exporting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Text style={styles.exportButtonText}>导出为 JSON</Text>
            <Text style={styles.exportButtonSubtext}>完整备份（推荐）</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.exportButton,
          {
            backgroundColor: theme.secondary,
            opacity: exporting ? 0.6 : 1,
          },
        ]}
        onPress={handleExportCSV}
        disabled={exporting}
      >
        {exporting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Text style={styles.exportButtonText}>导出为 CSV</Text>
            <Text style={styles.exportButtonSubtext}>任务列表（Excel 兼容）</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  exportButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exportButtonSubtext: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
  },
});

export default DataExport;
