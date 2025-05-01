import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Switch, TextInput } from 'react-native';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import ControlButton from '@/components/controls/ControlButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Server, Wifi, Database, ChartBar as BarChart, Shield } from 'lucide-react-native';
import greenhouseAPI from '@/api/greenhouseAPI';

export default function SystemScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  
  // System settings
  const [raspberryPiIP, setRaspberryPiIP] = useState('192.168.1.100');
  const [apiPort, setApiPort] = useState('5000');
  const [secureConnection, setSecureConnection] = useState(false);
  const [logLevel, setLogLevel] = useState('info');
  const [autoReconnect, setAutoReconnect] = useState(true);
  
  // Mock system status
  const systemStatus = {
    uptime: '3 days, 7 hours',
    cpuTemperature: '48.2°C',
    diskSpace: { used: '3.2 GB', total: '15.6 GB', percent: 21 },
    memoryUsage: { used: '512 MB', total: '1.0 GB', percent: 51 },
    networkStatus: 'Connected',
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, we would fetch actual system stats here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const saveConnection = () => {
    const protocol = secureConnection ? 'https' : 'http';
    const apiUrl = `${protocol}://${raspberryPiIP}:${apiPort}/api`;
    greenhouseAPI.setApiUrl(apiUrl);
    console.log(`API URL set to: ${apiUrl}`);
  };

  const restartRaspberryPi = () => {
    console.log('Restarting Raspberry Pi...');
    // This would need server-side implementation
  };

  const rebootControllers = () => {
    console.log('Rebooting microcontrollers...');
    // This would need server-side implementation
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="System Settings"
        subtitle="Configuration and maintenance"
        showNotification={false}
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* System Status Card */}
        <Card title="System Status" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Server size={20} color="#4b5563" />
            </View>
            <Text style={styles.cardHeaderText}>Raspberry Pi Status</Text>
          </View>
          
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Uptime</Text>
              <Text style={styles.statusValue}>{systemStatus.uptime}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>CPU Temperature</Text>
              <Text style={styles.statusValue}>{systemStatus.cpuTemperature}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Disk Usage</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${systemStatus.diskSpace.percent}%` },
                    systemStatus.diskSpace.percent > 80 ? styles.criticalBar : styles.normalBar
                  ]} 
                />
              </View>
              <Text style={styles.statusValue}>
                {systemStatus.diskSpace.used} / {systemStatus.diskSpace.total}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Memory Usage</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${systemStatus.memoryUsage.percent}%` },
                    systemStatus.memoryUsage.percent > 80 ? styles.criticalBar : styles.normalBar
                  ]} 
                />
              </View>
              <Text style={styles.statusValue}>
                {systemStatus.memoryUsage.used} / {systemStatus.memoryUsage.total}
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <ControlButton
              title="Restart Pi"
              onPress={restartRaspberryPi}
              variant="outline"
              style={styles.halfButton}
            />
            
            <ControlButton
              title="Reboot Controllers"
              onPress={rebootControllers}
              variant="outline"
              style={styles.halfButton}
            />
          </View>
        </Card>
        
        {/* Connection Settings Card */}
        <Card title="Connection Settings" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Wifi size={20} color="#4b5563" />
            </View>
            <Text style={styles.cardHeaderText}>API Connection</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Raspberry Pi IP Address</Text>
            <TextInput
              style={styles.input}
              value={raspberryPiIP}
              onChangeText={setRaspberryPiIP}
              placeholder="192.168.1.100"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>API Port</Text>
            <TextInput
              style={styles.input}
              value={apiPort}
              onChangeText={setApiPort}
              placeholder="5000"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Use HTTPS</Text>
            <Switch
              value={secureConnection}
              onValueChange={setSecureConnection}
              trackColor={{ false: '#d1d5db', true: '#16a34a' }}
              thumbColor={secureConnection ? '#ffffff' : '#ffffff'}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Auto Reconnect</Text>
            <Switch
              value={autoReconnect}
              onValueChange={setAutoReconnect}
              trackColor={{ false: '#d1d5db', true: '#16a34a' }}
              thumbColor={autoReconnect ? '#ffffff' : '#ffffff'}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <ControlButton
              title="Save Connection Settings"
              onPress={saveConnection}
            />
          </View>
        </Card>
        
        {/* Data Management Card */}
        <Card title="Data Management" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Database size={20} color="#4b5563" />
            </View>
            <Text style={styles.cardHeaderText}>Sensor Data Storage</Text>
          </View>
          
          <View style={styles.dataManagement}>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Stored Data Size</Text>
              <Text style={styles.dataValue}>128 MB</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Oldest Record</Text>
              <Text style={styles.dataValue}>2023-01-15</Text>
            </View>
            
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Storage Limit</Text>
              <Text style={styles.dataValue}>500 MB</Text>
            </View>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Auto Delete Old Records</Text>
            <Switch
              value={true}
              trackColor={{ false: '#d1d5db', true: '#16a34a' }}
              thumbColor={'#ffffff'}
            />
          </View>
          
          <View style={styles.buttonRow}>
            <ControlButton
              title="Export Data"
              variant="outline"
              style={styles.halfButton}
              onPress={() => console.log('Exporting data...')}
            />
            
            <ControlButton
              title="Clear Data"
              variant="danger"
              style={styles.halfButton}
              onPress={() => console.log('Clearing data...')}
            />
          </View>
        </Card>
        
        {/* System Log Card */}
        <Card title="System Log" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <BarChart size={20} color="#4b5563" />
            </View>
            <Text style={styles.cardHeaderText}>Logging Configuration</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Log Level</Text>
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerItem, logLevel === 'debug' && styles.pickerItemSelected]} 
                onPress={() => setLogLevel('debug')}>
                Debug
              </Text>
              <Text style={[styles.pickerItem, logLevel === 'info' && styles.pickerItemSelected]} 
                onPress={() => setLogLevel('info')}>
                Info
              </Text>
              <Text style={[styles.pickerItem, logLevel === 'warning' && styles.pickerItemSelected]} 
                onPress={() => setLogLevel('warning')}>
                Warning
              </Text>
              <Text style={[styles.pickerItem, logLevel === 'error' && styles.pickerItemSelected]} 
                onPress={() => setLogLevel('error')}>
                Error
              </Text>
            </View>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Log to File</Text>
            <Switch
              value={true}
              trackColor={{ false: '#d1d5db', true: '#16a34a' }}
              thumbColor={'#ffffff'}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Verbose Output</Text>
            <Switch
              value={false}
              trackColor={{ false: '#d1d5db', true: '#16a34a' }}
              thumbColor={'#ffffff'}
            />
          </View>
          
          <View style={styles.logArea}>
            <Text style={styles.logText}>
              [INFO] 2023-05-12 08:30:21 - System startup{'\n'}
              [INFO] 2023-05-12 08:30:23 - Connecting to sensors{'\n'}
              [INFO] 2023-05-12 08:30:25 - All sensors connected{'\n'}
              [WARN] 2023-05-12 14:15:10 - High temperature detected{'\n'}
              [INFO] 2023-05-12 14:15:12 - Activating ventilation
            </Text>
          </View>
        </Card>
        
        {/* System Security Card */}
        <Card title="Security" style={[styles.card, { marginBottom: 32 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Shield size={20} color="#4b5563" />
            </View>
            <Text style={styles.cardHeaderText}>Access Control</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>API Access Token</Text>
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenText}>••••••••••••••••••••••</Text>
              <ControlButton
                title="Regenerate"
                variant="secondary"
                style={styles.tokenButton}
                textStyle={styles.tokenButtonText}
                onPress={() => console.log('Regenerating token...')}
              />
            </View>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Require Authentication</Text>
            <Switch
              value={true}
              trackColor={{ false: '#d1d5db', true: '#16a34a' }}
              thumbColor={'#ffffff'}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Remote Access</Text>
            <Switch
              value={false}
              trackColor={{ false: '#d1d5db', true: '#16a34a' }}
              thumbColor={'#ffffff'}
            />
          </View>
          
          <View style={styles.note}>
            <Text style={styles.noteText}>
              Enabling remote access lets you control your greenhouse from outside your local network.
              Make sure you have set a strong API Access Token when enabling this feature.
            </Text>
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
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(75, 85, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  statusGrid: {
    marginBottom: 16,
  },
  statusItem: {
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  normalBar: {
    backgroundColor: '#16a34a',
  },
  criticalBar: {
    backgroundColor: '#dc2626',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  halfButton: {
    flex: 0.48,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1f2937',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
  },
  buttonContainer: {
    marginTop: 8,
  },
  dataManagement: {
    marginBottom: 16,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
  },
  dataValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerItem: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4b5563',
  },
  pickerItemSelected: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
  },
  logArea: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  logText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#d1d5db',
    lineHeight: 18,
  },
  tokenContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  tokenText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#4b5563',
  },
  tokenButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 36,
  },
  tokenButtonText: {
    fontSize: 12,
  },
  note: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4b5563',
    lineHeight: 20,
  },
});