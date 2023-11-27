import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <View>
      <Text>Settings</Text>
      <Button
            title="CLEAR USERS DATA"
            onPress={() => AsyncStorage.removeItem("users")}
          />
    </View>
  );
}

