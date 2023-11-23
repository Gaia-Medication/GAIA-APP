import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './app/Home';
import Navigation from './app/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateProfile from './app/CreateProfile';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <Navigation />
    </View> 
      // <Stack.Navigator initialRouteName="Home">
      //   <Stack.Screen name="Home" component={Navigation} />
      //   <Stack.Screen name="Details" component={CreateProfile} />
      // </Stack.Navigator>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
   // justifyContent: 'center',
  },
});

