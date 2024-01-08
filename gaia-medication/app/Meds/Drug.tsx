import { useIsFocused } from "@react-navigation/native";
import * as Icon from "react-native-feather";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAllGenOfCIS,
  getAllSameCompOfCIS,
  getComposition,
  getMedbyCIS,
  getPAfromMed,
} from "../../dao/Meds";
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
  const [showMore, setShowMore] = useState(5);
  const [stock, setStock] = useState(null);
  const [allergique, setAllergique] = useState(false);
  const [gens, setGens] = useState([]);
  const [sameComp, setSameComp] = useState([]);

  const { drugCIS, context } = route.params;
  const drug = getMedbyCIS(drugCIS);

  const init = async () => {
    const currentId = await AsyncStorage.getItem("currentUser");
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
    const stockList = await readList("stock");
    setAllergique(
      current.preference
        .map((allergie) => Array.from(getPAfromMed(drugCIS)).includes(allergie))
        .some((bool) => bool)
    );
    setGens(getAllGenOfCIS(drugCIS));
    setSameComp(getAllSameCompOfCIS(drugCIS));
    setStock(
      stockList.filter(
        (item) => item.idUser == currentId && item.CIS == drugCIS
      )
    );
  };

  useEffect(() => {
    if (isFocused) {
      console.log("Nav on Drug Page :", drugCIS, "-", drug.Name);
      getComposition(drug.Composition);
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
    <SafeAreaView style={styles.container}>
      {drug && stock && user && (
        <>
          <View className="flex-row justify-between pt-4 px-6">
            <Icon.ArrowLeft
              color={"#363636"}
              onPress={() => navigation.goBack()}
            />
            <Icon.AlertCircle
              className=" z-10"
              color={"#363636"}
              onPress={handlePress}
            />
          </View>
          <ScrollView className="gap-2" showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-center">
              <MedIconByType type={drug.Shape} size={"h-24 w-24"} />
            </View>
            <View className="pt-10 flex px-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-light">{drug.CIS}</Text>
                {drug.Marketed == "Commercialisée" ? (
                  <View className="flex-row items-center">
                    <View
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: 10,
                        borderColor: "#9BEA8E",
                        marginTop: 2,
                        borderWidth: 3,
                        marginRight: 6,
                      }}
                    ></View>
                    <Text className="text-base font-bold text-[#9BEA8E]">
                      Disponible
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <View
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: 10,
                        borderColor: "#EE5E5E",
                        marginTop: 2,
                        borderWidth: 3,
                        marginRight: 6,
                      }}
                    ></View>
                    <Text className="text-base font-bold text-[#EE5E5E]">
                      Indisponible
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-5xl font-bold">
                {drug.Name.split(" ")[0].charAt(0).toUpperCase() +
                  drug.Name.split(" ")[0].slice(1).toLowerCase()}
              </Text>
              <Text className="text-lg">
                {drug.Name.split(" ").slice(1).join(" ")}
              </Text>
              <Text>
                Administration:{" "}
                <Text className=" font-light">{drug.Administration_way}</Text>
              </Text>
            </View>
            {allergique && (
              <View className=" flex-row px-6">
                <Image
                  className={"h-5 w-5"}
                  source={require("../../assets/allergy.png")}
                />
                <Text className="ml-2 text-red-500 font-bold">
                  Vous êtes allergique à ce produit
                </Text>
              </View>
            )}
            <Text className=" px-6">Boite(s) disponible(s):</Text>
            <View className=" px-6">
              {drug.Values.map((item, index) => {
                const alreadyStocked =
                  stock.find((stockItem) => stockItem.CIP === item.CIP) != null;

                return (
                  <View key={index}>
                    <Text className=" font-light">{item.CIP}</Text>
                    <Text className=" text-xs">{item.Denomination}</Text>
                    {drug.Marketed == "Commercialisée" ? (
                      item.Price_with_taxes ? (
                        <>
                          <Text className=" text-xs">
                            {item.Price_with_taxes}€
                          </Text>
                          <Text className=" text-xs">{item.Remboursement}</Text>
                        </>
                      ) : (
                        <>
                          <Text className=" text-xs">Prix libre</Text>
                          <Text className=" text-xs">Non remboursable</Text>
                        </>
                      )
                    ) : null}

                    {alreadyStocked ? (
                      <>
                        <TouchableOpacity className="bg-green-400 text-center">
                          <Text className="text-center">In stock</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="bg-red-400 text-center"
                          onPress={() =>
                            deleteFromStock(item.CIS, item.CIP, user.id)
                          }
                        >
                          <Text className="text-center">❌</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        className="bg-blue-400"
                        onPress={() => {
                          addToStock(item);
                        }}
                      >
                        <Text className="text-center">Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
            <Text className=" px-6">Composition:</Text>
            {Object.keys(getComposition(drug.Composition)).map((type) => (
              <View className=" px-6" key={type}>
                <Text className=" text-xs">
                  Type: {type} (Composition pour{" "}
                  {getComposition(drug.Composition)[type][0]["Quantite"]})
                </Text>
                {getComposition(drug.Composition)[type].map(
                  (comprime, index) => (
                    <View key={index}>
                      <Text className=" text-xs">
                        {"> "}
                        {comprime.Dosage} {"-"} {comprime.PrincipeActif}
                      </Text>
                    </View>
                  )
                )}
              </View>
            ))}
            {sameComp.length > 0 && (
              <View className="px-0">
                <Text className=" px-6">Meme composition:</Text>
                <View>
                  {sameComp.slice(0, showMore).map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.listItem}
                      className="flex justify-start align-middle"
                      onPress={() =>
                        navigation.push("Drug", { drugCIS: item.CIS })
                      }
                    >
                      <MedIconByType type={item.Shape} />
                      <View className="ml-4 flex-1 flex-row justify-between items-center">
                        <Text className="flex-1">{item.Name}</Text>
                        {user.preference
                          .map((allergie) =>
                            Array.from(getPAfromMed(item.CIS)).includes(
                              allergie
                            )
                          )
                          .some((bool) => bool) && (
                          <View className=" items-center">
                            <Image
                              className={"h-5 w-5 ml-1"}
                              source={require("../../assets/allergy.png")}
                            />
                            <Text className="ml-2 text-red-500 font-bold">
                              Allergie
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                {showMore < sameComp.length && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowMore(showMore + 5);
                    }}
                  >
                    <Text className="text-center text-[#9CDE00] mt-3 font-bold">Afficher plus</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View className=" mb-24" />
          </ScrollView>

          <TouchableOpacity
            className=" bg-[#9CDE00] rounded-[19px] absolute bottom-8 left-6 right-6"
            onPress={() => {
              setDrugModalVisible(true);
            }}
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
              maxHeight: "60%",
            }}
            visible={drugModalVisible}
            onClose={() => setDrugModalVisible(!drugModalVisible)}
          >
            <Text>Ajouter un Medicament</Text>
            <TouchableOpacity
              className=" bg-blue-400"
              onPress={() => {
                //addToStock(drugsToAdd);
                setDrugModalVisible(!drugModalVisible);
              }}
            >
              <Text className="text-center">Add</Text>
            </TouchableOpacity>
          </ModalComponent>
        </>
      )}
      {(!drug || !stock || !user) && <Loading />}
    </SafeAreaView>
  );
}
