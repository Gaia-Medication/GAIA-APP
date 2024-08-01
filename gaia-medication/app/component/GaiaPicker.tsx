import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const GaiaPicker = ({ items, selectedValue, onValueChange, placeholder, width }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectItem = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.pickerButton, width]} className="bg-grey-300">
        <Text style={selectedValue ? styles.pickerButtonText : styles.placeholder} className='uppercase'>
          {selectedValue ? items.find(item => item.value === selectedValue).label : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <SafeAreaView style={styles.modalContainer} className='backdrop-blur-md'>
          <View style={styles.modalContent} >
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelectItem(item.value)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  pickerButton: {
    position: 'relative',
    justifyContent: 'center',
    width: "auto",
    height: 40,
    borderRadius: 20,
  },
  pickerButtonText: {
    padding: 6,
    fontSize: 20,
    height: 40,
    marginLeft: 10,
    zIndex: 1,
    color: '#fff',
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  placeholder: {
    position: 'absolute',
    left: 20,
    fontSize: 20,
    zIndex: 2,
    fontWeight: "600",
    color: '#888',
    width: "auto"
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default GaiaPicker;
