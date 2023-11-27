import React, { useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const AvatarButton = () => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(50));

  const toggleExpansion = () => {
    if (expanded) {
      Animated.spring(animation, {
        toValue: 50,
        useNativeDriver: false, // You can set this to true if you use 'react-native-reanimated'.
      }).start();
    } else {
      Animated.spring(animation, {
        toValue: 200, // You can adjust this value to control the expansion level.
        useNativeDriver: false, // You can set this to true if you use 'react-native-reanimated'.
      }).start();
    }
    setExpanded(!expanded);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity onPress={toggleExpansion}>
        <Animated.View
          style={{
            width: animation,
            height: 50,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: "grey",
          }}
        >
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default AvatarButton;
