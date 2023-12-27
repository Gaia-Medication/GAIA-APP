import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, Image } from 'react-native';
import { styles } from '../../style/style';

const MapModalComponent = ({ visible, onClose, children, icon, color }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={{backgroundColor: "white", width: "80%"}}>
          <View
            style={{
              backgroundColor: "rgba("+color+",0.8)",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: "flex-end",
              width: "100%",
              height: 40,
            }}
          ></View>
          <View style={{
            backgroundColor: "rgba("+color+",0.4)",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            width: "100%",
            padding: 20,
          }}>
          <Image source={icon} style={{ width: 50, height: 50, position: "absolute", top: -25, left: 25 }} />
            {children}
            <TouchableOpacity onPress={onClose} style={{
              backgroundColor: 'rgba(200, 0, 0, 0.4)' , 
              borderRadius: 10,
              width: "50%"
            }}>
              <Text style={{ margin: 10, textAlign: 'center', color: 'red', fontWeight: "bold", textAlignVertical: "center" }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>

      </TouchableOpacity>
    </Modal>
  );
};

export default MapModalComponent;
