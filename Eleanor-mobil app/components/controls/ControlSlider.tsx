import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onValueChange: (value: number) => void;
}

export default function ControlSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onValueChange,
}: ControlSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const width = 300;
  const knobSize = 24;
  const trackPadding = knobSize / 2;
  const trackWidth = width - knobSize;
  
  const progress = useSharedValue(((value - min) / (max - min)) * trackWidth);

  const updateValue = (newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(trackWidth, newProgress));
    const newValue = min + (clampedProgress / trackWidth) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const roundedValue = parseFloat(steppedValue.toFixed(2));
    setLocalValue(roundedValue);
    onValueChange(roundedValue);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = progress.value;
    },
    onActive: (event, ctx) => {
      const newProgress = ctx.startX + event.translationX;
      progress.value = Math.max(0, Math.min(trackWidth, newProgress));
      runOnJS(updateValue)(progress.value);
    },
    onEnd: () => {
      // Optional spring animation when released
      progress.value = withSpring(progress.value);
    },
  });

  const knobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value }],
    };
  });

  const activeTrackStyle = useAnimatedStyle(() => {
    return {
      width: progress.value + trackPadding,
    };
  });

  // Increase/decrease by step
  const adjustValue = (direction: 'increase' | 'decrease') => {
    const adjustment = direction === 'increase' ? step : -step;
    const newValue = Math.max(min, Math.min(max, localValue + adjustment));
    setLocalValue(newValue);
    onValueChange(newValue);
    progress.value = withSpring(((newValue - min) / (max - min)) * trackWidth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>
          {localValue}
          {unit}
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        <TouchableOpacity onPress={() => adjustValue('decrease')} style={styles.button}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.trackContainer}>
          <View style={[styles.track, { width }]}>
            <Animated.View style={[styles.activeTrack, activeTrackStyle]} />
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.knob, knobStyle]} />
            </PanGestureHandler>
          </View>
        </View>

        <TouchableOpacity onPress={() => adjustValue('increase')} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#16a34a',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackContainer: {
    paddingVertical: 16,
    flex: 1,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
  },
  activeTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
    position: 'absolute',
    left: 0,
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#16a34a',
    position: 'absolute',
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
});