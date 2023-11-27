import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){ 
      console.log("Nav on Settings Page")
    }
  },[isFocused]); 
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

