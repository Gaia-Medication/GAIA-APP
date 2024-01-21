import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { readList } from "../../dao/Storage";
import { styles } from "../../style/style";
import AllergySelector from "../component/AllergySelector";
import CustomButton from "../component/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import GoBackButton from "../component/GoBackButton";
import { Trash } from "react-native-feather";

interface IModifyProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function ModifyProfile({ navigation }: IModifyProps) {
    // FORM DU USER
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [weight, setWeight] = useState<number>();
  const [gender, setGender] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // TUTORIEL
  const [validFirstPart, setValidFirstPart] = useState(false);
  const [isAllergySelectorValid, setIsAllergySelectorValid] = useState(false);

  // SELECTION DE L'ACTION DE MODIFICATION
  const [profileSelected, setProfileSelected] = useState<User>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User>(null);

  // VALIDATION DU FORMULAIRE
  const [preference, setPreference] = useState([]);
  const [isValidFirstname, setIsValidFirstname] = useState(true);
  const [isValidLastname, setIsValidLastname] = useState(true);
  const [isValidWeight, setIsValidWeight] = useState(true);

  const isFirstFormEmpty = !firstname || !lastname || !gender;

  const isFormEmpty =
    !firstname ||
    !lastname ||
    !gender ||
    !dateOfBirth ||
    !weight ||
    !isValidWeight;

  const validateFirstname = () => {
    setIsValidFirstname(firstname.length >= 2);
  };

  const validateLastname = () => {
    setIsValidLastname(lastname.length >= 2);
  };

  const validateWeight = () => {
    if (weight > 0 || weight <= 999) {
      setIsValidWeight(true);
    } else {
      setIsValidWeight(false);
    }
  };

  // INITIALISE: RECUPERE LES PROFILS
  const init = async () => {
    const userList = await readList("users");
    setUsers(userList);
  };

  const handleAllergySelectorValidation = (isValid) => {
    setIsAllergySelectorValid(isValid);
  };

