import React from "react";
import { SafeAreaView, StatusBar, View, Image, Text } from "react-native";
import * as Icon from "react-native-feather";
import { LinearGradient } from "expo-linear-gradient";

export default function Atc({ route, navigation }) {
    const {significationATC}= route.params
    return(
        <SafeAreaView className=" flex bg-white w-full h-full dark:bg-[#131f24]">
            <StatusBar
            barStyle={"dark-content"}
            translucent={true}
            backgroundColor={"transparent"}
          />
          <View className="w-full h-60">
            <LinearGradient
              colors={[`#78DAD6`, `#781cef`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.6, y: 1.5 }}
              style={{ flex: 1 }}
            />

            <View className=" absolute top-10 left-6">
              <Icon.ArrowLeft
                color={"#363636"}
                onPress={() => navigation.goBack()}
              />
            </View>

            <View className="absolute bottom-6 left-1/2 -translate-x-16">
              <Image
                className="w-32 h-32"
                source={require("../../assets/layers.png")}
              />
            </View>
          </View>
            <View className="w-full pb-2 px-6 dark:bg-[#131f24]">
              <Text className=" dark:text-slate-50 pb-2">
                Signification du code ATC
              </Text>
              {significationATC.map((item, index) => (
                <Text className=" dark:text-slate-50  text-xs" key={index}>
                  {index + 1} - {item}
                </Text>
              ))}
            </View>
            
        </SafeAreaView>
    )
}