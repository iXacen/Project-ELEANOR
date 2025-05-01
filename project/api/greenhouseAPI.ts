import axios from 'axios';
import { Platform } from 'react-native';

// Default API URL - update with your Raspberry Pi IP
const DEFAULT_API_URL = 'http://192.168.1.100:5000/api';

// Control types
export type ControlType = 
  | 'servo'
  | 'window'
  | 'water'
  | 'vitamin'
  | 'led'
  | 'fan';

// Sensor reading types
export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  timestamp: string;
}

// Automation rule interface
export interface AutomationRule {
  id: string;
  sensor: string;
  condition: '>' | '<' | '=' | '>=' | '<=';
  value: number;
  action: {
    controlType: ControlType;
    controlId: number;
    value: number | boolean;
  };
  active: boolean;
}

class GreenhouseAPI {
  private apiUrl: string;

  constructor(apiUrl: string = DEFAULT_API_URL) {
    this.apiUrl = apiUrl;
  }

  // Method to update the API URL (e.g., when changed in settings)
  setApiUrl(newUrl: string) {
    this.apiUrl = newUrl;
  }

  // Utility method to handle API calls
  private async apiCall<T>(method: string, endpoint: string, data?: any): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.apiUrl}/${endpoint}`,
        data,
        timeout: 5000, // 5 second timeout
      });
      return response.data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ----- SENSOR DATA METHODS -----

  // Get current sensor readings
  async getSensorData(): Promise<SensorData> {
    return this.apiCall<SensorData>('GET', 'sensors');
  }

  // Get historical sensor data
  async getHistoricalData(
    sensor: string,
    startTime: string,
    endTime: string
  ): Promise<{ timestamp: string; value: number }[]> {
    return this.apiCall('GET', `sensors/history/${sensor}?start=${startTime}&end=${endTime}`);
  }

  // ----- CONTROL METHODS -----

  // Control a servo motor (panel positioning)
  async controlServo(servoId: number, angle: number): Promise<{ success: boolean }> {
    return this.apiCall('POST', 'control/servo', { id: servoId, angle });
  }

  // Control window motors
  async controlWindow(windowId: number, openPercent: number): Promise<{ success: boolean }> {
    return this.apiCall('POST', 'control/window', { id: windowId, percent: openPercent });
  }

  // Control water pump
  async controlWaterPump(on: boolean, duration?: number): Promise<{ success: boolean }> {
    return this.apiCall('POST', 'control/water', { on, duration });
  }

  // Control vitamin motors
  async controlVitamin(vitaminId: number, amount: number): Promise<{ success: boolean }> {
    return this.apiCall('POST', 'control/vitamin', { id: vitaminId, amount });
  }

  // Control LED lights
  async controlLED(ledId: number, brightness: number): Promise<{ success: boolean }> {
    return this.apiCall('POST', 'control/led', { id: ledId, brightness });
  }

  // ----- AUTOMATION RULES METHODS -----

  // Get all automation rules
  async getAutomationRules(): Promise<AutomationRule[]> {
    return this.apiCall('GET', 'automation/rules');
  }

  // Create a new automation rule
  async createAutomationRule(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> {
    return this.apiCall('POST', 'automation/rules', rule);
  }

  // Update an existing automation rule
  async updateAutomationRule(id: string, rule: Partial<AutomationRule>): Promise<AutomationRule> {
    return this.apiCall('PUT', `automation/rules/${id}`, rule);
  }

  // Delete an automation rule
  async deleteAutomationRule(id: string): Promise<{ success: boolean }> {
    return this.apiCall('DELETE', `automation/rules/${id}`);
  }

  // Toggle an automation rule active state
  async toggleAutomationRule(id: string, active: boolean): Promise<AutomationRule> {
    return this.apiCall('PATCH', `automation/rules/${id}/toggle`, { active });
  }

  // ----- SYSTEM METHODS -----

  // Get system status
  async getSystemStatus(): Promise<{
    uptime: number;
    cpuTemperature: number;
    diskSpace: { total: number; used: number; free: number };
    memoryUsage: { total: number; used: number; free: number };
  }> {
    return this.apiCall('GET', 'system/status');
  }

  // Mock data for testing/development mode
  getMockSensorData(): SensorData {
    return {
      temperature: 25.8,
      humidity: 68.5,
      soilMoisture: 42.3,
      lightIntensity: 856,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper to create mock historical data
  getMockHistoricalData(
    sensor: string,
    points: number = 24
  ): { timestamp: string; value: number }[] {
    const result = [];
    const now = new Date();
    const baseValue = sensor === 'temperature' ? 25 
                    : sensor === 'humidity' ? 70
                    : sensor === 'soilMoisture' ? 45
                    : 800; // lightIntensity
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000); // hourly data
      const random = (Math.random() - 0.5) * 10; // random fluctuation
      result.push({
        timestamp: time.toISOString(),
        value: baseValue + random,
      });
    }
    
    return result;
  }
}

// Create a singleton instance
const greenhouseAPI = new GreenhouseAPI(
  // Use the mock API for web during development
  Platform.OS === 'web' ? 'http://localhost:5000/api' : DEFAULT_API_URL
);

export default greenhouseAPI;