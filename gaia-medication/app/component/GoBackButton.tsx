import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "react-native-feather";

const GoBackButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      className="absolute top-1 flex justify-center items-center w-[80px] h-[80px] z-10"
      onPress={() => {
        navigation.goBack();
      }}
    >
      <ArrowLeft height={30} width={30} color={"#4296E4"}></ArrowLeft>
    </TouchableOpacity>
  );
};

export default GoBackButton;