import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppError } from '../../utils/errors';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

interface ErrorMessageProps {
  error: AppError | string | null;
  onRetry?: () => void;
  style?: any;
}

/**
 * 错误消息组件
 * 用于在UI中显示友好的错误提示
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry, style }) => {
  if (!error) {
    return null;
  }

  const errorMessage = typeof error === 'string' 
    ? error 
    : error.getUserMessage();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.message}>{errorMessage}</Text>
      </View>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryText}>重试</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    borderRadius: 8,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  message: {
    flex: 1,
    fontSize: FONT_SIZES.SMALL,
    color: '#856404',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: '#FFC107',
    borderRadius: 4,
  },
  retryText: {
    fontSize: FONT_SIZES.SMALL,
    color: '#856404',
    fontWeight: '600',
  },
});

export default ErrorMessage;
