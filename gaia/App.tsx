import React, { StrictMode, useEffect } from 'react';
import { UserProvider } from './app/contexts/UserContext';
import Navigation from './app/Navigation';
import { StatusBar } from 'react-native';

export default function App() {
  useEffect(() => {
    console.log('App mounted');
  }
    , []);
  return (
    <UserProvider>
      <StatusBar barStyle="light-content" />
      <Navigation />
    </UserProvider>

  );
}
