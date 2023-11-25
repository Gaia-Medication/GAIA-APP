import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import callGoogleVisionAsync from '../OCR/helperFunctions';
    


export default function Scan() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("Please add an image");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true, //return base64 data.
      //this will allow the Vision API to read this image.
    });
    if (!result.canceled) { //if the user submits an image,
      setImage(result.assets[0].uri);
      //run the onSubmit handler and pass in the image data. 
      const googleText = await callGoogleVisionAsync(result.assets[0].base64);
      setText(googleText.text); //change the value of this Hook again.
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Text>{text}</Text>
    </View>
  );
}
