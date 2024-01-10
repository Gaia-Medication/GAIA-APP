import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { ArrowRight } from "react-native-feather";

const TutorialBubble = ({ styleAdded, text, isClicked }) => {
  const [isVisble, setIsVisble] = useState(true);

  return (
    <View className="absolute" style={styleAdded}>
      {isVisble && (
        <TouchableOpacity
          className=" flex flex-row items-end p-4 bg-lime-400 rounded-3xl z-10"
          onPress={() => {
            setIsVisble(false);
            isClicked(true);
          }}
        >
          <Text className="text-white text-sm">{text}</Text>
          <ArrowRight stroke="white" width={24} height={24}></ArrowRight>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TutorialBubble;
