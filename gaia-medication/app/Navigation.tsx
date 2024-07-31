import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "./Home/Home";
import Settings from "./Home/Settings";
import Suivis from "./Suivis/Suivis";
import Journal from "./Suivis/Journal";
import CreateProfile from "./Profile/CreateProfile";
import Stock from "./Home/Stock";
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
import { Provider } from "react-native-paper";
import Welcome from "./Profile/Welcome";
import { Image, View } from "react-native";
import { useColorScheme } from "nativewind";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

export default function Navigation() {
  return (
    <Provider>
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
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ModifyProfile"
            component={ModifyProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageTreatments"
            component={ManageTreatments}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTreatment"
            component={AddTreatment}
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
            options={{ headerShown: false }}
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
    </Provider>
  );
}

function HomeHandler() {
  const { colorScheme } = useColorScheme();
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#363636",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 90,
          borderTopWidth: 2,
          borderTopColor:colorScheme==="dark"?"#37464f":"#e5e5e5",
          backgroundColor: colorScheme==="dark"?"#131f24":"#FFFFFFAA",
          justifyContent: "space-around",
          width: "100%",
          shadowColor: "#fff",
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: 5,
                bottom: 5,
                padding: 8,
                borderWidth: 1,
                marginBottom: 10,
                borderColor: focused ? "#A0DB30" : "#A0DB3000",
                borderRadius: 15,
                backgroundColor: focused ? "#A0DB3050" : "#A0DB3000",
              }}
            >
              <Image
                className="w-9 h-9"
                source={require("../assets/home.png")}
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="SuivisHandler"
        component={SuivisHandler}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: 5,
                bottom: 5,
                padding: 8,
                borderWidth: 1,
                marginBottom: 10,
                borderColor: focused ? "#A0DB30" : "#A0DB3000",
                borderRadius: 15,
                backgroundColor: focused ? "#A0DB3050" : "#A0DB3000",
              }}
            >
              <Image
                className="w-9 h-9"
                source={require("../assets/suivis.png")}
              />
            </View>
          ),
        }}
      />

      <BottomTab.Screen
        name="Stock"
        component={Stock}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: 5,
                bottom: 5,
                padding: 8,
                borderWidth: 1,
                marginBottom: 10,
                borderColor: focused ? "#A0DB30" : "#A0DB3000",
                borderRadius: 15,
                backgroundColor: focused ? "#A0DB3050" : "#A0DB3000",
              }}
            >
              <Image
                className="w-9 h-9"
                source={require("../assets/pharmacy.png")}
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: 5,
                bottom: 5,
                padding: 8,
                borderWidth: 1,
                marginBottom: 10,
                borderColor: focused ? "#A0DB30" : "#A0DB3000",
                borderRadius: 15,
                backgroundColor: focused ? "#A0DB3050" : "#A0DB3000",
              }}
            >
              <Image
                className="w-9 h-9"
                source={require("../assets/map-icons/map.png")}
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: 5,
                bottom: 5,
                padding: 8,
                borderWidth: 1,
                marginBottom: 10,
                borderColor: focused ? "#A0DB30" : "#A0DB3000",
                borderRadius: 15,
                backgroundColor: focused ? "#A0DB3050" : "#A0DB3000",
              }}
            >
              <Image
                className="w-9 h-9"
                source={require("../assets/profile-icon/rapper.png")}
              />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function SuivisHandler() {
  const { colorScheme } = useColorScheme();
  return (
    <TopTab.Navigator screenOptions={{
      tabBarLabelStyle:{
        color: colorScheme==="dark"?"#fff":"#000",
      },
      tabBarIndicatorStyle:{
        backgroundColor:"#A0DB30"
      },
      tabBarStyle: {
        borderTopColor:colorScheme==="dark"?"#37464f":"#e5e5e5",
        backgroundColor: colorScheme==="dark"?"#131f24":"#FFFFFFAA",
      }
    }}>
      <TopTab.Screen name="Suivis" component={Suivis} />
      <TopTab.Screen name="Journal" component={Journal} />
    </TopTab.Navigator>
  );
}
