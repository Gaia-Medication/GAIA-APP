import React from "react";
import { TouchableOpacity, ScrollView, View } from "react-native";
import { Modal, Portal } from "react-native-paper";

const ModalComponent = ({ visible, onClose, children, styleAdded = {} }) => {
  return (
    <Portal>
      <Modal
        theme={{
          colors: {
            backdrop: '#ffffffCC',
          },
        }}
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[
          {
            backgroundColor: "white",
            borderRadius: 10,
            width: "80%",
            maxHeight: "60%",
            marginBottom: "5%",
            alignSelf: "center",
            shadowColor: "#000", // This sets the color of the shadow
            shadowOffset: {
              width: 0, // This sets the horizontal distance of the shadow
              height: 0, // This sets the vertical distance of the shadow
            },
            shadowOpacity: 0.25, // This sets the transparency of the shadow
            shadowRadius: 3.84, // This sets the blur radius of the shadow
            elevation: 5, // This is for Android shadow effect
          },
          styleAdded,
        ]}
      >
        <View
          className="my-3 w-full dark:bg-[#131f24]"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalComponent;
