import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "./Home/Home";
import Settings from "./Home/Settings";
import Suivis from "./Suivis/Suivis";
import CreateProfile from "./Profile/CreateProfile";
import Stock from "./Suivis/Stock";
import * as Icon from "react-native-feather";
import Search from "./Meds/Search";
import Drug from "./Meds/Drug";
import Map from "./Home/Map";
import AddTreatment from "./Suivis/AddTreatment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModifyProfile from "./Profile/ModifyProfile";
import NotificationsSettings from "./Home/Settings/NotificationsSettings";
import Notifications from "./Home/Notifications";
import AllergySelector from "./component/AllergySelector";
import ManageTreatments from "./Suivis/ManageTreatments";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ModifyProfile"
          component={ModifyProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddTreatment" component={AddTreatment} />
        <Stack.Screen name="ManageTreatments" component={ManageTreatments} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="NotificationsSettings" component={NotificationsSettings}/>
        <Stack.Screen name="UsersSettings" component={UsersSettings}/>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="AddTreatment"
          component={AddTreatment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationsSettings"
          component={NotificationsSettings}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="Drug"
          component={Drug}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeHandler() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#363636",
        tabBarActiveBackgroundColor: "#363636",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 80,
          borderTopWidth: 0,
          backgroundColor: "#FFFFFFAA",
          justifyContent: "space-between",
          width: "90%",
          borderRadius: 30,
          shadowColor: "#fff",
        },
        tabBarIconStyle: {
          color: "#fff",
        },
        tabBarItemStyle: {
          top: 15,
          bottom: 15,
          height: "61%",
          borderRadius: 50,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <Icon.Home color={color} />,
        }}
      />
      <BottomTab.Screen
        name="SuivisHandler"
        component={SuivisHandler}
        options={{
          tabBarIcon: ({ color }) => <Icon.Package color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: ({ color }) => <Icon.Map color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => <Icon.Settings color={color} />,
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
    </TopTab.Navigator>
  );
}
