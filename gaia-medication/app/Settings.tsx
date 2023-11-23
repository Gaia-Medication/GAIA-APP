import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Settings() {
  return (
    <SafeAreaView edges={['top']}>
      <Text>Settings</Text>
      <Button
        title='Click Here'
        onPress={() => alert('Button Clicked!')}
      />
    </SafeAreaView>
  );
}

export default Settings;
