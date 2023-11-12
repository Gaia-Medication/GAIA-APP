import { StyleSheet } from 'react-native';

import { Text, View } from '../../../components/Themed';
import React from 'react';

export default function SuivisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
