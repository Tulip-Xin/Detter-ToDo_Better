import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

interface LoadingProps {
  visible?: boolean;
  message?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

/**
 * 加载指示器组件
 * 支持内联显示和全屏遮罩两种模式
 */
const Loading: React.FC<LoadingProps> = ({
  visible = true,
  message,
  overlay = false,
  size = 'large',
  color = COLORS.PRIMARY,
  style,
}) => {
  if (!visible) {
    return null;
  }

  const content = (
    <View style={[styles.container, !overlay && styles.inline, style]}>
      <View style={[styles.content, overlay && styles.overlayContent]}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        statusBarTranslucent
      >
        {content}
      </Modal>
    );
  }

  return content;
};

/**
 * 全屏加载组件
 */
export const FullScreenLoading: React.FC<{ message?: string }> = ({ message }) => (
  <Loading visible overlay message={message} />
);

/**
 * 内联加载组件
 */
export const InlineLoading: React.FC<{
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}> = ({ message, size = 'small', style }) => (
  <Loading visible={false} overlay={false} message={message} size={size} style={style} />
);

/**
 * 列表加载组件（用于FlatList底部）
 */
export const ListFooterLoading: React.FC = () => (
  <View style={styles.listFooter}>
    <ActivityIndicator size="small" color={COLORS.PRIMARY} />
  </View>
);

/**
 * 刷新加载组件（用于下拉刷新）
 */
export const RefreshLoading: React.FC<{ refreshing: boolean }> = ({ refreshing }) => {
  if (!refreshing) return null;
  
  return (
    <View style={styles.refreshContainer}>
      <ActivityIndicator size="small" color={COLORS.PRIMARY} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inline: {
    padding: SPACING.xl,
  },
  content: {
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: SPACING.xl,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  listFooter: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  refreshContainer: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
});

export default Loading;
