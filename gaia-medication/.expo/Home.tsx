import React, { useEffect } from "react";
import { View, Text, StatusBar,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { useRouter, useFocusEffect } from 'expo-router';
import { Redirect } from 'expo-router';
import Navigation from "./Navigation";
import { router } from 'expo-router';



const Home = () => { 

  return (
    <SafeAreaView edges={['top']}>
      <StatusBar backgroundColor="red" />
      <Text>Home!</Text>
    </SafeAreaView>
  );
}

export default Home;
