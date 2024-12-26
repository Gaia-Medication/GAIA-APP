import React, { StrictMode, useEffect } from 'react';
import { StatusBar, Text, useColorScheme, View } from 'react-native';
import { UserProvider } from './app/contexts/UserContext';
import Navigation from './app/Navigation';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    console.log('App mounted');
    async function init() {
      await AsyncStorage.setItem('darkmode', 'dark');
    }
    init();
  }
    , []);
  return (
    <StrictMode>
      <UserProvider>
        <Navigation />
      </UserProvider>
    </StrictMode>

  );
}
