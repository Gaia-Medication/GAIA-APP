import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { Input } from "react-native-elements";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import callGoogleVisionAsync from '../../../OCR/helperFunctions';
import {
  getAllTreatments,
  initTreatments,
} from '../../../data/Storage';
import { styles } from '../../../style/style';
import { trouverNomMedicament } from '../../../data/Search';
import Loading from '../../components/Loading';
import ModalComponent from '../../components/Modal';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from 'react-native-alert-notification';
import { searchDoctor } from '../../../data/Doctor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../contexts/UserContext';
import { useColorScheme } from 'nativewind';

export default function Home({ navigation }) {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('Profile must be used within a UserProvider');
  }
  const { user, setUser } = userContext;

  const isFocused = useIsFocused();
  const { colorScheme, setColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [isMedModalVisible, setIsMedModalVisible] = useState(false);
  const [takes, setTakes] = useState(null);
  const [nextTake, setNextTake] = useState(-1);
  const [users, setUsers] = useState<User[]>([]);
  const [header, setHeader] = useState(true);
  const [notificationsList, _] = useState<Notif[]>([]);
  const [doctorSearch, setDoctorSearch] = useState([]);

  const [smallTutoStep, setSmallTutoStep] = useState(0);
  const [tutoHome, setTutoHome] = useState(null);

  const init = async () => {
    setColorScheme("dark");
    let isFirstConnectionAsync: string|null = await AsyncStorage.getItem('isFirstConnection');
    let isFirstConnection: boolean = JSON.parse(isFirstConnectionAsync ? isFirstConnectionAsync : 'null');
    if (isFirstConnection === null) {
      AsyncStorage.setItem("isFirstConnection", "true")
      isFirstConnection = true
    }

    // TEST DATA
    let date = new Date();
    let newUser = {
      id: 1,
      firstname: 'Nathan',
      lastname: 'MARIE',
      dateOfBirth: date.toISOString(),
      weight: 80,
      gender: 'male',
      allergies: ['62826517'],
      avatar: 'avatar1',
      bgcolor: '#9CDE00',
    }

    setUsers([newUser]); // SHould be usersList
    setUser(newUser);

    setTutoHome(await AsyncStorage.getItem("TutoHome"));
    //const current = await getUserByID(JSON.parse(currentId));
    AsyncStorage.setItem("TutoHome", "")
    AsyncStorage.setItem("TutoCreate", "")
    AsyncStorage.setItem("TutoSearch", "")
    AsyncStorage.setItem("TutoMedic", "")
    AsyncStorage.setItem("TutoMap", "")
    AsyncStorage.setItem("TutoTreatment", "");
    AsyncStorage.setItem("TutoSettings", "");
    if (users.length < 1 || isFirstConnection) {
      setUser(newUser)
      // L'utilisateur se connecte pour la première fois
      // Reinitialisation du tutoriel
      // AsyncStorage.setItem("TutoHome", "0");
      // AsyncStorage.setItem("TutoCreate", "0");
      // AsyncStorage.setItem("TutoSearch", "0");
      // AsyncStorage.setItem("TutoMedic", "0");
      // AsyncStorage.setItem("TutoMap", "0");
      // AsyncStorage.setItem("TutoTreatment", "0");
      // AsyncStorage.setItem("TutoSettings", "0");
      //navigation.navigate("Welcome");

    } else {
      setUser(newUser);
    }
    console.log("Traitements :", await getAllTreatments());
  };

  const initUserInfo = async () => {
    const takes = await initTreatments();
    takes.sort((a, b) => {
      const dateA = new Date(a.take.date);
      const dateB = new Date(b.take.date);
      return dateA.getTime() - dateB.getTime();
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todaysTakes = takes.filter((take) => {
      const currentDate = new Date(take.take.date);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate.toISOString() === today.toISOString();
    });
    const now = new Date();
    const nextTakeIndex = todaysTakes.findIndex((take) => {
      const takeDate = new Date(take.take.date);
      return takeDate > now;
    });
    setNextTake(nextTakeIndex);
    setTakes(todaysTakes.filter((take) => take.take.userId == user.id));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (!result.canceled) {
      setLoading(true);
      const googleText = await callGoogleVisionAsync(result.assets[0].base64);
      //console.log("OCR :", googleText.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace('Ⓡ',''));
      const scanMedsFinded = trouverNomMedicament(
        googleText.text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace("Ⓡ", "")
      );
      if (scanMedsFinded.meds.length > 0) {
        setLoading(false);
        if (scanMedsFinded.ordonnanceBool) {
          navigation.navigate("AddTreatment", {
            drugScanned: scanMedsFinded.meds,
            doctor: scanMedsFinded.doctor,
          });
        } else {
          navigation.navigate("Drug", {
            drugCIS: scanMedsFinded.meds[0].med.CIS,
          });
        }
      } else {
        setLoading(false);
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Aucun médicament détecté",
          textBody: "Veuillez réessayer avec une autre photo",
          button: "Fermer",
        });
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Home Page");
      init();
    }
  }, [isFocused]);

  useEffect(() => {
    if (user) initUserInfo();
    console.log("USER => ", user)
    console.log("TAKES => ", takes)
    console.log("SMALL TUTO STEP => ", smallTutoStep)
    console.log("TUTO HOME => ", tutoHome)
  }, [user]);

  const handleTuto = (isClicked: boolean) => {
    if (tutoHome === "1") {
      AsyncStorage.setItem("TutoHome", "2");
      navigation.navigate("SuivisHandler");
    }
    if (smallTutoStep === 2) {
      AsyncStorage.setItem("TutoHome", "1");
      navigation.navigate("Search");
    }
    if (isClicked) {
      setSmallTutoStep(smallTutoStep + 1);
    }
  };

  return (
    <SafeAreaView
      className="flex bg-red w-full h-full dark:bg-grey-100"
      style={{ gap: 0 }}
    >
      <AlertNotificationRoot
        theme={colorScheme == "dark" ? "dark" : "light"}
        colors={[
          {
            label: "#000",
            card: "#fff",
            overlay: "#fff",
            success: "",
            danger: "",
            warning: "#FD9601",
            info: "",
          },
          {
            label: "#fff",
            card: "#131f24",
            overlay: "#131f24",
            success: "",
            danger: "",
            warning: "#FD9601",
            info: "",
          },
        ]}
      >
        <Image
          className="h-12 w-24 self-center mt-2"
          source={require('../../../assets/logo_title_gaia.png')}
         />
        <View className=" flex w-full h-full flex-1" style={{ gap: 20 }}>
          {user && takes && (
            <>
              <View style={styles.header}>
                {/* <AvatarButton
                  onPress={handleAvatarButton}
                  users={users}
                  current={user}
                  setUser={setUser}
                  navigation={navigation}
                  tuto={smallTutoStep === 1}
                ></AvatarButton> */}
                {header && (
                  <Text className="text-neutral-800 text-3xl  dark:text-slate-50 p-4 text-center w-full">
                    Bonjour {user?.firstname}
                  </Text>
                )}
              </View>
              <View style={styles.searchContainer}>
                <Text
                  style={styles.title2}
                  className="text-neutral-700 dark:text-slate-100"
                >
                  Recherche d’un médicament
                </Text>
                <View style={styles.searchBarwQR}>
                  <View style={styles.searchBar}>
                  <Input
                      style={styles.searchBarInput}
                      placeholder="Doliprane, Aspirine ..."
                      placeholderTextColor="#9CDE00"
                      leftIcon={{
                        type: "feather",
                        name: "search",
                        color: "#9CDE00",
                      }}
                      value={""}
                      inputContainerStyle={styles.searchBarContainer}
                      //editable={false}
                      onPressIn={() => navigation.navigate("Search", { user: user })}
                    />
                  </View>
                  <TouchableOpacity onPress={pickImage} style={styles.searchQR}>
                    <MaterialIcons
                      name="qr-code-scanner"
                      size={35}
                      color="#9CDE00"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.traitementContainer}>
                <Text
                  style={styles.title2}
                  className="text-neutral-700 dark:text-slate-100"
                >
                  Suivis d'un traitement
                </Text>
              </View>
              {/* <FlatList
                className=" flex-grow-0"
                contentContainerStyle={{ paddingHorizontal: 25 }}
                ref={(ref) => (this.flatList = ref)}
                onContentSizeChange={() => {
                  try {
                    if (
                      this.flatList &&
                      this.flatList.scrollToIndex &&
                      takes &&
                      takes.length
                    ) {
                      this.flatList.scrollToIndex({
                        index: nextTake < 0 ? takes.length - 1 : nextTake,
                      });
                    }
                  } catch { }
                }}
                data={takes}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 25 }} />}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      zIndex: 1,
                      width: 200,
                      backgroundColor: "#BCBCBC10",
                      borderRadius: 17,
                      borderStyle: "solid",
                      borderWidth: 1,
                      borderColor: nextTake !== index ? "#BCBCBC90" : "#9CDE00",
                      padding: 15,
                    }}
                    onPress={() =>
                      navigation.navigate("SuivisHandler", { screen: "Suivis" })
                    }
                  >
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 10,
                      }}
                    >
                      <View
                        className="flex-1 items-center mx-2"
                        style={{
                          backgroundColor:
                            nextTake !== index ? "#BCBCBC40" : "#9CDE00",
                          borderRadius: 100,
                          padding: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: nextTake !== index ? null : "white",
                            fontWeight: "700",
                            fontSize: 12,
                            lineHeight: 14,
                            maxWidth: 180,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.take.treatmentName}
                        </Text>
                      </View>
                      <Text
                        className="mx-2"
                        style={{ fontWeight: "700", fontSize: 16 }}
                      >
                        {formatHour(new Date(item.take.date))}
                      </Text>
                    </View>

                    <View
                      style={
                        {
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 10 
                        }
                      }
                    >
                      <Text
                        style={{ fontWeight: "bold", color: "#444444" }}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {item.med
                          ? item.med + " x " + item.take.quantity
                          : null}
                      </Text>
                    </View>

                    <View
                      style={{
                        paddingHorizontal: 30,
                        marginTop: 10,
                        display: "flex",
                        flexDirection: "row",
                        gap: 15,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor:
                            nextTake !== index ? "#BCBCBC90" : "#9CDE00",
                          width: 5,
                          borderRadius: 100,
                        }}
                      />
                      <View>
                        <Text
                          style={{
                            color: nextTake !== index ? "#7B7B7B" : "black",
                            fontWeight: "bold",
                          }}
                        >
                          Description :
                        </Text>
                        <Text
                          style={{ color: "#C9C9C9", fontWeight: "700" }}
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {item.treatmentDescription
                            ? item.treatmentDescription
                            : "Aucune description..."}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              /> */}
              {takes && takes.length < 1 && (
                <TouchableOpacity
                  className="flex justify-center items-center"
                  onPress={() =>
                    navigation.navigate("SuivisHandler", { screen: "Suivis" })
                  }
                >
                  <Image
                    className="w-24 h-24 -mt-4"
                    source={require('../../../assets/prescription.png')}
                  />
                  <Text className="mt-2 text-base text-[#51a6ec]">
                    Aucune prise à prendre aujoud'hui
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.traitementContainer}>
                <Text
                  style={styles.title2}
                  className="text-neutral-700 dark:text-slate-100"
                >
                  Autres
                </Text>
              </View>
              <View className="px-6 flex-row justify-around">
                <TouchableOpacity
                  onPress={() => setIsMedModalVisible(true)}
                  className=" rounded-3xl bg-[#8FC0F5] flex-row items-center justify-center p-4 w-32 h-32"
                >
                  <Image
                    className="h-20 w-20"
                    source={require('../../../assets/medical-team.png')}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Notifications", {
                      data: JSON.stringify(notificationsList),
                    })
                  }
                  className=" rounded-3xl bg-[#ff8400] flex-row items-center justify-center p-4 w-32 h-32"
                >
                  <Image
                    className="h-20 w-20"
                    source={require('../../../assets/bell.png')}
                  />
                </TouchableOpacity>
              </View>
              <ModalComponent
                visible={isMedModalVisible}
                onClose={() => setIsMedModalVisible(!isMedModalVisible)}
              >
                <View className="w-full pb-2 h-[95%]">
                  <View
                    style={{
                      display: "flex",
                      gap: 19,
                      marginHorizontal: 10,
                      flexDirection: "row",
                      height: 50,
                    }}
                    className="px-4 mb-4"
                  >
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        backgroundColor: "#0070e850",
                        borderRadius: 10,
                      }}
                    >
                      <TextInput
                        style={[styles.searchBarInput, { color: "#0070e8" }]}
                        className=""
                        placeholder="Recherche de médecins"
                        placeholderTextColor="#0070e8"
                        onChangeText={(text) => {
                          console.log(text);
                          if (text.length > 2) {
                            const newSearch = searchDoctor(text);
                            if (newSearch.length > 0) {
                              setDoctorSearch(newSearch);
                            } else setDoctorSearch([]);
                          } else setDoctorSearch([]);
                        }}
                      />
                    </View>
                  </View>
                  {/* <FlatList
                    data={doctorSearch}
                    className="px-6 max-h-[80%]"
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
                                onPress={() =>
                                  Linking.openURL(`tel:${item.Telephone}`)
                                }
                              >
                                <Image
                                  className=" object-cover h-5 w-5 self-center mt-1"
                                  source={require('../../../assets/telephone.png')}
                                />
                              </TouchableOpacity>
                            )}

                            {item.mail != null && (
                              <TouchableOpacity
                                onPress={() =>
                                  Linking.openURL(`mailto:${item.mail}`)
                                }
                              >
                                <Image
                                  className=" object-cover h-5 w-5 self-center mt-1"
                                  source={require('../../../assets/email.png')}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    }}
                  /> */}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setIsMedModalVisible(!isMedModalVisible);
                  }}
                >
                  <Text className="text-red-500">Fermer</Text>
                </TouchableOpacity>
              </ModalComponent>
            </>
          )}
        </View>
        {loading && <Loading />}
      </AlertNotificationRoot>
    </SafeAreaView>
  );
}
