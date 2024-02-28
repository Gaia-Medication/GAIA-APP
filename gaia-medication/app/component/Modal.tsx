import React from "react";
import { TouchableOpacity, ScrollView, View } from "react-native";
import { Modal, Portal } from "react-native-paper";

const ModalComponent = ({ visible, onClose, children, styleAdded = {} }) => {
  return (
    <Portal>
      <Modal
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
          },
          styleAdded,
        ]}
      >
        <View
          className="my-3 w-full "
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalComponent;
