import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import MapView from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Messager() {
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){ 
      console.log("Nav on Map Page")
    }
  },[isFocused]); 
  
  return (
    <View>
      <MapView style={{width: '100%',
    height: '100%'}} />
    </View>
  );
}

