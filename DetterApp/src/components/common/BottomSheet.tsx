/**
 * BottomSheet 组件
 * 底部弹出面板，用于添加和编辑任务
 */
import React, {
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { BOTTOM_SHEET_SNAP_POINTS, COLORS } from '../../utils/constants';

interface BottomSheetProps {
  children: React.ReactNode;
  onClose?: () => void;
  enablePanDownToClose?: boolean;
  snapPointIndex?: number;
}

export interface BottomSheetRef {
  expand: () => void;
  collapse: () => void;
  close: () => void;
  snapToIndex: (index: number) => void;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      onClose,
      enablePanDownToClose = true,
      snapPointIndex = 0,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<GorhomBottomSheet>(null);
    const snapPoints = useMemo(() => BOTTOM_SHEET_SNAP_POINTS, []);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      collapse: () => {
        bottomSheetRef.current?.collapse();
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
      snapToIndex: (index: number) => {
        bottomSheetRef.current?.snapToIndex(index);
      },
    }));

    // 渲染背景遮罩
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    // 处理关闭事件
    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1 && onClose) {
          onClose();
        }
      },
      [onClose],
    );

    return (
      <GorhomBottomSheet
        ref={bottomSheetRef}
        index={snapPointIndex}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.contentContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          {children}
        </KeyboardAvoidingView>
      </GorhomBottomSheet>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: COLORS.TEXT_PLACEHOLDER,
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
  },
});
