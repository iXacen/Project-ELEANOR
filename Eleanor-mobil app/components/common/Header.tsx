import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BellRing } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
  onNotificationPress?: () => void;
}

export default function Header({ 
  title, 
  subtitle, 
  showNotification = true,
  onNotificationPress = () => {} 
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {showNotification && (
        <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
          <BellRing size={24} color="#16a34a" strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
  },
});