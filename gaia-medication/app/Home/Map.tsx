import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Linking,
  Pressable,
} from "react-native";
import MapView, { MapType, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPoints, getPointsbyRegion } from "../../dao/MapPoint";
import ModalComponent from "../component/Modal";
import { styles } from "../../style/style";
import MapModalComponent from "../component/MapModal";
import TutorialBubble from "../component/TutorialBubble";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDoctorbyRegion } from "../../dao/Doctor";

export default function Map({ navigation }) {
  const initialRegion = {
    latitude: 47.200819319828305,
    latitudeDelta: 0.05,
    longitude: -1.5608386136591434,
    longitudeDelta: 0.05,
  };
  const standardMapType = [
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];
  const isFocused = useIsFocused();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState(initialRegion);
  const [points, setPoints] = useState(getPointsbyRegion(region));
  const [medecin, setMedecin] = useState([]);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMedModalVisible, setIsMedModalVisible] = useState(false);
  const [selectedPoint, setSelectedpoint] = useState(null);

  const markerIcons = {
    Pharmacie: require("./../../assets/map-icons/pharma.png"),
    Centre: require("./../../assets/map-icons/hopital.png"),
    Etablissement: require("./../../assets/map-icons/clinique.png"),
    Maison: require("./../../assets/map-icons/maison_de_sante.png"),
    satelite: require("./../../assets/map-icons/satelite.png"),
    map: require("./../../assets/map-icons/map.png"),
    medical: require("./../../assets/map-icons/medical-team.png"),
  };
  const colorOf = {
    Pharmacie: "25, 170, 147",
    Centre: "254, 135, 88",
    Etablissement: "1, 94, 210",
    Maison: "0, 236, 156",
  };

  const openModal = (point: any) => {
    setIsModalVisible(true);
    setSelectedpoint(point);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };
  const openMedModal = () => {
    setIsMedModalVisible(true);
  };
  const closeMedModal = () => {
    setIsMedModalVisible(false);
  };
  const contact = () => {
    if (selectedPoint.phone) {
      Linking.openURL(`tel:${selectedPoint.phone}`);
    } else {
      console.log("No phone number");
    }
  };
  const modalContent = selectedPoint ? (
    <View>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.modalTitle}>
        {selectedPoint.Name}
      </Text>
      <Text style={styles.modalType}>{selectedPoint.type}</Text>
      <Text>
        {selectedPoint.adress1} {selectedPoint.adress2} {selectedPoint.adress3}
      </Text>
      <Text>{selectedPoint.city}</Text>
      {selectedPoint.phone != null ? (
        <TouchableOpacity onPress={contact}>
          <Text
            className=" font-bold"
            style={{
              color:
                "rgba(" + colorOf[selectedPoint?.type.split(" ")[0]] + ",0.8)",
            }}
          >
            Contacter
          </Text>
        </TouchableOpacity>
      ) : (
        <Text>Pas de numéro de téléphone 🙁</Text>
      )}
    </View>
  ) : null;

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
    newPoints && setMedecin(getDoctorbyRegion(newPoints));
    setPoints(newPoints);
  }, [region]);

  const [tutoMap, setTutoMap] = useState(null);

  useEffect(() => {
    tuto();
  });

  const tuto = async () => {
    setTutoMap(await AsyncStorage.getItem("TutoMap"));
  };

  const handleTuto = (isClicked) => {
    AsyncStorage.setItem("TutoMap", "1");
    navigation.navigate("Settings");
  };

  return (
    <View>
      {tutoMap === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "70%", left: "5%" }}
          text={
            "Voici la page de la carte où vous pouvez retrouver les établissements\nde santé proche de chez vous, 1/1"
          }
        ></TutorialBubble>
      )}
      <MapView
        ref={(map) => (this.map = map)}
        style={{ width: "100%", height: "100%" }}
        initialRegion={initialRegion}
        onRegionChangeComplete={(region, gesture) => setRegion(region)}
        customMapStyle={standardMapType}
        toolbarEnabled={false}
        showsUserLocation={currentLocation != null}
        provider={PROVIDER_GOOGLE}
      >
        {points &&
          points.map((point) => {
            const getIcon = markerIcons[point.type.split(" ")[0]];
            return (
              <Marker
                key={point.id}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                tracksViewChanges={false}
                onPress={() => openModal(point)}
              >
                <Image source={getIcon} style={{ width: 25, height: 25 }} />
              </Marker>
            );
          })}
      </MapView>
      <TouchableOpacity style={{ position: 'absolute', top: 15, left: 15 }}
                onPress={() => openMedModal()}>
        <View style={{ backgroundColor: 'white', padding: 8, borderRadius: 5, opacity:0.8 }}>
          <Image source={markerIcons.medical}  style={{ width: 40, height: 40 }} />
        </View>
      </TouchableOpacity>
      <MapModalComponent
        visible={isModalVisible}
        onClose={closeModal}
        children={modalContent}
        icon={markerIcons[selectedPoint?.type.split(" ")[0]]}
        color={colorOf[selectedPoint?.type.split(" ")[0]]}
      />
      <ModalComponent
        visible={isMedModalVisible}
        onClose={closeMedModal}
        styleAdded={{
          backgroundColor: "white",
          borderRadius: 10,
          paddingHorizontal: 20,
          width: "80%",
          maxHeight: "60%",
        }}
      >
        <View className="w-full py-5">
          <Text>Médecins à proximité</Text>
          {medecin.map((item, index)=>{
            return(
              <View key={index}>
                <Text>{
                  item.Prenom
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
                    .toLowerCase() 
                    .replace(/^\w/, (c) => c.toUpperCase()) 
                } {
                  item.Nom
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
                    .toLowerCase() 
                    .replace(/^\w/, (c) => c.toUpperCase()) 
                }</Text>
                <Text className=" text-xs"> {item.CodePostal}</Text>
                
              </View>
            )
          } )}
        </View>
        <TouchableOpacity
              onPress={() => {
                closeMedModal();
              }}
            >
              <Text className="text-red-500">Fermer</Text>
            </TouchableOpacity>
      </ModalComponent>
    </View>
  );
}
