import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Text, ScrollView } from "react-native";

const ModalComponent = ({ visible, onClose, children, styleAdded }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1}
          onPress={null}
        >
          <ScrollView style={styleAdded}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          >
            {children}
          </ScrollView>
          
        </TouchableOpacity>
      
    </Modal>
  );
};

export default ModalComponent;
