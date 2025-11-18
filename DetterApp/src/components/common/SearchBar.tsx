/**
 * 搜索输入框组件
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/constants';

interface SearchBarProps {
  visible: boolean;
  onSearch: (keyword: string) => void;
  onClose: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  visible,
  onSearch,
  onClose,
  placeholder = '搜索任务...',
}) => {
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState('');
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [visible, animation]);

  useEffect(() => {
    // 实时搜索 - 延迟300ms避免频繁搜索
    const timer = setTimeout(() => {
      onSearch(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, onSearch]);

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  const handleClose = () => {
    setKeyword('');
    onSearch('');
    onClose();
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height,
          opacity,
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={keyword}
          onChangeText={setKeyword}
          placeholder={placeholder}
          placeholderTextColor={theme.text + '80'}
          autoFocus
          returnKeyType="search"
        />
        {keyword.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.closeText, { color: theme.text }]}>取消</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  clearIcon: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
  },
  closeButton: {
    paddingHorizontal: 8,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SearchBar;
