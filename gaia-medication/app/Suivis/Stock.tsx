import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Stock() {
  return (
    <SafeAreaView edges={['top']}>
      <Text>Stock</Text>
    </SafeAreaView>
  );
}

