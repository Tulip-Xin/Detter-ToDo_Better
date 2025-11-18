/**
 * TaskEditPanel 组件
 * 任务编辑面板UI，复用TaskAddPanel的逻辑，预填充现有任务数据
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Task, Priority, SubTask } from '../../models/types';
import { COLORS } from '../../utils/constants';
import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar } from '../common/Calendar';
import SubTaskList from './SubTaskList';
import TagInput from '../common/TagInput';
import TimePicker from '../common/TimePicker';

interface TaskEditPanelProps {
  task: Task;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDelete: () => void;
  onCancel: () => void;
}

type DateMode = 'quick' | 'calendar';

const TaskEditPanel: React.FC<TaskEditPanelProps> = ({
  task,
  onSave,
  onDelete,
  onCancel,
}) => {
  // 使用现有任务数据初始化状态
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [selectedDate, setSelectedDate] = useState<Date>(task.dueDate);
  const [dateMode, setDateMode] = useState<DateMode>('quick');
  const [reminderTime, setReminderTime] = useState<Date | undefined>(task.reminderTime);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks);
  const [tags, setTags] = useState<string[]>(task.tags);

  const titleInputRef = useRef<TextInput>(null);

  // 自动聚焦标题输入框
  useEffect(() => {
    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 处理保存
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入任务标题');
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      tags,
      subtasks,
      dueDate: selectedDate,
      reminderTime,
      completed: task.completed,
      completedAt: task.completedAt,
      order: task.order,
      archived: task.archived,
    };

    try {
      await onSave(taskData);
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('错误', '保存任务失败，请重试');
    }
  };

  // 快捷日期选择
  const getQuickDate = (type: 'today' | 'tomorrow' | 'custom') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (type) {
      case 'today':
        return today;
      case 'tomorrow':
        return addDays(today, 1);
      default:
        return today;
    }
  };

  const isDateSelected = (type: 'today' | 'tomorrow') => {
    const compareDate = getQuickDate(type);
    return (
      selectedDate.getFullYear() === compareDate.getFullYear() &&
      selectedDate.getMonth() === compareDate.getMonth() &&
      selectedDate.getDate() === compareDate.getDate()
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑任务</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!title.trim()}
          style={[
            styles.saveButton,
            !title.trim() && styles.saveButtonDisabled,
          ]}>
          <Text
            style={[
              styles.saveButtonText,
              !title.trim() && styles.saveButtonTextDisabled,
            ]}>
            保存
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 日期选择 */}
        <View style={styles.section}>
          <View style={styles.quickDateButtons}>
            <TouchableOpacity
              style={[
                styles.quickDateButton,
                isDateSelected('today') && styles.quickDateButtonActive,
              ]}
              onPress={() => {
                setSelectedDate(getQuickDate('today'));
                setDateMode('quick');
              }}>
              <Text
                style={[
                  styles.quickDateButtonText,
                  isDateSelected('today') && styles.quickDateButtonTextActive,
                ]}>
                今
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickDateButton,
                isDateSelected('tomorrow') && styles.quickDateButtonActive,
              ]}
              onPress={() => {
                setSelectedDate(getQuickDate('tomorrow'));
                setDateMode('quick');
              }}>
              <Text
                style={[
                  styles.quickDateButtonText,
                  isDateSelected('tomorrow') && styles.quickDateButtonTextActive,
                ]}>
                明
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickDateButton,
                dateMode === 'calendar' && styles.quickDateButtonActive,
              ]}
              onPress={() => setDateMode('calendar')}>
              <Text
                style={[
                  styles.quickDateButtonText,
                  dateMode === 'calendar' && styles.quickDateButtonTextActive,
                ]}>
                日
              </Text>
            </TouchableOpacity>
          </View>

          {/* 日历视图 */}
          {dateMode === 'calendar' && (
            <View style={styles.calendarContainer}>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </View>
          )}

          {/* 显示选中的日期 */}
          <Text style={styles.selectedDateText}>
            {format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
          </Text>
        </View>

        {/* 任务标题 */}
        <View style={styles.section}>
          <TextInput
            ref={titleInputRef}
            style={styles.titleInput}
            placeholder="准备做什么？"
            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
            value={title}
            onChangeText={setTitle}
            multiline
            maxLength={100}
          />
        </View>

        {/* 任务描述 */}
        <View style={styles.section}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="描述"
            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />
        </View>

        {/* 优先级选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>优先级</Text>
          <View style={styles.priorityButtons}>
            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.priorityButtonImportant,
                priority === 'important' && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority('important')}>
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'important' && styles.priorityButtonTextActive,
                ]}>
                重要
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.priorityButtonUrgent,
                priority === 'urgent' && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority('urgent')}>
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'urgent' && styles.priorityButtonTextActive,
                ]}>
                紧急
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                styles.priorityButtonTrivial,
                priority === 'trivial' && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority('trivial')}>
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === 'trivial' && styles.priorityButtonTextActive,
                ]}>
                琐事
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 子任务 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>子任务</Text>
          <SubTaskList subtasks={subtasks} onChange={setSubtasks} />
        </View>

        {/* 标签 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>标签</Text>
          <TagInput tags={tags} onChange={setTags} />
        </View>

        {/* 底部工具栏 */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setShowTimePicker(true)}>
            <Text style={styles.toolbarIcon}>⏰</Text>
            <Text style={styles.toolbarLabel}>
              {reminderTime
                ? `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`
                : '提醒'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 删除按钮 */}
        <View style={styles.deleteSection}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}>
            <Text style={styles.deleteButtonText}>删除任务</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 时间选择器 */}
      <TimePicker
        visible={showTimePicker}
        selectedTime={reminderTime}
        onConfirm={(time) => {
          setReminderTime(time);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  cancelButton: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.BORDER,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  saveButtonTextDisabled: {
    color: COLORS.TEXT_PLACEHOLDER,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickDateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickDateButtonActive: {
    backgroundColor: COLORS.DATE_SELECTOR_BG,
    borderColor: COLORS.PRIMARY,
  },
  quickDateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  quickDateButtonTextActive: {
    color: COLORS.PRIMARY,
  },
  calendarContainer: {
    marginTop: 16,
  },
  selectedDateText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  descriptionInput: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  priorityButtonImportant: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderColor: COLORS.PRIORITY_IMPORTANT,
  },
  priorityButtonUrgent: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderColor: COLORS.PRIORITY_URGENT,
  },
  priorityButtonTrivial: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderColor: COLORS.PRIORITY_TRIVIAL,
  },
  priorityButtonActive: {
    opacity: 1,
  },
  priorityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  priorityButtonTextActive: {
    color: COLORS.TEXT_PRIMARY,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  toolbarIcon: {
    fontSize: 20,
  },
  toolbarLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  deleteSection: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: COLORS.ERROR,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default TaskEditPanel;
