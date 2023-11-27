import React, { useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

interface AvatarButtonProps {
  onPress: () => void;
}

const AvatarButton: React.FC<AvatarButtonProps> = ({ onPress }) => {  
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(50));

  const toggleExpansion = () => {
    if (expanded) {
      Animated.spring(animation, {
        toValue: 50,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animation, {
        toValue: 350,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
    onPress();
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
        ></Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default AvatarButton;
