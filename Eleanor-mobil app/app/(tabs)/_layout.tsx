import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Chrome as Home, Gauge, Droplets, Leaf, Activity, Settings, Sun } from 'lucide-react-native';

const TabBarIcon = ({ color, icon: Icon }) => {
  return (
    <View style={styles.iconContainer}>
      <Icon size={24} color={color} strokeWidth={2} />
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon icon={Home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="climate"
        options={{
          title: 'Climate',
          tabBarIcon: ({ color }) => <TabBarIcon icon={Gauge} color={color} />,
        }}
      />
      <Tabs.Screen
        name="irrigation"
        options={{
          title: 'Irrigation',
          tabBarIcon: ({ color }) => <TabBarIcon icon={Droplets} color={color} />,
        }}
      />
      <Tabs.Screen
        name="nutrients"
        options={{
          title: 'Nutrients',
          tabBarIcon: ({ color }) => <TabBarIcon icon={Leaf} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lighting"
        options={{
          title: 'Lighting',
          tabBarIcon: ({ color }) => <TabBarIcon icon={Sun} color={color} />,
        }}
      />
      <Tabs.Screen
        name="system"
        options={{
          title: 'System',
          tabBarIcon: ({ color }) => <TabBarIcon icon={Settings} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
});