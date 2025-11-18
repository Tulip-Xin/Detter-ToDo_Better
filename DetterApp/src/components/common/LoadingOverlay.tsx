import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * 加载遮罩组件
 * 在内容上方显示加载状态，不阻止用户查看内容
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message,
  children,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {children}
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
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
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
