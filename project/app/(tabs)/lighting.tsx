import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ControlSlider from '@/components/controls/ControlSlider';
import ToggleSwitch from '@/components/controls/ToggleSwitch';
import ControlButton from '@/components/controls/ControlButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Moon, Timer, Zap } from 'lucide-react-native';
import useSensorData from '@/hooks/useSensorData';

export default function LightingScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { data, refetch } = useSensorData();
  
  // Light settings
  const [autoLighting, setAutoLighting] = useState(true);
  const [mainLightBrightness, setMainLightBrightness] = useState(85);
  const [secondaryLightBrightness, setSecondaryLightBrightness] = useState(60);
  const [allLightsOn, setAllLightsOn] = useState(true);
  
  // Schedule settings
  const [dayStartTime, setDayStartTime] = useState('06:00');
  const [dayEndTime, setDayEndTime] = useState('20:00');
  const [sunriseTime, setSunriseTime] = useState(30);
  const [sunsetTime, setSunsetTime] = useState(30);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const toggleAllLights = () => {
    setAllLightsOn(!allLightsOn);
  };

  const applySettings = () => {
    console.log('Applying lighting settings...');
    // In a real app, we would call the API here
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Lighting Control"
        subtitle={data ? `Current Light: ${data.lightIntensity} lux` : 'Loading...'}
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Card */}
        <Card title="Lighting Status" style={styles.card}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Current Mode:</Text>
            <View style={styles.statusValue}>
              <View style={[styles.statusIndicator, { backgroundColor: autoLighting ? '#eab308' : '#6b7280' }]} />
              <Text style={styles.statusText}>
                {autoLighting ? 'Automatic - Schedule Active' : 'Manual Control'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Lights:</Text>
            <View style={styles.statusValue}>
              <View style={[styles.statusIndicator, { backgroundColor: allLightsOn ? '#16a34a' : '#dc2626' }]} />
              <Text style={[styles.statusText, { color: allLightsOn ? '#16a34a' : '#dc2626' }]}>
                {allLightsOn ? 'ON' : 'OFF'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Next Transition:</Text>
            <Text style={styles.statusText}>
              {autoLighting 
                ? (allLightsOn ? 'Lights OFF at 20:00' : 'Lights ON at 06:00') 
                : 'No scheduled transitions (manual mode)'}
            </Text>
          </View>
        </Card>
        
        {/* Manual Control Card */}
        <Card title="Manual Light Control" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Sun size={20} color="#eab308" />
            </View>
            <Text style={styles.cardHeaderText}>LED Brightness</Text>
          </View>
          
          <ToggleSwitch
            label="All Lights"
            value={allLightsOn}
            onValueChange={toggleAllLights}
          />
          
          <ControlSlider
            label="Main Lighting"
            value={mainLightBrightness}
            min={0}
            max={100}
            step={5}
            unit="%"
            onValueChange={setMainLightBrightness}
          />
          
          <ControlSlider
            label="Secondary Lighting"
            value={secondaryLightBrightness}
            min={0}
            max={100}
            step={5}
            unit="%"
            onValueChange={setSecondaryLightBrightness}
          />
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Manual control overrides automatic schedule. Use the toggle above to turn all lights on or off.
            </Text>
          </View>
        </Card>
        
        {/* Schedule Settings Card */}
        <Card title="Lighting Schedule" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Timer size={20} color="#eab308" />
            </View>
            <Text style={styles.cardHeaderText}>Day/Night Cycle</Text>
          </View>
          
          <ToggleSwitch
            label="Automatic Lighting Control"
            value={autoLighting}
            onValueChange={setAutoLighting}
          />
          
          <View style={styles.divider} />
          
          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleHeader}>
                <Sun size={16} color="#eab308" />
                <Text style={styles.scheduleTitle}>Day Start</Text>
              </View>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>{dayStartTime}</Text>
              </View>
            </View>
            
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleHeader}>
                <Moon size={16} color="#6b7280" />
                <Text style={styles.scheduleTitle}>Day End</Text>
              </View>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>{dayEndTime}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <ControlSlider
            label="Sunrise Transition Duration"
            value={sunriseTime}
            min={0}
            max={60}
            step={5}
            unit=" min"
            onValueChange={setSunriseTime}
          />
          
          <ControlSlider
            label="Sunset Transition Duration"
            value={sunsetTime}
            min={0}
            max={60}
            step={5}
            unit=" min"
            onValueChange={setSunsetTime}
          />
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Transitions gradually change light brightness to simulate natural sunrise and sunset.
              Total light duration per day: {calculateHours(dayStartTime, dayEndTime)} hours.
            </Text>
          </View>
        </Card>
        
        {/* Power Consumption Card */}
        <Card title="Power Management" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Zap size={20} color="#eab308" />
            </View>
            <Text style={styles.cardHeaderText}>Energy Consumption</Text>
          </View>
          
          <View style={styles.powerContainer}>
            <View style={styles.powerItem}>
              <Text style={styles.powerLabel}>Current Usage</Text>
              <Text style={styles.powerValue}>42W</Text>
            </View>
            
            <View style={styles.powerItem}>
              <Text style={styles.powerLabel}>Daily Average</Text>
              <Text style={styles.powerValue}>506Wh</Text>
            </View>
            
            <View style={styles.powerItem}>
              <Text style={styles.powerLabel}>Monthly Estimate</Text>
              <Text style={styles.powerValue}>15.2kWh</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.buttonContainer}>
          <ControlButton
            title="Apply Settings"
            onPress={applySettings}
            style={{ backgroundColor: '#eab308', marginBottom: 32 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// Helper function to calculate hours between two time strings
function calculateHours(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let hours = endHour - startHour;
  let minutes = endMinute - startMinute;
  
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  
  if (hours < 0) {
    hours += 24; // Next day
  }
  
  return parseFloat((hours + minutes / 60).toFixed(1));
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
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#4b5563',
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
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  note: {
    backgroundColor: 'rgba(234, 179, 8, 0.05)',
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
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleItem: {
    width: '48%',
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4b5563',
    marginLeft: 8,
  },
  scheduleTime: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  scheduleTimeText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  buttonContainer: {
    padding: 16,
  },
  powerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  powerItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  powerLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  powerValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#eab308',
  },
});