  // FORMATE UNE DATE
  function formatDateToDDMMYYYY(date: Date) {
    console.log("date: ", date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

    return formattedDate;
  }

  useEffect(() => {
    init();
  }, []);

  // PERMET DE SUPPRIMER UN PROFIL DANS LE STOCKAGE
  const deleteUser = async (userId) => {
    try {
      if (users.length > 1) {
        const updatedUsers = users.filter((user) => user.id !== userId);
        await AsyncStorage.setItem(
          "currentUser",
          JSON.stringify(updatedUsers[0].id)
        );
        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
        const stock = await readList("stock");
        const updatedStock = stock.filter((stock:Stock) => stock.idUser !== userId);
        await AsyncStorage.setItem("stock", JSON.stringify(updatedStock));
        setUsers(updatedUsers); // Maj la liste des utilisateurs dans l'état local
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  // GERE LA PREMIERE PARTIE DU FORMULAIRE
  const handleFirstSumbit = () => {
    if (validFirstPart) {
      setValidFirstPart(false);
    } else {
      if (!isValidFirstname || !isValidLastname || isFirstFormEmpty) {
        console.log(`error not valid`);
      } else {
        setValidFirstPart(true);
      }
    }
  };

  // GERE LA VALIDATION DU FORMULAIRE ET MISE OU MODIFICATION EN STOCKAGE DU PROFIL
  const handleSumbit = async () => {
    if (!isValidFirstname || !isValidLastname || isFormEmpty) {
      console.log(`error not valid`);
    } else {
      try {
        const userToUpdate = users.find(
          (user) => user.id === profileSelected.id
        );

        if (userToUpdate) {
          userToUpdate.firstname = firstname;
          userToUpdate.lastname = lastname;
          userToUpdate.dateOfBirth = dateOfBirth;
          userToUpdate.weight = weight;
          userToUpdate.gender = gender;
          userToUpdate.preference = preference;

          // Maj l'utilisateur dans la liste des utilisateurs
          const updatedUsers = users.map((user) =>
            user.id === userToUpdate.id ? userToUpdate : user
          );

          // Enregistrez la liste mise à jour dans AsyncStorage
          await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
          setProfileSelected(null);
          navigation.goBack();
        } else {
          console.log("Utilisateur non trouvé.");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackButton navigation={navigation}></GoBackButton>

      {!profileSelected && users && (
        <View className="mt-[16px]" style={styles.container}>
          <Text className=" text-2xl font-semibold py-2 mx-auto">
            Modifier un profil
          </Text>
          <FlatList
            data={users}
            className=" p-2"
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setProfileSelected(item);
                  setFirstname(item.firstname);
                  setLastname(item.lastname);
                  setDateOfBirth(new Date(item.dateOfBirth));
                  setWeight(item.weight);
                  setGender(item.gender);
                  setPreference(item.preference);
                }}
              >
                <View className=" bg-neutral-100 rounded-xl p-2 m-1">
                  <Text className=" text-neutral-500">
                    {item.id}- {item.firstname} {item.lastname}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {profileSelected && (
        <>
          <Text className=" text-center my-6 text-2xl text-neutral-700 font-bold">
            Modification de profil
          </Text>
          {!validFirstPart && (
            <>
              <Input
                label="Prénom"
                labelStyle={styles.label}
                placeholder="Entrez votre prnom"
                placeholderTextColor={"#dedede"}
                onChangeText={(text) =>
                  setFirstname(text.charAt(0).toUpperCase() + text.slice(1))
                }
                onBlur={validateFirstname}
                value={firstname}
                renderErrorMessage={isValidFirstname}
              />
              {!isValidFirstname && (
                <Text style={stylesProfile.errorText}>
                  Le prénom doit comporter au moins 1 caractères.
                </Text>
              )}

              <Input
                label="Nom"
                labelStyle={styles.label}
                placeholder="Entrez votre nom"
                placeholderTextColor={"#dedede"}
                onChangeText={(text) =>
                  setLastname(text.charAt(0).toUpperCase() + text.slice(1))
                }
                onBlur={validateLastname}
                value={lastname}
                renderErrorMessage={isValidLastname}
              />
              {!isValidLastname && (
                <Text style={stylesProfile.errorText}>
                  Le nom doit comporter au moins 1 caractères.
                </Text>
              )}

              <Text
                style={{
                  color: "#888888",
                  fontWeight: "400",
                  paddingLeft: 10,
                  fontSize: 16,
                }}
              >
                Genre
              </Text>
              <RNPickerSelect
                placeholder={{ label: "Sélectionner le genre", value: "" }}
                onValueChange={(value) => setGender(value)}
                value={gender}
                items={[
                  { label: "Masculin", value: "male" },
                  { label: "Feminin", value: "female" },
                  { label: "Autre", value: "other" },
                ]}
              />

              <View className=" flex items-center justify-center mt-auto mb-2">
                <CustomButton
                  title="Suivant"
                  onPress={handleFirstSumbit}
                  disabled={isFirstFormEmpty}
                  color={"#9CDE00"}
                />
              </View>
            </>
          )}

          {validFirstPart && (
            <>
              {!isAllergySelectorValid && (
                <>
                  <Text className=" m-4 text-gray-300 text-lg">
                    {firstname} {lastname}
                  </Text>
                  <Text style={styles.label} className="m-2">
                    Date de naissance
                  </Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    {dateOfBirth && (
                      <View className="flex items-center">
                        <Text className="text-white text-center font-semibold bg-lime-400 rounded-lg w-[80%] m-4 p-2 ">
                          {formatDateToDDMMYYYY(dateOfBirth)}
                        </Text>
                      </View>
                    )}
                    {!dateOfBirth && (
                      <View className="flex items-center">
                        <Text className="text-white text-center font-semibold bg-blue-400 rounded-lg w-[80%] m-4 p-2 ">
                          Choisir la date de naissance
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dateOfBirth || new Date()}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setDateOfBirth(selectedDate);
                        }
                      }}
                    />
                  )}
                  <Input
                    label="Poids (kg)"
                    labelStyle={styles.label}
                    placeholder="Votre poids en kg"
                    placeholderTextColor={"#dedede"}
                    onChangeText={(text) => setWeight(parseInt(text))}
                    onBlur={validateWeight}
                    value={weight ? weight.toString() : ""}
                    maxLength={4}
                    renderErrorMessage={isValidWeight}
                    keyboardType="numeric"
                  ></Input>
                  {!isValidWeight && (
                    <Text style={stylesProfile.errorText}>
                      Le poids doit être contenu entre 1 et 999kg.
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setIsAllergySelectorValid(true);
                    }}
                  >
                    <View className="flex items-center">
                      <Text className="text-lime-400 text-center font-semibold bg-lime-100 rounded-lg w-[80%] p-1 ">
                        Choisir vos allergies médicamenteuses
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <FlatList
                    className=" m-3 min-h-[40px] max-h-[40px]"
                    horizontal={true}
                    data={preference}
                    keyExtractor={(_item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View className=" bg-blue-200 m-1 p-1 rounded-lg flex flex-row justify-center align-middle">
                        <Text className=" text-blue-400">{item}</Text>
                      </View>
                    )}
                  />

                  <View className=" flex items-center justify-center mt-auto mb-2">
                    <View className=" m-3 w-max ">
                      <CustomButton
                        title="Retour"
                        onPress={handleFirstSumbit}
                        disabled={false}
                        color={"#4296E4"}
                      />
                    </View>
                    <CustomButton
                      title="Enregistrer le profil"
                      onPress={handleSumbit}
                      disabled={isFormEmpty}
                      color={"#9CDE00"}
                    />
                  </View>
                </>
              )}
              {isAllergySelectorValid && (
                <AllergySelector
                  isAllergySelectorValid={handleAllergySelectorValidation}
                  preference={preference}
                  onPreferenceChange={setPreference}
                ></AllergySelector>
              )}
            </>
          )}
        </>
      )}

      {!profileSelected && users && (
        <>
          <Text className=" text-2xl font-semibold py-2  mx-auto">
            Supprimer un profil
          </Text>
          <FlatList
            data={users}
            className=" p-2"
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setUserToDelete(item);
                }}
              >
                {userToDelete === item ? (
                  <View className=" bg-blue-200 rounded-xl p-2">
                    <Text className=" text-blue-500">
                      {item.id}- {item.firstname} {item.lastname}
                    </Text>
                  </View>
                ) : (
                  <View className=" bg-neutral-100 rounded-xl p-2 m-1">
                    <Text className=" text-neutral-500">
                      {item.id}- {item.firstname} {item.lastname}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
          <View className=" flex justify-center items-center mb-3">
            {users.length === 1 && (
              <CustomButton
                title={"Vous ne pouvez pas supprimer\n le dernier profil"}
                disabled={true}
                onPress={() => {}}
                color={"#4296E4"}
              ></CustomButton>
            )}
            {userToDelete === null && users.length !== 1 && (
              <CustomButton
                title={
                  userToDelete
                    ? `Supprimer le profil #${userToDelete?.id} `
                    : "Selectionner un profil à supprimer"
                }
                onPress={() => {}}
                disabled={userToDelete === null}
                color={""}
              ></CustomButton>
            )}
            {users.length > 1 && userToDelete !== null && (
              <TouchableOpacity
                className="bg-[#4296E4] rounded-2xl flex flex-row justify-center items-center p-2 w-[80%] "
                onPress={() => {
                  deleteUser(userToDelete.id);
                  navigation.goBack();
                }}
              >
                <Text className="text-center text-white p-2">
                  {userToDelete
                    ? `Supprimer le profil #${userToDelete?.id} `
                    : "Selectionner un profil à supprimer"}
                </Text>
                <Trash color="white" height={20} width={20} />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
