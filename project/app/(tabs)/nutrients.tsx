import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ControlSlider from '@/components/controls/ControlSlider';
import ToggleSwitch from '@/components/controls/ToggleSwitch';
import ControlButton from '@/components/controls/ControlButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Beaker, Leaf, Droplets } from 'lucide-react-native';
import useSensorData from '@/hooks/useSensorData';

export default function NutrientsScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { data, refetch } = useSensorData();
  
  // Nutrient settings
  const [autoNutrients, setAutoNutrients] = useState(true);
  const [dispensingActive, setDispensingActive] = useState(false);
  
  // Manual control
  const [vitamin1Amount, setVitamin1Amount] = useState(50);
  const [vitamin2Amount, setVitamin2Amount] = useState(25);
  
  // Automation settings
  const [dispenseFrequency, setDispenseFrequency] = useState(3);
  const [vitamin1Ratio, setVitamin1Ratio] = useState(70);
  const [vitamin2Ratio, setVitamin2Ratio] = useState(30);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const dispenseBothNutrients = () => {
    console.log('Dispensing nutrients...');
    setDispensingActive(true);
    
    // Simulate dispensing
    setTimeout(() => {
      setDispensingActive(false);
    }, 3000);
  };

  const dispenseVitamin1 = () => {
    console.log('Dispensing Vitamin A...');
    setDispensingActive(true);
    
    // Simulate dispensing
    setTimeout(() => {
      setDispensingActive(false);
    }, 2000);
  };

  const dispenseVitamin2 = () => {
    console.log('Dispensing Vitamin B...');
    setDispensingActive(true);
    
    // Simulate dispensing
    setTimeout(() => {
      setDispensingActive(false);
    }, 2000);
  };

  const applySettings = () => {
    console.log('Applying nutrient settings...');
    // In a real app, we would call the API here
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Nutrient Control"
        subtitle="Vitamin dispensing system"
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Card */}
        <Card title="System Status" style={styles.card}>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Vitamin A Level:</Text>
              <View style={styles.statusBarContainer}>
                <View style={[styles.statusBar, { width: '85%', backgroundColor: '#7c3aed' }]} />
              </View>
              <Text style={styles.statusValue}>85%</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Vitamin B Level:</Text>
              <View style={styles.statusBarContainer}>
                <View style={[styles.statusBar, { width: '62%', backgroundColor: '#16a34a' }]} />
              </View>
              <Text style={styles.statusValue}>62%</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Last Dispensed:</Text>
              <Text style={styles.statusText}>Today, 08:30 AM</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Next Scheduled:</Text>
              <Text style={styles.statusText}>Tomorrow, 08:30 AM</Text>
            </View>
          </View>
        </Card>
        
        {/* Manual Control Card */}
        <Card title="Manual Dispensing" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Beaker size={20} color="#7c3aed" />
            </View>
            <Text style={styles.cardHeaderText}>Nutrient Motors Control</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.nutrientSection}>
            <Text style={styles.nutrientTitle}>Vitamin A (Growth Enhancer)</Text>
            <ControlSlider
              label="Dispensing Amount"
              value={vitamin1Amount}
              min={10}
              max={100}
              step={5}
              unit=" ml"
              onValueChange={setVitamin1Amount}
            />
            <ControlButton
              title="Dispense Vitamin A"
              onPress={dispenseVitamin1}
              disabled={dispensingActive}
              style={{ backgroundColor: '#7c3aed' }}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.nutrientSection}>
            <Text style={styles.nutrientTitle}>Vitamin B (Bloom Booster)</Text>
            <ControlSlider
              label="Dispensing Amount"
              value={vitamin2Amount}
              min={10}
              max={100}
              step={5}
              unit=" ml"
              onValueChange={setVitamin2Amount}
            />
            <ControlButton
              title="Dispense Vitamin B"
              onPress={dispenseVitamin2}
              disabled={dispensingActive}
              style={{ backgroundColor: '#16a34a' }}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.buttonContainer}>
            <ControlButton
              title={dispensingActive ? "Dispensing..." : "Dispense Both Nutrients"}
              onPress={dispenseBothNutrients}
              disabled={dispensingActive}
            />
          </View>
        </Card>
        
        {/* Automation Settings Card */}
        <Card title="Automation Settings" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Leaf size={20} color="#16a34a" />
            </View>
            <Text style={styles.cardHeaderText}>Schedule Settings</Text>
          </View>
          
          <ToggleSwitch
            label="Automatic Nutrient Dispensing"
            value={autoNutrients}
            onValueChange={setAutoNutrients}
          />
          
          <View style={styles.divider} />
          
          <ControlSlider
            label="Dispense Every"
            value={dispenseFrequency}
            min={1}
            max={7}
            step={1}
            unit=" days"
            onValueChange={setDispenseFrequency}
          />
          
          <View style={styles.divider} />
          
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Droplets size={20} color="#7c3aed" />
            </View>
            <Text style={styles.cardHeaderText}>Nutrient Ratio</Text>
          </View>
          
          <ControlSlider
            label="Vitamin A Ratio"
            value={vitamin1Ratio}
            min={0}
            max={100}
            step={10}
            unit="%"
            onValueChange={(val) => {
              setVitamin1Ratio(val);
              setVitamin2Ratio(100 - val);
            }}
          />
          
          <ControlSlider
            label="Vitamin B Ratio"
            value={vitamin2Ratio}
            min={0}
            max={100}
            step={10}
            unit="%"
            onValueChange={(val) => {
              setVitamin2Ratio(val);
              setVitamin1Ratio(100 - val);
            }}
          />
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              The total nutrient ratio must equal 100%. Adjusting one value will automatically update the other.
            </Text>
          </View>
        </Card>
        
        <View style={styles.buttonContainer}>
          <ControlButton
            title="Apply Settings"
            onPress={applySettings}
            style={{ marginBottom: 32 }}
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
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  statusContainer: {
    marginVertical: 8,
  },
  statusItem: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4b5563',
    marginBottom: 4,
  },
  statusBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  statusBar: {
    height: '100%',
    borderRadius: 4,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    textAlign: 'right',
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
  nutrientSection: {
    marginBottom: 16,
  },
  nutrientTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 16,
  },
  note: {
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
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
});