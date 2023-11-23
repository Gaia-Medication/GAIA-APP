import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <SafeAreaView edges={['top']}>
      <Text>Settings</Text>
    </SafeAreaView>
  );
}

