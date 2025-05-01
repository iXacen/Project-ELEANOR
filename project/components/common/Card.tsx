import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export default function Card({ title, children, style, titleStyle }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
});