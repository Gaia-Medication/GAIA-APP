import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {BlurView} from 'expo-blur';

const Loading = () => {
  return (
    <BlurView
      intensity={20}
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        flex: 1,
      }}
      className="px-0"
    >
        <ActivityIndicator size="large" />
    </BlurView>
  );
};

export default Loading;
