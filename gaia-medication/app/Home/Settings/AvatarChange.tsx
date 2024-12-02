import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Icon from "react-native-feather";
import { useIsFocused } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "nativewind";
import Suivis from "../../Suivis/Suivis";
import Journal from "../../Suivis/Journal";
import { updateItemInList } from "../../../dao/Storage";

const TopTab = createMaterialTopTabNavigator();

export const avatars = {
  man: require("./../../../assets/profile-icon/man.png"),
  woman: require("./../../../assets/profile-icon/woman.png"),
  oldman: require("./../../../assets/profile-icon/oldman.png"),
  alien: require("./../../../assets/profile-icon/alien.png"),
  devil: require("./../../../assets/profile-icon/devil.png"),
  knight: require("./../../../assets/profile-icon/knight.png"),
  ninja: require("./../../../assets/profile-icon/ninja.png"),
  rapper: require("./../../../assets/profile-icon/rapper.png"),
};

export default function AvatarChange({ route, navigation }) {
  const { user } = route.params
  const [newAvatar, setNewAvatar] = useState(user.avatar ? user.avatar : "man");
  const [newBgColor, setNewBgColor] = useState(
    user.bgcolor ? user.bgcolor : "#ffeea1"
  );
  const { colorScheme } = useColorScheme();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on AvatarChange Page");
    }
  }, [isFocused]);

  const applyChange = ()=> {
    const newUser= user
    newUser.bgcolor=newBgColor
    newUser.avatar=newAvatar
    console.log(newUser)
    updateItemInList("users",newUser.id-1,newUser)
    navigation.goBack()
  }

  function Avatar({ route, navigation }) {
    return (
      <SafeAreaView className=" flex-row flex-wrap justify-start bg-white w-full h-full dark:bg-[#131f24]">
        {Object.keys(avatars).map((item) => (
          <TouchableOpacity
            className="m-4 w-10 h-10 "
            onPress={() => setNewAvatar(item)}
          >
            <Image className="w-10 h-10" source={avatars[item]} />
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    );
  }

  function IconBgColor({ route, navigation }) {
    return (
      <SafeAreaView className="flex-row flex-wrap justify-start bg-white w-full h-full dark:bg-[#131f24]">
        {/* POUR TEST EN ATTENDANT */}
        <TouchableOpacity
          className="m-4 w-10 h-10 bg-[#ffeea1]"
          onPress={() => setNewBgColor("#ffeea1")}
        ></TouchableOpacity>
        <TouchableOpacity
          className="m-4 w-10 h-10 bg-[#7ff2ff]"
          onPress={() => setNewBgColor("#7ff2ff")}
        ></TouchableOpacity>
        <TouchableOpacity
          className="m-4 w-10 h-10 bg-[#73ff60]"
          onPress={() => setNewBgColor("#73ff60")}
        ></TouchableOpacity>
        <TouchableOpacity
          className="m-4 w-10 h-10 bg-[#ff6060]"
          onPress={() => setNewBgColor("#ff6060")}
        ></TouchableOpacity>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className=" flex bg-white w-full h-full dark:bg-[#131f24]">
      <StatusBar barStyle="dark-content" backgroundColor={newBgColor} />
      <View
        className="w-full h-52 overflow-hidden"
        style={{ backgroundColor: newBgColor }}
      >
        <View className=" absolute top-4 left-6">
          <Icon.ArrowLeft
            color={"#363636"}
            onPress={() => navigation.goBack()}
          />
        </View>
        {(newAvatar != user.avatar || newBgColor != user.bgcolor) && (
          <TouchableOpacity className="p-2" onPress={()=>applyChange()}>
            <Text className="absolute top-4 right-6 text-lg font-bold text-[#363636]">
              Done
            </Text>
          </TouchableOpacity>
        )}

        <View className="absolute -bottom-1 left-1/2 -translate-x-24">
          <Image className="w-48 h-48" source={avatars[newAvatar]} />
        </View>
      </View>

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
        <TopTab.Screen name="Avatar" component={Avatar} />
        <TopTab.Screen name="Fond" component={IconBgColor} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
}
