import React from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View,StyleSheet, Text, StatusBar, TextInput,  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home'; 
import Settings from './Settings';
import Suivis from './Suivis';
import Messager from './Messager';
import CreateProfile from './CreateProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} {...props} />;
}



function Navigation(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeHandler" component={HomeHandler} options={{headerShown: false}} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function HomeHandler(){
  return (
    
    <Tab.Navigator   
    screenOptions={{
      //tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      //tabBarActiveBackgroundColor: Colors[colorScheme ?? "light"].tint,
      headerShown: false,
      tabBarStyle:{
        marginBottom: 10,
        position:'absolute',
        height:60,
        borderTopWidth: 0,
        backgroundColor:'#fff', 
        justifyContent:'space-between'
      },
      tabBarLabelPosition: "below-icon",
    }}>
      <Tab.Screen name="Home" component={Home} options={{ 
        headerShown: false,
        tabBarLabel: ({ focused }) => 
          focused ? <Text style={styles.tabtitle}>Accueil</Text> : null,
        tabBarIcon: ({ color }) =>
          <TabBarIcon name="home" color={color} /> 
      }} />
      <Tab.Screen name="Suivis" component={Suivis}  options={{ 
        headerShown: false,
        tabBarLabel: ({ focused }) => 
          focused ? <Text style={styles.tabtitle}>Suivis</Text> : null,
        tabBarIcon: ({ color }) => 
          <TabBarIcon name="book" color={color} /> 
      }}/>
      <Tab.Screen name="Messager" component={Messager}  options={{
        headerShown: false,
        tabBarLabel: ({ focused }) =>
          focused ? <Text style={styles.tabtitle}>Messagerie</Text> : null,
        tabBarIcon: ({ color }) => 
          <TabBarIcon name="envelope" color={color} /> 
      }}/>
      <Tab.Screen name="Settings" component={Settings}  options={{ 
        headerShown: false,
        tabBarLabel: ({ focused }) =>
          focused ? <Text style={styles.tabtitle}>Paramètres</Text> : null,
        tabBarIcon: ({ color }) => 
          <TabBarIcon name="gear" color={color} />, 
      }}/>
    </Tab.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  tabtitle: {
    fontSize: 16,
    fontWeight: '600',
        marginTop:-10,
  },
});

