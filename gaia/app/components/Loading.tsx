import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import {BlurView} from 'expo-blur';

const Loading = () => {
  return (
    <View
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        flex: 1,
        zIndex: 10,
      }}
      className="px-0 bg-white w-full h-full dark:bg-[#131f24]"
    >
        <Image
          className=" object-cover h-24 w-48 self-center -mt-[50%]"
          source={require("../../assets/logo_title_gaia.png")}
        />
        <ActivityIndicator size={60} color="#9CDE00"/>
    </View>
  );
};

export default Loading;
