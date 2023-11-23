import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './app/Home/Home';
import Navigation from './app/Navigation';



export default function App() {
  return (
    <View style={styles.container}>
      <Navigation />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    //alignItems: 'center',
   // justifyContent: 'center',
  },
});

