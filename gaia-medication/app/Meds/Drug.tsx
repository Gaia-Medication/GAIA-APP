import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMedbyCIS } from '../../dao/Meds';

export default function Drug({route}) {
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){ 
      console.log("Nav on Drug Page")
    }
  },[isFocused]); 
  const { drugCIS } = route.params;
  console.log(drugCIS)
  const drug= getMedbyCIS(drugCIS)
  return (
    <View>
      {drug&&<Text>Name: {drug.Name}</Text>}
    </View>
  );
}