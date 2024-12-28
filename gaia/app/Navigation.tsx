import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Icon from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-native-paper";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Home from "./views/home/Home";
import Suivis from "./views/treatment/Suivis";
import Journal from "./views/treatment/Journal";
import CreateProfile from "./views/profile/CreateProfile";
import Welcome from "./views/profile/Welcome";
import ModifyProfile from "./views/profile/ModifyProfile";
import ManageTreatments from "./views/treatment/ManageTreatments";
import DrugsTreatment from "./views/treatment/AddTreatment/DrugsTreatment";
import CreateTreatment from "./views/treatment/AddTreatment/CreateTreatment";
import CreateInstruction from "./views/treatment/AddTreatment/CreateInstruction";
import QuantitiesInstruction from "./views/treatment/AddTreatment/QuantitiesInstruction";
import Notifications from "./views/home/Notifications";
import NotificationsSettings from "./views/home/Settings/NotificationsSettings";
import Drug from "./views/medication/Drug";
import Search from "./views/medication/Search";
import Atc from "./views/medication/AtcPage";
import Laboratoire from "./views/medication/LaboratoirePage";
import MapPoint from "./views/home/MapPages/MapPointPage";
import AvatarChange from "./views/home/Settings/AvatarChange";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

export default function Navigation() {
  const { setColorScheme } = useColorScheme();
  const [themeSet, setThemeSet] = useState(false);
  const initTheme = async () => {
    const theme = await AsyncStorage.getItem("darkmode");
    setColorScheme(theme == "dark" ? "light" : "dark");
    setThemeSet(true);
    //console.log("Init Theme : " + theme == "dark" ? "light" : "dark");
  };
  useEffect(() => {
    !themeSet && initTheme();
  }, []);
  return (
    <Provider>
      {themeSet && (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="HomeHandler"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="HomeHandler" component={HomeHandler} />
            <Stack.Screen name="CreateProfile" component={CreateProfile} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="ModifyProfile" component={ModifyProfile} />
            <Stack.Screen
              name="ManageTreatments"
              component={ManageTreatments}
            />
            <Stack.Screen name="CreateTreatment" component={CreateTreatment} />
            <Stack.Screen name="DrugsTreatment" component={DrugsTreatment} />
            <Stack.Screen name="CreateInstruction" component={CreateInstruction} />
            <Stack.Screen name="QuantitiesInstruction" component={QuantitiesInstruction} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen
              name="NotificationsSettings"
              component={NotificationsSettings}
            />
            <Stack.Screen name="Drug" component={Drug} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="AtcPage" component={Atc} />
            <Stack.Screen name="LaboratoirePage" component={Laboratoire} />
            <Stack.Screen name="MapPointPage" component={MapPoint} />
            <Stack.Screen
              name="AvatarChange"
              component={AvatarChange}
              options={{
                animation: "fade",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </Provider>
  );
}

function HomeHandler() {
  return (
    <BottomTab.Navigator
      // screenOptions={{
      //   tabBarActiveTintColor: "#fff",
      //   tabBarInactiveTintColor: "#363636",
      //   tabBarActiveBackgroundColor: "#363636",
      //   headerShown: false,
      //   tabBarShowLabel: false,
      //   tabBarItemStyle: {
      //     height: "80%",
      //     margin: 10,
      //     borderRadius: 20,
      //   },
      //   tabBarItemSelectedStyle: {
      //     borderRadius: 20,
      //   },
      //   tabBarStyle: {
      //     position: "absolute",
      //     height: "12%",
      //     borderTopWidth: 0,
      //     backgroundColor: "#111111FF",
      //     width: "100%",
      //     borderRadius: 30,
      //     shadowColor: "#fff",
      //     display: "flex",
      //     flexDirection: "row",
      //     alignItems: "center",
      //     justifyContent: "center",
      //   },
      //   tabBarIconStyle: {
      //     color: "#fff",
      //   },
      // }}
      screenOptions={{
        tabBarInactiveTintColor: "#363636",
        tabBarInactiveBackgroundColor: "#111111FF",
        tabBarActiveTintColor: "#fff",
        tabBarActiveBackgroundColor: "#111111FF",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 120,
          borderTopWidth: 0,
          backgroundColor: "#111111FF",
          width: "100%",
          borderRadius: 30,
          shadowColor: "#fff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarItemStyle: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          margin: 10,
          backgroundColor: "#fff",
          borderRadius: 20,
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
    </BottomTab.Navigator>
  );
}

function SuivisHandler() {
  const { colorScheme } = useColorScheme();
  return (
    <SafeAreaView className="flex bg-white w-full h-full dark:bg-grey-100">
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            color: colorScheme === "dark" ? "#fff" : "#000",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#9CDE00",
          },
          tabBarStyle: {
            borderTopColor: colorScheme === "dark" ? "#37464f" : "#e5e5e5",
            backgroundColor: colorScheme === "dark" ? "#131f24" : "#FFFFFF",
          },
        }}
      >
        <TopTab.Screen name="Suivis" component={Suivis} />
        <TopTab.Screen name="Journal" component={Journal} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
}
