import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Padding to ensure content does not get hidden under the floating custom tab bar
  },
});
