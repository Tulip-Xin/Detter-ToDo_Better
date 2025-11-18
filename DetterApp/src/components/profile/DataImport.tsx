/**
 * DataImport - 数据导入组件
 * 允许用户从 JSON 文件导入数据
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import DataImportService from '../../services/DataImportService';
import RNFS from 'react-native-fs';

const DataImport: React.FC = () => {
  const { theme } = useTheme();
  const [importing, setImporting] = useState(false);
  const [filePath, setFilePath] = useState('');

  const handleImport = async () => {
    if (importing) return;

    if (!filePath.trim()) {
      Alert.alert('提示', '请输入文件路径');
      return;
    }

    // 确认导入
    Alert.alert(
      '确认导入',
      '导入数据将与现有数据合并，相同 ID 的数据将被覆盖。是否继续？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '导入',
          onPress: async () => {
            await performImport();
          },
        },
      ]
    );
  };

  const performImport = async () => {
    try {
      setImporting(true);

      // 检查文件是否存在
      const exists = await RNFS.exists(filePath);
      if (!exists) {
        Alert.alert('错误', '文件不存在，请检查路径是否正确');
        return;
      }

      // 执行导入
      const result = await DataImportService.importFromJSON(filePath);

      if (result.success) {
        const message = `成功导入 ${result.tasksImported} 个任务和 ${result.reflectionsImported} 个复盘笔记`;
        
        if (result.errors.length > 0) {
          Alert.alert(
            '导入完成（部分失败）',
            `${message}\n\n部分数据导入失败：\n${result.errors.slice(0, 3).join('\n')}${
              result.errors.length > 3 ? `\n...还有 ${result.errors.length - 3} 个错误` : ''
            }`
          );
        } else {
          Alert.alert('导入成功', message);
        }

        setFilePath('');
      } else {
        Alert.alert(
          '导入失败',
          `数据格式错误：\n${result.errors.join('\n')}`
        );
      }
    } catch (error) {
      console.error('Error importing data:', error);
      Alert.alert('错误', '导入失败，请检查文件格式是否正确');
    } finally {
      setImporting(false);
    }
  };

  const handleBrowseFiles = async () => {
    // 显示文档目录中的导出文件
    try {
      const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      const exportFiles = files
        .filter((file) => file.name.startsWith('detter_backup_'))
        .map((file) => file.name);

      if (exportFiles.length === 0) {
        Alert.alert('提示', '未找到导出文件');
        return;
      }

      Alert.alert(
        '选择文件',
        '找到以下导出文件：',
        [
          ...exportFiles.map((fileName) => ({
            text: fileName,
            onPress: () => {
              setFilePath(`${RNFS.DocumentDirectoryPath}/${fileName}`);
            },
          })),
          {
            text: '取消',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error browsing files:', error);
      Alert.alert('错误', '浏览文件失败');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          从 JSON 备份文件导入数据。导入的数据将与现有数据合并，相同 ID 的数据将被覆盖。
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>文件路径</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.cardBackground,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={filePath}
          onChangeText={setFilePath}
          placeholder="输入文件完整路径"
          placeholderTextColor={theme.textSecondary}
          editable={!importing}
        />
        <TouchableOpacity
          style={[
            styles.browseButton,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={handleBrowseFiles}
          disabled={importing}
        >
          <Text style={[styles.browseButtonText, { color: theme.primary }]}>
            浏览文件
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.importButton,
          {
            backgroundColor: theme.primary,
            opacity: importing || !filePath.trim() ? 0.6 : 1,
          },
        ]}
        onPress={handleImport}
        disabled={importing || !filePath.trim()}
      >
        {importing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.importButtonText}>导入数据</Text>
        )}
      </TouchableOpacity>

      <View style={[styles.warningBox, { backgroundColor: '#fff3cd' }]}>
        <Text style={[styles.warningText, { color: '#856404' }]}>
          ⚠️ 警告：导入操作不可撤销，建议先导出当前数据作为备份。
        </Text>
      </View>
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
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  browseButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  importButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  importButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  warningText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default DataImport;
