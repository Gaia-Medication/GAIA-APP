import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { Modal } from 'react-native-paper';

const MapModalComponent = ({ visible, onClose, children, icon, color }) => {
  return (
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
          justifyContent: 'center', alignItems: 'center', 
        }
      ]}
    >
        <View className=' rounded-[20px]' style={{backgroundColor: "white", width: "80%"}}>
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
          </View>
        </View>

    </Modal>
  );
};

export default MapModalComponent;
