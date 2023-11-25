import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Suivis() {
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){ 
      console.log("Nav on Suivis Page")
    }
  },[isFocused]); 
  
  return (
    <SafeAreaView edges={['top']}>
      <Text>Suivis</Text>
    </SafeAreaView>
  );
}

