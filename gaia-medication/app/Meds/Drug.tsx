import { useIsFocused } from "@react-navigation/native";
import * as Icon from "react-native-feather";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllGenOfCIS, getMedbyCIS } from "../../dao/Meds";
import {
  addItemToList,
  getUserByID,
  readList,
  removeItemFromStock,
} from "../../dao/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../component/Loading";
import { Button, Input } from "react-native-elements";
import { styles } from "../../style/style";
import DrugModal from "../component/Modal";
import ModalComponent from "../component/Modal";
import MedIconByType from "../component/MedIconByType";

export default function Drug({ route, navigation }) {
  const [drugModalVisible, setDrugModalVisible] = useState(false);
  const [drugsToAdd, setDrugsToAdd] = useState(null);
  const isFocused = useIsFocused();
  const [user, setUser] = useState<User | null>(null);
  const [stock, setStock] = useState(null);
  const [gens, setGens] = useState([]);

  const { drugCIS } = route.params;
  const drug = getMedbyCIS(drugCIS);

  const init = async () => {
    const currentId = await AsyncStorage.getItem("currentUser");
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
    const stockList = await readList("stock");
    setGens(getAllGenOfCIS(drugCIS));
    setStock(
      stockList.filter(
        (item) => item.idUser == currentId && item.CIS == drugCIS
      )
    );
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Drug Page :", drugCIS);
      init();
    }
  }, [isFocused && drug]);

  const addToStock = async (item) => {
    try {
      const addstock: Stock = {
        idUser: user.id,
        CIP: item.CIP,
        CIS: item.CIS,
        qte: 0,
      };
      console.log(addstock);

      await addItemToList("stock", addstock);
      setStock([...stock, addstock]);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFromStock = async (cis, cip, idUser) => {
    try {
      await removeItemFromStock(cis, cip, idUser);
      init();
    } catch (e) {
      console.log(e);
    }
  };
  const handlePress = useCallback(async () => {
    await Linking.openURL(
      "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=" +
        drugCIS +
        "&typedoc=N"
    );
  }, []);
  return (
    <View style={styles.container} className=" px-6">
      {drug && stock && user && (
        <>
          <View className="flex-row justify-between mt-4">
            <Icon.ArrowLeft
              color={"#363636"}
              onPress={() => navigation.goBack()}
            />
            <Icon.AlertCircle color={"#363636"} onPress={handlePress} />
          </View>
          <View className="flex-row justify-center">
            <MedIconByType type={drug.Shape} size={"h-24 w-24"} />
          </View>
          <View className=" mt-10 flex">
            <View className="flex-row justify-between">
              <Text className="text-base font-light">{drug.CIS}</Text>
              {drug.Marketed == "Commercialisée" ? (
                <Text className="text-base font-bold text-[#9BEA8E]">
                  Disponible
                </Text>
              ) : (
                <Text className="text-base font-bold text-[#EE5E5E]">
                  Indisponible
                </Text>
              )}
            </View>
            <Text className="text-5xl font-bold">
              {drug.Name.split(" ")[0].charAt(0).toUpperCase() +
                drug.Name.split(" ")[0].slice(1).toLowerCase()}
            </Text>
            <Text className="text-lg">
              {drug.Name.split(" ").slice(1).join(" ")}
            </Text>
            <Text>Administration : {drug.Administration_way}</Text>
          </View>
          <ScrollView>
            <FlatList
              data={drug.Values}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                const alreadyStocked =
                  stock.find((stock) => stock.CIP === item.CIP) != null;
                return (
                  <>
                    <Text>{item.CIP}</Text>
                    <Text>{item.Denomination}</Text>
                    {drug.Marketed == "Commercialisée" &&
                      (item.Price_with_taxes ? (
                        <>
                          <Text>{item.Price_with_taxes}€</Text>
                          <Text>{item.Remboursement}</Text>
                        </>
                      ) : (
                        <>
                          <Text>Prix libre</Text>
                          <Text>Non remboursable</Text>
                        </>
                      ))}

                    {alreadyStocked ? (
                      <>
                        <TouchableOpacity className=" bg-green-400 text-center">
                          <Text className="text-center">In stock</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className=" bg-red-400 text-center"
                          onPress={() =>
                            deleteFromStock(item.CIS, item.CIP, user.id)
                          }
                        >
                          <Text className="text-center">❌</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        className=" bg-blue-400"
                        onPress={() => {
                          setDrugsToAdd(item);
                          setDrugModalVisible(true);
                        }}
                      >
                        <Text className="text-center">Add</Text>
                      </TouchableOpacity>
                    )}
                  </>
                );
              }}
            />

            <Text>Groupe Générique :</Text>
            <FlatList
              data={gens}
              keyExtractor={(_item, index) => index.toString()}
              ListEmptyComponent={
                <Text>Aucun</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  className="flex justify-start align-middle"
                  onPress={() =>
                    navigation.navigate("Drug", { drugCIS: item.CIS })
                  }
                >
                  <MedIconByType type={item.Shape} />
                  <Text className="ml-4">{item.Name}</Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>

          <TouchableOpacity
            className=" bg-[#9CDE00] rounded-[19px] absolute bottom-8 left-6 right-6"
            onPress={() => {}}
          >
            <Text className="text-center text-white bold text-2xl font-bold py-3 pt-2">
              Ajouter
            </Text>
          </TouchableOpacity>

          <ModalComponent
            styleAdded={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              minWidth: 300,
            }}
            visible={drugModalVisible}
            onClose={() => setDrugModalVisible(!drugModalVisible)}
          >
            <Text>Ajouter un Medicament</Text>
            <TouchableOpacity
              className=" bg-blue-400"
              onPress={() => {
                addToStock(drugsToAdd);
                setDrugModalVisible(!drugModalVisible);
              }}
            >
              <Text className="text-center">Add</Text>
            </TouchableOpacity>
          </ModalComponent>
        </>
      )}
      {(!drug || !stock || !user) && <Loading />}
    </View>
  );
}
