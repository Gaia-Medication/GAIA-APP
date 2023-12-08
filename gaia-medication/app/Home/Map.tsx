import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Map() {
  const isFocused = useIsFocused();
  const [currentLocation, setCurrentLocation] = useState(null);
  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Map Page");
      const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
        const animateToCoordinat = (lat, long) => {
          this.map.animateCamera({
            center: {
              latitude: lat,
              longitude: long,
            },
            duration: 1000,
          });
        };
        animateToCoordinat(currentLocation.latitude, currentLocation.longitude);
      };

      getLocation();
    }
  }, [isFocused]);

  return (
    <View>
      <MapView
        ref={(map) => (this.map = map)}
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: 47.200819319828305,
          latitudeDelta: 0.2705200915647197,
          longitude: -1.5608386136591434,
          longitudeDelta: 0.18985044211149216,
        }}
        showsUserLocation={currentLocation}
      ></MapView>
    </View>
  );
}
