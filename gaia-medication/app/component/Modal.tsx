import React from "react";
import { Modal, TouchableOpacity, ScrollView } from "react-native";

const ModalComponent = ({ visible, onClose, children, styleAdded }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      style={{ width: '100%' }}
    >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
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
