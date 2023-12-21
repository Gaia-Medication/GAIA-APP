import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text } from "react-native";

const ModalComponent = ({ visible, onClose, children, styleAdded }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styleAdded}>
          {children}
          <TouchableOpacity onPress={onClose}>
            <Text style={{ marginTop: 10, textAlign: "center", color: "blue" }}>
              Fermer
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalComponent;
