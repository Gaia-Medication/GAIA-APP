import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Journal() {
  return (
    <SafeAreaView edges={['top']}>
      <Text>Journal</Text>
    </SafeAreaView>
  );
}

