import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ControlSlider from '@/components/controls/ControlSlider';
import ToggleSwitch from '@/components/controls/ToggleSwitch';
import ControlButton from '@/components/controls/ControlButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Thermometer, Wind } from 'lucide-react-native';
import useSensorData from '@/hooks/useSensorData';

export default function ClimateScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { data, refetch } = useSensorData();
  
  // State for window controls
  const [window1Open, setWindow1Open] = useState(30);
  const [window2Open, setWindow2Open] = useState(45);
  const [autoWindowControl, setAutoWindowControl] = useState(true);
  
  // State for fan controls
  const [fanSpeed, setFanSpeed] = useState(0);
  const [autoFanControl, setAutoFanControl] = useState(true);
  
  // State for threshold settings
  const [tempLowThreshold, setTempLowThreshold] = useState(18);
  const [tempHighThreshold, setTempHighThreshold] = useState(28);
  const [humidityLowThreshold, setHumidityLowThreshold] = useState(45);
  const [humidityHighThreshold, setHumidityHighThreshold] = useState(75);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const applySettings = () => {
    console.log('Applying climate settings...');
    // In a real app, we would call the API here
    // Example: greenhouseAPI.controlWindow(1, window1Open)
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Climate Control"
        subtitle={data ? `${data.temperature}°C / ${data.humidity}% Humidity` : 'Loading...'}
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Windows Control Card */}
        <Card title="Windows Control" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Wind size={20} color="#16a34a" />
            </View>
            <Text style={styles.cardHeaderText}>Ventilation</Text>
          </View>
          
          <ToggleSwitch
            label="Automatic Window Control"
            value={autoWindowControl}
            onValueChange={setAutoWindowControl}
          />
          
          <ControlSlider
            label="North Window"
            value={window1Open}
            min={0}
            max={100}
            step={5}
            unit="%"
            onValueChange={setWindow1Open}
          />
          
          <ControlSlider
            label="South Window"
            value={window2Open}
            min={0}
            max={100}
            step={5}
            unit="%"
            onValueChange={setWindow2Open}
          />
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Windows are currently set to {autoWindowControl ? 'automatic' : 'manual'} control mode.
              {autoWindowControl ? ' They will adjust based on temperature thresholds.' : ''}
            </Text>
          </View>
        </Card>
        
        {/* Fan Control Card */}
        <Card title="Circulation Fan" style={styles.card}>
          <ToggleSwitch
            label="Automatic Fan Control"
            value={autoFanControl}
            onValueChange={setAutoFanControl}
          />
          
          <ControlSlider
            label="Fan Speed"
            value={fanSpeed}
            min={0}
            max={100}
            step={5}
            unit="%"
            onValueChange={setFanSpeed}
          />
        </Card>
        
        {/* Temperature Thresholds Card */}
        <Card title="Temperature Thresholds" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Thermometer size={20} color="#dc2626" />
            </View>
            <Text style={styles.cardHeaderText}>Temperature Settings</Text>
          </View>
          
          <ControlSlider
            label="Minimum Temperature"
            value={tempLowThreshold}
            min={10}
            max={25}
            step={0.5}
            unit="°C"
            onValueChange={setTempLowThreshold}
          />
          
          <ControlSlider
            label="Maximum Temperature"
            value={tempHighThreshold}
            min={20}
            max={35}
            step={0.5}
            unit="°C"
            onValueChange={setTempHighThreshold}
          />
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              When temperature exceeds {tempHighThreshold}°C, windows will open and fans will activate.
              When temperature falls below {tempLowThreshold}°C, windows will close.
            </Text>
          </View>
        </Card>
        
        {/* Humidity Thresholds Card */}
        <Card title="Humidity Thresholds" style={styles.card}>
          <ControlSlider
            label="Minimum Humidity"
            value={humidityLowThreshold}
            min={30}
            max={60}
            step={1}
            unit="%"
            onValueChange={setHumidityLowThreshold}
          />
          
          <ControlSlider
            label="Maximum Humidity"
            value={humidityHighThreshold}
            min={60}
            max={90}
            step={1}
            unit="%"
            onValueChange={setHumidityHighThreshold}
          />
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              When humidity exceeds {humidityHighThreshold}%, ventilation will increase.
              When humidity falls below {humidityLowThreshold}%, ventilation will decrease.
            </Text>
          </View>
        </Card>
        
        <View style={styles.buttonContainer}>
          <ControlButton
            title="Apply Settings"
            onPress={applySettings}
            style={styles.button}
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
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  note: {
    backgroundColor: 'rgba(22, 163, 74, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginBottom: 32,
  },
});