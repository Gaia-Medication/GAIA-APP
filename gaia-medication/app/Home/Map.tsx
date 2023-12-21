import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import MapView, { MapType, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPoints, getPointsbyRegion } from "../../dao/MapPoint";

export default function Map() {
  const initialRegion={
    latitude: 47.200819319828305,
    latitudeDelta: 0.2705200915647197,
    longitude: -1.5608386136591434,
    longitudeDelta: 0.18985044211149216,
  }
  const standardMapType=[
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
  const isFocused = useIsFocused();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState(initialRegion);
  const [points, setPoints] = useState(getPointsbyRegion(region));
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
        animateToCoordinat(location.coords.latitude, location.coords.longitude);
      };

      getLocation();
    }
  }, [isFocused]);

  useEffect(() => {
    const newPoints = getPointsbyRegion(region);
    setPoints(newPoints);
  }, [region]);

  return (
    <View>
      <MapView
        ref={(map) => (this.map = map)}
        style={{ width: "100%", height: "100%" }}
        initialRegion={initialRegion}
        onRegionChangeComplete={(region) => setRegion(region)}
        customMapStyle={standardMapType}
        //showsUserLocation={currentLocation}
      >
        {points &&
          points.map((point) => {
            if (point.type == "Pharmacie d'Officine" || point.type == "Pharmacie Mutualiste") {
                return (
                  <Marker
                    key={point.id}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }}
                    title={point.Name}
                    description={"description"}
                  >
                    <Image source={require("./../../assets/map-icons/pharma.png")} style={{ width: 25, height: 25 }} />
                  </Marker>
                );
            }
            console.log(point.Name);
            return (
              <Marker
                key={point.id}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                title={point.Name}
                description={"description"}
              />
            );
          })}
      </MapView>
      <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20 }}>
        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
          <Image source={require('./../../assets/map-icons/satelite.png')} style={{ width: 40, height: 40 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
function setMapType(arg0: string) {
  throw new Error("Function not implemented.");
}

