import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import MapView, {
  LocalTile,
  MapType,
  Marker,
  PROVIDER_GOOGLE,
  UrlTile,
} from "react-native-maps";
import { getPointsbyRegion } from "../../../data/MapPoint";
import ModalComponent from "../../components/Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDoctorbyRegion } from "../../../data/Doctor";
import { useColorScheme } from "nativewind";

export default function Map({ navigation }) {
  const initialRegion = {
    latitude: 47.200819319828305,
    latitudeDelta: 0.05,
    longitude: -1.5608386136591434,
    longitudeDelta: 0.05,
  };
  const isFocused = useIsFocused();
  const { colorScheme } = useColorScheme();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [onCurrentLocation, setOnCurrentLocation] = useState(false);
  const [region, setRegion] = useState(initialRegion);
  const [points, setPoints] = useState(getPointsbyRegion(region));
  const [medecin, setMedecin] = useState([]);
  const [isMedModalVisible, setIsMedModalVisible] = useState(false);

  const markerIcons = {
    Pharmacie: require("./../../../assets/map-icons/pharma.png"),
    Centre: require("./../../../assets/map-icons/hopital.png"),
    Etablissement: require("./../../../assets/map-icons/clinique.png"),
    Maison: require("./../../../assets/map-icons/maison_de_sante.png"),
    map: require("./../../../assets/map-icons/map.png"),
    medical: require("./../../../assets/medical-team.png"),
  };

  const openMedModal = () => {
    setIsMedModalVisible(true);
  };
  const closeMedModal = () => {
    setIsMedModalVisible(false);
  };

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
        if (!onCurrentLocation) {
          const animateToCoordinat = (lat, long) => {
            this.map.animateCamera({
              center: {
                latitude: lat,
                longitude: long,
              },
              duration: 1000,
            });
          };
          animateToCoordinat(
            location.coords.latitude,
            location.coords.longitude
          );
          setOnCurrentLocation(true);
        }
      };

      getLocation();
    }
  }, [isFocused]);

  useEffect(() => {
    const newPoints = getPointsbyRegion(region)
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
    <View className=" flex bg-white w-full h-full dark:bg-[#131f24]">
      <MapView
        ref={(map) => (this.map = map)}
        style={{ width: "100%", height: "100%" }}
        initialRegion={initialRegion}
        onRegionChangeComplete={(region, gesture) => setRegion(region)}
        customMapStyle={colorScheme == "dark" ? darkMapType : standardMapType}
        toolbarEnabled={false}
        showsUserLocation={currentLocation != null}
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
                onPress={() =>
                  navigation.navigate("MapPointPage", { selectedPoint: point })
                }
              >
                <Image source={getIcon} style={{ width: 20, height: 20 }} />
              </Marker>
            );
          })}
      </MapView>
      {points.length < 1 && (
        <View
          style={{ position: "absolute", top: "70%" }}
          className="w-full text-center text-2xl text-zinc-500"
        >
          <Text className="w-full text-center text-2xl text-zinc-500 font-semibold">
            Zoomez pour{"\n"}afficher
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={{ position: "absolute", right: 12, top: "42%" }}
        onPress={() => openMedModal()}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 8,
            borderRadius: 5,
            opacity: 0.8,
          }}
        >
          <Image
            source={markerIcons.medical}
            style={{ width: 40, height: 40 }}
          />
        </View>
      </TouchableOpacity>
      <ModalComponent visible={isMedModalVisible} onClose={closeMedModal}>
        <View className="w-full pb-2 ">
          <Text className="pb-2 px-6">Médecins à proximité</Text>
          <FlatList
            data={medecin}
            className=" max-h-80 px-6"
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View className="-mb-[1px] pb-2 pt-1 border-t border-b border-gray-300 flex-row justify-between items-center">
                  <View>
                    <Text>
                      {item.Prenom.normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                      {item.Nom.normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </Text>
                    <Text className=" text-xs">{item.CodePostal}</Text>
                  </View>
                  <View className="flex-row gap-2">
                    {item.Telephone != null && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${item.Telephone}`)}
                      >
                        <Image
                          className=" object-cover h-5 w-5 self-center mt-1"
                          source={require("../../../assets/telephone.png")}
                        />
                      </TouchableOpacity>
                    )}

                    {item.mail != null && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${item.mail}`)}
                      >
                        <Image
                          className=" object-cover h-5 w-5 self-center mt-1"
                          source={require("../../../assets/email.png")}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
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

const standardMapType = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];
const darkMapType = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
