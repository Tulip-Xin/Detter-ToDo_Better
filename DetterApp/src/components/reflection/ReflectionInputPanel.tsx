/**
 * ReflectionInputPanel - 复盘输入面板
 * 在任务完成后弹出，用于输入复盘笔记
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Task } from '../../models/types';
import { COLORS, SIZES, FONT_SIZES } from '../../utils/constants';

interface ReflectionInputPanelProps {
  task: Task;
  onSave: (taskId: string, content: string) => void;
  onSkip: () => void;
}

const ReflectionInputPanel: React.FC<ReflectionInputPanelProps> = ({
  task,
  onSave,
  onSkip,
}) => {
  const [content, setContent] = useState('');
  const inputRef = useRef<TextInput>(null);

  // 自动聚焦输入框
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (content.trim()) {
      onSave(task.id, content.trim());
    } else {
      onSkip();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>任务已完成</Text>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>

        {/* 输入框 */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="如何Do Better？"
            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
            multiline
            numberOfLines={6}
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        {/* 按钮组 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={onSkip}
            activeOpacity={0.7}>
            <Text style={styles.skipButtonText}>跳过</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            activeOpacity={0.7}>
            <Text style={styles.saveButtonText}>保存</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.PADDING_LARGE,
  },
  header: {
    marginBottom: SIZES.MARGIN_LARGE,
  },
  title: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  taskTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  inputContainer: {
    flex: 1,
    marginBottom: SIZES.MARGIN_LARGE,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.MARGIN,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  skipButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
});

export default ReflectionInputPanel;
