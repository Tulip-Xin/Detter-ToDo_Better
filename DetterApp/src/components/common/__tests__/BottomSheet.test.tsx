/**
 * BottomSheet 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BottomSheet from '../BottomSheet';
import { Text } from 'react-native';

describe('BottomSheet', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    snapPoints: ['50%', '90%'],
    children: <Text>Test Content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible', () => {
    const { getByText } = render(<BottomSheet {...defaultProps} />);
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(
      <BottomSheet {...defaultProps} visible={false} />
    );
    expect(queryByText('Test Content')).toBeNull();
  });

  it('should call onClose when backdrop is pressed', () => {
    const { getByTestId } = render(<BottomSheet {...defaultProps} />);
    const backdrop = getByTestId('bottom-sheet-backdrop');
    fireEvent.press(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should render children content', () => {
    const { getByText } = render(<BottomSheet {...defaultProps} />);
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should handle custom snap points', () => {
    const customSnapPoints = ['30%', '70%'];
    const { getByTestId } = render(
      <BottomSheet {...defaultProps} snapPoints={customSnapPoints} />
    );
    expect(getByTestId('bottom-sheet-container')).toBeTruthy();
  });

  it('should render with title when provided', () => {
    const { getByText } = render(
      <BottomSheet {...defaultProps} title="测试标题" />
    );
    expect(getByText('测试标题')).toBeTruthy();
  });
});
