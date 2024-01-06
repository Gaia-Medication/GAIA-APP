import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, ScrollView } from "react-native";

const ModalComponent = ({ visible, onClose, children, styleAdded }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={null}
    >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1}
          onPress={null}
        >
          <ScrollView style={styleAdded}>
            {children}
          </ScrollView>
          
        </TouchableOpacity>
      
    </Modal>
  );
};

export default ModalComponent;
