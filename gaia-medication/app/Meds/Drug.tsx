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
import TutorialBubble from "../component/TutorialBubble";

export default function Drug({ route, navigation }) {
  const [drugModalVisible, setDrugModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [user, setUser] = useState<User | null>(null);
  const [showMore, setShowMore] = useState(5);
  const [stock, setStock] = useState(null);
  const [allergique, setAllergique] = useState(false);
  const [sameComp, setSameComp] = useState([]);

  const { drugCIS, context } = route.params;
  const drug = getMedbyCIS(drugCIS);

  const [tutoMedic, setTutoMedic] = useState(null);
  const [tutoStep, setTutoStep] = useState(0);

  const init = async () => {
    setTutoMedic(await AsyncStorage.getItem("TutoMedic"));
    const currentId = await AsyncStorage.getItem("currentUser");
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
    const stockList = await readList("stock");
    setAllergique(
      current.preference
        .map((allergie) => Array.from(getPAfromMed(drugCIS)).includes(allergie))
        .some((bool) => bool)
    );
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
        qte: 1,
      };
      console.log(addstock);

      await addItemToList("stock", addstock);
      setStock([...stock, addstock]);
    } catch (e) {
      console.log(e);
    }
  };

  const updateStock = async (cis, cip,addQte) => {
    try {
      const product=stock.find((stockItem) => stockItem.CIP === cip)
      if(product){
        await removeItemFromStock(cis, cip, user.id);
        if(product.qte+addQte>0){
          const addstock: Stock = {
            idUser: user.id,
            CIP: cip,
            CIS: cis,
            qte: product.qte+addQte,
          };
          console.log(addstock);
    
          await addItemToList("stock", addstock);
          //setStock([...stock, addstock]);
        }
      }else{
        const addstock: Stock = {
          idUser: user.id,
          CIP: cip,
          CIS: cis,
          qte: 1,
        };
        console.log(addstock);
  
        await addItemToList("stock", addstock);
        //setStock([...stock, addstock]);
      }
      init();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFromStock = async (cis, cip, ) => {
    try {
      await removeItemFromStock(cis, cip, user.id);
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

  const handleTuto = (isClicked, step) => {
    if (isClicked) {
      setTutoStep(tutoStep + 1);
      if (tutoStep === 3) {
        AsyncStorage.setItem("TutoMedic", "1");
        navigation.navigate("Home");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {tutoStep === 0 && tutoMedic === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "70%", left: "5%" }}
          text={"Voici la page d'un médicament, 1/4"}
        ></TutorialBubble>
      )}
      {tutoStep === 1 && tutoMedic === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "30%", left: "5%" }}
          text={"Vous pouvez voir si le médicament est disponible, 2/4"}
        ></TutorialBubble>
      )}
      {tutoStep === 2 && tutoMedic === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "85%", left: "5%" }}
          text={"Vous avez à votre disposition\nles informations du médicaments, 3/4"}
        ></TutorialBubble>
      )}
      {tutoStep === 3 && tutoMedic === "0" && (
        <TutorialBubble
          isClicked={handleTuto}
          styleAdded={{ top: "72%", left: "9%" }}
          text={"Et pour finir,vous avez la possibilité\n d'ajouté ce médicament, 4/4"}
        ></TutorialBubble>
      )}
      {drug && stock && user && (
        <>
          <ScrollView className="gap-2" showsVerticalScrollIndicator={false}>
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
                  <View
                    key={index}
                    className=" -mb-[1px] pb-2 border-t border-b border-gray-300"
                  >
                    <Text className=" font-light">{item.CIP}</Text>
                    <Text className=" text-xs">{item.Denomination}</Text>
                    <View className=" -mt-1">
                      {drug.Marketed == "Commercialisée" ? (
                        item.Price_with_taxes ? (
                          <>
                            <Text className="font-bold text-right">
                              {item.Price_with_taxes}€
                            </Text>
                            <Text className="text-right text-xs">
                              (Remboursement: {item.Remboursement})
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text className="text-right text-xs font-bold">
                              Prix libre
                            </Text>
                            <Text className="text-right text-xs">
                              (Non remboursable)
                            </Text>
                          </>
                        )
                      ) : null}
                    </View>
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
                    <Text className="text-center text-[#9CDE00] mt-3 font-bold">
                      Afficher plus
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View className={stock.find((stockItem) => stockItem.CIS === drugCIS) != null?" mb-40":"mb-24"} />
          </ScrollView>
          
          {stock.find((stockItem) => stockItem.CIS === drugCIS) != null?(
            <><TouchableOpacity
              disabled={true}
              className=" bg-white rounded-[19px] absolute bottom-24 left-6 right-6 border border-[#9CDE00]"
              onPress={() => {
              } }
            >
              <Text className="text-center text-[#9CDE00] text-lg py-3 pt-2">
                Déjà dans le stock
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" bg-[#D5F48A] rounded-[19px] absolute bottom-8 left-6 right-6"
              onPress={() => {
                setDrugModalVisible(true);
              } }
            >
                <Text className="text-center text-[#9CDE00] text-lg py-3 pt-2">
                  Modifier
                </Text>
              </TouchableOpacity></>
          ):(
            <TouchableOpacity
              className=" bg-[#9CDE00] rounded-[19px] absolute bottom-8 left-6 right-6"
              onPress={() => {
                setDrugModalVisible(true);
              }}
            >
              <Text className="text-center text-white text-2xl font-bold py-3 pt-2">
                Ajouter
              </Text>
            </TouchableOpacity>
          )}

          <ModalComponent
            styleAdded={{
              backgroundColor: "white",
              borderRadius: 10,
              paddingHorizontal: 20,
              width: "80%",
              maxHeight: "60%",
            }}
            visible={drugModalVisible}
            onClose={() => setDrugModalVisible(!drugModalVisible)}
          >
            <View className="w-full py-3">
              {drug.Values.map((item, index) => {
                const alreadyStocked =
                  stock.find((stockItem) => stockItem.CIP === item.CIP) != null;
                return (
                  <View key={index} className="flex py-2 flex-row items-center justify-between border-b border-gray-200">
                    <View className="flex flex-1">
                      <Text className=" font-light">{item.CIP}</Text>
                      <Text className=" text-xs">{item.Denomination}</Text>
                    </View>

                    {alreadyStocked ? (
                      <>
                        <TouchableOpacity
                          className="px-2"
                          onPress={() => {
                            updateStock(item.CIS, item.CIP,+1)
                          }}
                        >
                          <Text className="">➕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="px-2"
                          onPress={() =>
                            updateStock(item.CIS, item.CIP,-1)
                          }
                        >
                          <Text className="">❌</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                      <TouchableOpacity
                        className="px-2"
                        onPress={() => {
                          updateStock(item.CIS, item.CIP,+1)
                        }}
                      >
                        <Text className="">➕</Text>
                      </TouchableOpacity>
                      </>
                    )}
                  </View>
                );
              })}
              <View className="mt-4">
                {stock.length>0&&<Text className=" text-xs">Dans le Stock:</Text>}
                {stock.map((item, index) => {
                  return(
                    <View key={index}className="flex-row">
                      <Text className=" text-xs">x{item.qte} - {drug.Values.find(prod=>prod.CIP==item.CIP).Denomination}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          </ModalComponent>
        </>
      )}
      {(!drug || !stock || !user) && <Loading />}
    </SafeAreaView>
  );
}
