import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thermometer, Droplet, Wind, Sun } from 'lucide-react-native';

type SensorType = 'temperature' | 'humidity' | 'soil' | 'light';

interface SensorValueProps {
  type: SensorType;
  value: number;
  unit: string;
  status?: 'normal' | 'warning' | 'alert';
}

export default function SensorValue({ type, value, unit, status = 'normal' }: SensorValueProps) {
  const getIcon = () => {
    switch (type) {
      case 'temperature':
        return <Thermometer size={24} color="#dc2626" />;
      case 'humidity':
        return <Droplet size={24} color="#2563eb" />;
      case 'soil':
        return <Droplet size={24} color="#7c3aed" />;
      case 'light':
        return <Sun size={24} color="#f59e0b" />;
      default:
        return <Wind size={24} color="#6b7280" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return '#f59e0b';
      case 'alert':
        return '#dc2626';
      default:
        return '#16a34a';
    }
  };

  return (
    <View style={[styles.container, { borderColor: getStatusColor() }]}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {value}
          <Text style={styles.unit}> {unit}</Text>
        </Text>
        <Text style={styles.label}>{getSensorLabel(type)}</Text>
      </View>
    </View>
  );
}

function getSensorLabel(type: SensorType): string {
  switch (type) {
    case 'temperature':
      return 'Temperature';
    case 'humidity':
      return 'Air Humidity';
    case 'soil':
      return 'Soil Moisture';
    case 'light':
      return 'Light Intensity';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 6,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginRight: 12,
  },
  valueContainer: {
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  unit: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    marginTop: 2,
  },
});