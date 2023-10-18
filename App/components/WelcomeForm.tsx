import React from 'react';
import { Alert, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';


export default function WelcomeScreen() {
    return (
      <View>
        <View style={styles.getStartedContainer}>
          <TextInput 
            style={styles.inputs}
            placeholder='Email'
          />
  
          <TextInput 
            style={styles.inputs}
            placeholder='Password'
          />

          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('TRY TO CONNECT')}>
            <Text>Press Here</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.helpContainer}>
          <ExternalLink
            style={styles.helpLink}
            href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
            <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
              Tap here if your app doesn't automatically update after making changes
            </Text>
          </ExternalLink>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    getStartedContainer: {
      alignItems: 'center',
      marginHorizontal: 50,
      gap: 25
    },
    homeScreenFilename: {
      marginVertical: 7,
    },
    codeHighlightContainer: {
      borderRadius: 3,
      paddingHorizontal: 4,
    },
    getStartedText: {
      fontSize: 17,
      lineHeight: 24,
      textAlign: 'center',
    },
    helpContainer: {
      marginTop: 15,
      marginHorizontal: 20,
      alignItems: 'center',
    },
    helpLink: {
      paddingVertical: 15,
    },
    helpLinkText: {
      textAlign: 'center',
    },
    inputs: {
        width: '80%',
        borderColor: '#D3D3D3',
        borderWidth: 2,
        borderRadius: 8,
        padding: 4,
        paddingLeft: 8
    },
    button: {
        width: '65%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center'
    }
  });