import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ControlSlider from '@/components/controls/ControlSlider';
import ToggleSwitch from '@/components/controls/ToggleSwitch';
import ControlButton from '@/components/controls/ControlButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Droplets, Timer, Droplet as DropletHalf } from 'lucide-react-native';
import useSensorData from '@/hooks/useSensorData';

export default function IrrigationScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { data, refetch } = useSensorData();
  
  // Irrigation settings
  const [autoIrrigation, setAutoIrrigation] = useState(true);
  const [manualDuration, setManualDuration] = useState(5);
  const [wateringActive, setWateringActive] = useState(false);
  
  // Threshold settings
  const [moistureThreshold, setMoistureThreshold] = useState(35);
  const [wateringDuration, setWateringDuration] = useState(15);
  const [wateringFrequency, setWateringFrequency] = useState(12);
  
  // Schedule
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [morningTime, setMorningTime] = useState('06:30');
  const [eveningTime, setEveningTime] = useState('18:30');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const startWatering = () => {
    console.log('Starting manual watering...');
    setWateringActive(true);
    
    // Simulate watering
    setTimeout(() => {
      setWateringActive(false);
    }, manualDuration * 1000); // Convert to milliseconds
  };

  const applySettings = () => {
    console.log('Applying irrigation settings...');
    // In a real app, we would call the API here
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Irrigation Control"
        subtitle={data ? `Soil Moisture: ${data.soilMoisture}%` : 'Loading...'}
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Manual Control Card */}
        <Card title="Manual Irrigation" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Droplets size={20} color="#2563eb" />
            </View>
            <Text style={styles.cardHeaderText}>Water Pump Control</Text>
          </View>
          
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={styles.statusValue}>
              <View style={[styles.statusIndicator, { backgroundColor: wateringActive ? '#2563eb' : '#9ca3af' }]} />
              <Text style={[styles.statusText, { color: wateringActive ? '#2563eb' : '#4b5563' }]}>
                {wateringActive ? 'Watering Active' : 'Idle'}
              </Text>
            </View>
          </View>
          
          <ControlSlider
            label="Watering Duration"
            value={manualDuration}
            min={1}
            max={30}
            step={1}
            unit=" min"
            onValueChange={setManualDuration}
          />
          
          <View style={styles.buttonContainer}>
            <ControlButton
              title={wateringActive ? "Watering..." : "Start Watering"}
              onPress={startWatering}
              disabled={wateringActive}
              style={{ backgroundColor: wateringActive ? '#9ca3af' : '#2563eb' }}
            />
          </View>
        </Card>
        
        {/* Automation Settings Card */}
        <Card title="Automation Settings" style={styles.card}>
          <ToggleSwitch
            label="Automatic Irrigation"
            value={autoIrrigation}
            onValueChange={setAutoIrrigation}
          />
          
          <View style={styles.divider} />
          
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <DropletHalf size={20} color="#2563eb" />
            </View>
            <Text style={styles.cardHeaderText}>Soil Moisture Thresholds</Text>
          </View>
          
          <ControlSlider
            label="Moisture Threshold"
            value={moistureThreshold}
            min={10}
            max={80}
            step={5}
            unit="%"
            onValueChange={setMoistureThreshold}
          />
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Irrigation will automatically start when soil moisture falls below {moistureThreshold}%.
            </Text>
          </View>
          
          <ControlSlider
            label="Watering Duration"
            value={wateringDuration}
            min={1}
            max={60}
            step={1}
            unit=" min"
            onValueChange={setWateringDuration}
          />
          
          <ControlSlider
            label="Minimum Hours Between Cycles"
            value={wateringFrequency}
            min={1}
            max={48}
            step={1}
            unit=" hours"
            onValueChange={setWateringFrequency}
          />
        </Card>
        
        {/* Schedule Card */}
        <Card title="Watering Schedule" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Timer size={20} color="#2563eb" />
            </View>
            <Text style={styles.cardHeaderText}>Time-Based Schedule</Text>
          </View>
          
          <ToggleSwitch
            label="Enable Scheduled Watering"
            value={scheduleEnabled}
            onValueChange={setScheduleEnabled}
          />
          
          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Morning</Text>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>{morningTime}</Text>
              </View>
            </View>
            
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Evening</Text>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>{eveningTime}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Scheduled watering will occur twice daily at the set times, 
              regardless of soil moisture levels (unless disabled).
            </Text>
          </View>
        </Card>
        
        <View style={styles.buttonContainer}>
          <ControlButton
            title="Apply Settings"
            onPress={applySettings}
            style={{ backgroundColor: '#2563eb', marginBottom: 32 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#4b5563',
    marginRight: 12,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  buttonContainer: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  note: {
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
    lineHeight: 20,
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  scheduleItem: {
    alignItems: 'center',
    width: '45%',
  },
  scheduleLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
    marginBottom: 8,
  },
  scheduleTime: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  scheduleTimeText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#2563eb',
  },
});