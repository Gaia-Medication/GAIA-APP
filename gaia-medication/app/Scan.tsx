import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Scan() {
  return (
    <SafeAreaView edges={['top']}>
      <Text>Scan</Text>
      <Button
        title='Click Here'
        onPress={() => alert('Button Clicked!')}
      />
    </SafeAreaView>
  );
}
