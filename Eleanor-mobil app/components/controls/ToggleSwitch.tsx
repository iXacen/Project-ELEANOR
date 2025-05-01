import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  label,
  value,
  onValueChange,
  disabled = false,
}: ToggleSwitchProps) {
  const offset = useSharedValue(value ? 1 : 0);

  const toggleSwitch = () => {
    if (disabled) return;
    
    const newValue = !value;
    offset.value = withSpring(newValue ? 1 : 0);
    onValueChange(newValue);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(offset.value * 28) }],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        offset.value,
        [0, 1],
        ['#d1d5db', '#16a34a']
      ),
      opacity: disabled ? 0.5 : 1,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleSwitch}
        disabled={disabled}
      >
        <Animated.View style={[styles.switchTrack, backgroundStyle]}>
          <Animated.View style={[styles.switchThumb, animatedStyles]} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
  },
  disabledText: {
    color: '#9ca3af',
  },
  switchTrack: {
    width: 56,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});