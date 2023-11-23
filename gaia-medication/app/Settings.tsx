import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Settings() {
  return (
    <SafeAreaView edges={['top']}>
      <Text>Settings</Text>
    </SafeAreaView>
  );
}

export default Settings;
