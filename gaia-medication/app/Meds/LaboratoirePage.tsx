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
import { getAllMedsOfLab, getPAfromMed } from "../../dao/Meds";
import { styles } from "../../style/style";
import MedIconByType from "../component/MedIconByType";
import { useIsFocused } from "@react-navigation/native";

export default function Laboratoire({ route, navigation }) {
  const { labo, user } = route.params;
  const [labMeds, setLabMeds] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Lab Page :", labo);
      setLabMeds(getAllMedsOfLab(labo));
    }
  }, [isFocused]);
  return (
    <SafeAreaView className=" flex bg-white w-full h-full dark:bg-[#131f24]">
      {labo && (
        <>
          <StatusBar
            barStyle={"dark-content"}
            translucent={true}
            backgroundColor={"transparent"}
          />
          <View className="w-full h-60">
            <LinearGradient
              colors={[`#fff`, `#c0c0c0`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.6, y: 1 }}
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
                source={require("../../assets/labo.png")}
              />
            </View>
          </View>

          <Text className=" dark:text-slate-50 pb-2 px-6 w-full text-center">
            {labo}
          </Text>

          <FlatList
            data={labMeds}
            className=" "
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.listItem}
                  className="flex justify-start align-middle border-b-[#e5e5e5] dark:border-b-[#37464f]"
                  onPress={() => {
                    navigation.push("Drug", { drugCIS: item.CIS });
                  }}
                >
                  <MedIconByType type={item.Shape} />
                  <View className="ml-4 flex-1 flex-row justify-between items-center">
                    <Text className=" dark:text-slate-50 flex-1 text-xs">
                      {item.Name}
                    </Text>
                    {user.preference
                      .map((allergie) =>
                        Array.from(getPAfromMed(item.CIS)).includes(allergie)
                      )
                      .some((bool) => bool) && (
                      <View className=" items-center">
                        <Image
                          className={"h-5 w-5 ml-1"}
                          source={require("../../assets/allergy.png")}
                        />
                        <Text className=" dark:text-slate-50 ml-2 text-red-500 font-bold text-xs">
                          Allergie
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

