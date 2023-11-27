import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Stock() {
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){ 
      console.log("Nav on Stock Page")
    }
  },[isFocused]); 
  return (
    <SafeAreaView edges={['top']}>
      <Text>Stock</Text>
    </SafeAreaView>
  );
}

