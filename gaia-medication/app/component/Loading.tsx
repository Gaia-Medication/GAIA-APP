import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import {BlurView} from 'expo-blur';

const Loading = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        flex: 1,
        zIndex: 10,
      }}
      className="px-0"
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
