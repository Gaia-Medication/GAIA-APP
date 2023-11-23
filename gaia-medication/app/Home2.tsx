import React from 'react';
import { View, Text, Button } from 'react-native';

function Home2() {
  return (
    <View>
      <Text>Home Screen 2</Text>
      <Button
        title='Click Here'
        onPress={() => alert('Button Clicked!')}
      />
    </View>
  );
}

export default Home2;
