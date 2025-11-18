/**
 * TimePicker 组件
 * 24小时制时间选择器
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../utils/constants';

interface TimePickerProps {
  visible: boolean;
  selectedTime?: Date;
  onConfirm: (time: Date) => void;
  onCancel: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  selectedTime,
  onConfirm,
  onCancel,
}) => {
  const initialHour = selectedTime ? selectedTime.getHours() : 9;
  const initialMinute = selectedTime ? selectedTime.getMinutes() : 0;

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);

  // 生成小时数组 (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // 生成分钟数组 (0, 5, 10, ..., 55)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const time = new Date();
    time.setHours(selectedHour);
    time.setMinutes(selectedMinute);
    time.setSeconds(0);
    time.setMilliseconds(0);
    onConfirm(time);
  };

  const renderHourItem = (hour: number) => {
    const isSelected = hour === selectedHour;
    return (
      <TouchableOpacity
        key={hour}
        style={[styles.timeItem, isSelected && styles.timeItemSelected]}
        onPress={() => setSelectedHour(hour)}>
        <Text
          style={[
            styles.timeItemText,
            isSelected && styles.timeItemTextSelected,
          ]}>
          {hour.toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMinuteItem = (minute: number) => {
    const isSelected = minute === selectedMinute;
    return (
      <TouchableOpacity
        key={minute}
        style={[styles.timeItem, isSelected && styles.timeItemSelected]}
        onPress={() => setSelectedMinute(minute)}>
        <Text
          style={[
            styles.timeItemText,
            isSelected && styles.timeItemTextSelected,
          ]}>
          {minute.toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>选择时间</Text>
          </View>

          {/* 时间选择器 */}
          <View style={styles.pickerContainer}>
            {/* 小时 */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>时</Text>
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}>
                {hours.map(renderHourItem)}
              </ScrollView>
            </View>

            {/* 分隔符 */}
            <Text style={styles.separator}>:</Text>

            {/* 分钟 */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>分</Text>
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}>
                {minutes.map(renderMinuteItem)}
              </ScrollView>
            </View>
          </View>

          {/* 当前选择显示 */}
          <View style={styles.currentTimeContainer}>
            <Text style={styles.currentTimeLabel}>选择的时间：</Text>
            <Text style={styles.currentTime}>
              {selectedHour.toString().padStart(2, '0')}:
              {selectedMinute.toString().padStart(2, '0')}
            </Text>
          </View>

          {/* 按钮 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    marginBottom: 16,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  timeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  timeItemSelected: {
    backgroundColor: COLORS.PRIMARY,
  },
  timeItemText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
  },
  timeItemTextSelected: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginHorizontal: 8,
  },
  currentTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 8,
  },
  currentTimeLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginRight: 8,
  },
  currentTime: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default TimePicker;
