import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from "./Home/Home";
import Settings from "./Home/Settings";
import Suivis from "./Suivis/Suivis";
import Messager from "./Home/Messager";
import CreateProfile from "./Profile/CreateProfile";
import Stock from "./Suivis/Stock";
import Journal from "./Suivis/Journal";
import Profile from "./Profile/Profile";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} {...props} />;
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="HomeHandler"
          component={HomeHandler}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeHandler() {
  return (
    <BottomTab.Navigator
      screenOptions={{
       // tabBarActiveTintColor: "",
        //tabBarActiveBackgroundColor: "",
        headerShown: false,
        tabBarStyle: {
          marginBottom: 10,
          position: "absolute",
          height: 60,
          borderTopWidth: 0,
          backgroundColor: "#fff",
          justifyContent: "space-between",
        },
        tabBarLabelPosition: "below-icon",
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) =>
            focused ? <Text style={styles.tabtitle}>Accueil</Text> : null,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="SuivisHandler"
        component={SuivisHandler}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) =>
            focused ? <Text style={styles.tabtitle}>Suivis</Text> : null,
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Messager"
        component={Messager}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) =>
            focused ? <Text style={styles.tabtitle}>Messagerie</Text> : null,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="envelope" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) =>
            focused ? <Text style={styles.tabtitle}>Paramètres</Text> : null,
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function SuivisHandler() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Suivis" component={Suivis} />
      <TopTab.Screen name="Stock" component={Stock} />
      <TopTab.Screen name="Journal" component={Journal} />
    </TopTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: -10,
  },
});
