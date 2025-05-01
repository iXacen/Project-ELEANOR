import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import SensorValue from '@/components/common/SensorValue';
import { Activity, RefreshCw, TriangleAlert as AlertTriangle, Zap } from 'lucide-react-native';
import useSensorData from '@/hooks/useSensorData';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useSensorData(30000); // refresh every 30 seconds

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Mock system status
  const systemStatus = {
    automationActive: true,
    servoStatus: 'OK',
    windowStatus: 'OK',
    pumpStatus: 'OK',
    vitaminStatus: 'Warning',
    alerts: ['Low vitamin solution level'],
  };

  const temperatureThresholds = {
    min: 18,
    max: 30,
    current: data?.temperature || 25,
  };

  // Get status indicator for a sensor value
  const getSensorStatus = (type: string, value: number): 'normal' | 'warning' | 'alert' => {
    if (!data) return 'normal';
    
    switch (type) {
      case 'temperature':
        return value > 32 || value < 15 ? 'alert' : value > 30 || value < 18 ? 'warning' : 'normal';
      case 'humidity':
        return value > 85 || value < 40 ? 'warning' : 'normal';
      case 'soil':
        return value < 30 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="ELEANOR"
        subtitle="Greenhouse Control System"
        onNotificationPress={() => console.log('Notification pressed')}
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* System Status Card */}
        <Card title="System Status">
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator}>
              <View style={[styles.indicator, { backgroundColor: systemStatus.automationActive ? '#16a34a' : '#9ca3af' }]} />
              <Text style={styles.statusText}>Automation: {systemStatus.automationActive ? 'Active' : 'Disabled'}</Text>
            </View>
            
            {systemStatus.alerts.length > 0 && (
              <TouchableOpacity style={styles.alertButton}>
                <AlertTriangle size={16} color="#f59e0b" />
                <Text style={styles.alertText}>{systemStatus.alerts.length} Alert</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.componentsGrid}>
            <View style={styles.componentStatus}>
              <Text style={styles.componentTitle}>Solar Panels</Text>
              <Text style={styles.componentValue}>{systemStatus.servoStatus}</Text>
            </View>
            <View style={styles.componentStatus}>
              <Text style={styles.componentTitle}>Windows</Text>
              <Text style={styles.componentValue}>{systemStatus.windowStatus}</Text>
            </View>
            <View style={styles.componentStatus}>
              <Text style={styles.componentTitle}>Water Pump</Text>
              <Text style={styles.componentValue}>{systemStatus.pumpStatus}</Text>
            </View>
            <View style={styles.componentStatus}>
              <Text style={styles.componentTitle}>Vitamins</Text>
              <Text style={[styles.componentValue, { color: '#f59e0b' }]}>{systemStatus.vitaminStatus}</Text>
            </View>
          </View>
        </Card>
        
        {/* Sensor Values Card */}
        <Card title="Current Conditions">
          {data ? (
            <View style={styles.sensorsContainer}>
              <SensorValue 
                type="temperature" 
                value={data.temperature} 
                unit="°C" 
                status={getSensorStatus('temperature', data.temperature)}
              />
              <SensorValue 
                type="humidity" 
                value={data.humidity} 
                unit="%" 
                status={getSensorStatus('humidity', data.humidity)}
              />
              <SensorValue 
                type="soil" 
                value={data.soilMoisture} 
                unit="%" 
                status={getSensorStatus('soil', data.soilMoisture)}
              />
              <SensorValue 
                type="light" 
                value={data.lightIntensity} 
                unit="lux" 
              />
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <RefreshCw size={24} color="#9ca3af" />
              <Text style={styles.loadingText}>Loading sensor data...</Text>
            </View>
          )}
        </Card>
        
        {/* Temperature Chart Card */}
        <Card title="Temperature Trend (24h)">
          <LineChart
            data={{
              labels: ['6h', '12h', '18h', 'Now'],
              datasets: [
                {
                  data: [22, 24.5, 26.2, 25.8, 24.3, 23.1]
                }
              ]
            }}
            width={330} // from react-native
            height={180}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '1',
                stroke: '#16a34a'
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          <View style={styles.thresholdContainer}>
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Min</Text>
              <Text style={styles.thresholdValue}>{temperatureThresholds.min}°C</Text>
            </View>
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Current</Text>
              <Text style={[styles.thresholdValue, { color: '#16a34a', fontFamily: 'Inter_600SemiBold' }]}>{temperatureThresholds.current}°C</Text>
            </View>
            <View style={styles.thresholdItem}>
              <Text style={styles.thresholdLabel}>Max</Text>
              <Text style={styles.thresholdValue}>{temperatureThresholds.max}°C</Text>
            </View>
          </View>
        </Card>
        
        {/* Quick Actions Card */}
        <Card title="Quick Actions">
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Zap size={22} color="#16a34a" />
              </View>
              <Text style={styles.actionText}>Start Irrigation</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Activity size={22} color="#16a34a" />
              </View>
              <Text style={styles.actionText}>System Report</Text>
            </TouchableOpacity>
          </View>
        </Card>
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  alertText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#f59e0b',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  componentStatus: {
    width: '50%',
    paddingVertical: 8,
  },
  componentTitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  componentValue: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#16a34a',
    marginTop: 2,
  },
  sensorsContainer: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    marginTop: 8,
  },
  thresholdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  thresholdItem: {
    alignItems: 'center',
  },
  thresholdLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  thresholdValue: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
  },
});