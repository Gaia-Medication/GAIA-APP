import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { ArrowRight } from "react-native-feather";

// COMPOSANT POUR AFFICHER DES BULLES DE TUTORIEL
const TutorialBubble = ({ styleAdded, text, isClicked }) => {
  const [isVisble, setIsVisble] = useState(true);

  return (
    <>
      {isVisble && (
        <Modal
          visible={isVisble}
          transparent={true}
          animationType="fade"
          style={{ width: "100%" }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#ffffffCC", 
              zIndex: 9, 
            }}
          ></View>
          <View className="absolute" style={styleAdded}>
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
          </View>
        </Modal>
      )}
    </>
  );
};

export default TutorialBubble;
