import React, { useEffect } from "react";
import { View, Text, StatusBar,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Redirect } from 'expo-router';



function CreateProfile() { 

  return (
    <SafeAreaView edges={['top']}>
      <StatusBar backgroundColor="blue" />
      <Text>CreateProfile</Text>
    </SafeAreaView>
  );
}

export default CreateProfile;
