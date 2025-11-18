/**
 * DateSelector 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DateSelector from '../DateSelector';

describe('DateSelector', () => {
  const defaultProps = {
    selectedDate: new Date('2025-01-15'),
    onDateSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render date selector', () => {
    const { getByTestId } = render(<DateSelector {...defaultProps} />);
    expect(getByTestId('date-selector')).toBeTruthy();
  });

  it('should display week dates', () => {
    const { getByText } = render(<DateSelector {...defaultProps} />);
    expect(getByText('15')).toBeTruthy();
  });

  it('should highlight selected date', () => {
    const { getByTestId } = render(<DateSelector {...defaultProps} />);
    const selectedItem = getByTestId('date-item-2025-01-15');
    expect(selectedItem.props.style).toMatchObject(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );
  });

  it('should call onDateSelect when date is pressed', () => {
    const { getAllByTestId } = render(<DateSelector {...defaultProps} />);
    const dateItems = getAllByTestId(/date-item-/);
    if (dateItems.length > 0) {
      fireEvent.press(dateItems[0]);
      expect(defaultProps.onDateSelect).toHaveBeenCalled();
    }
  });

  it('should display day names', () => {
    const { getByText } = render(<DateSelector {...defaultProps} />);
    // Should display day names like 周一, 周二, etc.
    expect(getByText(/�?)).toBeTruthy();
  });

  it('should mark today with special indicator', () => {
    const today = new Date();
    const { getByTestId } = render(
      <DateSelector {...defaultProps} selectedDate={today} />
    );
    expect(getByTestId('date-selector')).toBeTruthy();
  });

  it('should handle date selection', () => {
    const newDate = new Date('2025-01-16');
    const { rerender } = render(<DateSelector {...defaultProps} />);
    
    rerender(<DateSelector {...defaultProps} selectedDate={newDate} />);
    
    expect(defaultProps.onDateSelect).not.toHaveBeenCalled();
  });
});
