import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  StatusBar,
} from "react-native";
import { styles } from "../../../style/style";
import { LinearGradient } from "expo-linear-gradient";
import * as Icon from "react-native-feather";

export default function MapPoint({ route, navigation }) {
  const { selectedPoint } = route.params;
  const contact = () => {
    if (selectedPoint.phone) {
      Linking.openURL(`tel:${selectedPoint.phone}`);
    } else {
      console.log("No phone number");
    }
  };
  const markerIcons = {
    Pharmacie: require("../../../assets/map-icons/illupharmacy.png"),
    Centre: require("../../../assets/map-icons/illuhospital.png"),
    Etablissement: require("../../../assets/map-icons/illuprivhospital.png"),
    Maison: require("../../../assets/map-icons/illuclinical.png"),
  };
  const colorOf = {
    Pharmacie: "25, 170, 147",
    Centre: "254, 135, 88",
    Etablissement: "1, 94, 210",
    Maison: "0, 236, 156",
  };
  const icon = markerIcons[selectedPoint?.type.split(" ")[0]];
  return (
    <SafeAreaView className=" flex bg-white w-full h-full dark:bg-[#131f24]">
      {selectedPoint && (
        <>
          <StatusBar
            barStyle={"dark-content"}
            translucent={true}
            backgroundColor={"transparent"}
          />
          <View className="w-full h-60">
            <LinearGradient
              colors={[
                `rgba(${colorOf[selectedPoint?.type.split(" ")[0]]},0.4)`,
                `rgba(${colorOf[selectedPoint?.type.split(" ")[0]]},1)`,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.4, y: 1 }}
              style={{ flex: 1 }}
            />
            
            <View className=" absolute top-10 left-6">
              <Icon.ArrowLeft
                color={"#363636"}
                onPress={() => navigation.goBack()}
              />
            </View>
            
            <View className="absolute bottom-6 left-1/2 -translate-x-16">
                <Image className="w-32 h-32" source={markerIcons[selectedPoint?.type.split(" ")[0]]}/>
            </View>
          </View>
          <View className="p-6">
            <Text className="dark:text-slate-50">{selectedPoint.Name}</Text>
            <Text className="dark:text-slate-50">{selectedPoint.type}</Text>
            <Text className="dark:text-slate-50">
              {selectedPoint.adress1} {selectedPoint.adress2}{" "}
              {selectedPoint.adress3}
            </Text>
            <Text className="dark:text-slate-50">{selectedPoint.city}</Text>
            {selectedPoint.phone != null ? (
              <TouchableOpacity onPress={contact}>
                <Text
                  className=" font-bold"
                  style={{
                    color:
                      "rgba(" +
                      colorOf[selectedPoint?.type.split(" ")[0]] +
                      ",0.8)",
                  }}
                >
                  Contacter
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="dark:text-slate-50">
                Pas de numéro de téléphone 🙁
              </Text>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
