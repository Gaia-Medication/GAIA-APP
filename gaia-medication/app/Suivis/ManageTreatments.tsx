import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllTreatments, readList } from '../../dao/Storage';
import { styles } from '../../style/style';
import ModalComponent from '../component/Modal';
import TakeItem from '../component/TakeItem';
import CustomButton from '../component/CustomButton';
import GoBackButton from '../component/GoBackButton';
import { Image } from 'react-native-elements';

import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { getMedbyCIS } from "../../dao/Meds";


export default function ManageTreatments({navigation}) {
    const isFocused = useIsFocused();
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [modifModalVisible, setModifModalVisible] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment>(null);
    useEffect(() => {
        if (isFocused) {
            console.log("Nav on Journal Page")
            init();
        }
    }, [isFocused]);

    const init = async () => {
        getAllTreatments().then((treatments) => {
            setTreatments(treatments);
        });
    }

    const [takeList, setTakeList] = useState<Take[]>([]);

    const handleDelete = (deletedTake) => {
        const updatedList = takeList.filter((take) => take !== deletedTake);
        setTakeList(updatedList);
    };

    const handleModify = (modifiedTake, newDate) => {
        // Update the modified take's date
        modifiedTake.date = newDate;
        // Create a new array with the updated take
        const updatedList = takeList.map((take) => (take === modifiedTake ? modifiedTake : take));
        setTakeList(updatedList);
    };

    const modalModif = selectedTreatment ? (
        <View style={{ gap: 30, paddingBottom: 100, width: "95%", display: "flex", alignItems: "center"}}>
            <Text className=' text-neutral-700 text-xl font-medium'>{selectedTreatment.name}</Text>
            <View style={styles.container}>
                {selectedTreatment.instructions.map((instruction, index) => (
                    <View>
                        {instruction.takes.map((take, index) => (
                            <TakeItem item={take} />
                        ))}
                    </View>
                ))}
            </View>
                <CustomButton title={"Close"} color={"#eb4034"} disabled={false} onPress={() => setModifModalVisible(false) }>
                </CustomButton>
        </View>
    ) : null;

    const handleModalActivation = (visible, treatment) => {
        setTakeList(treatment.takes);
        setSelectedTreatment(treatment);
        setModifModalVisible(visible);
    }

    function formaterDate(date) {
        const heures = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const jour = date.getDate().toString().padStart(2, "0");
        const mois = (date.getMonth() + 1).toString().padStart(2, "0");
        const annee = date.getFullYear();
    
        return `${heures}:${minutes} ${jour}/${mois}/${annee}`;
      }
        
  const genererInstructionsHtml = async (instructions, users) => {
    const htmlParts = await Promise.all(
      instructions.map(async (instruction) => {
        return await Promise.all(
          instruction.takes.filter((take) => new Date() > new Date(take.date)).map(async (take) => {
            const user = users.find((user) => user.id === take.userId);
            const medic = await getMedbyCIS(take.CIS);
            const date = formaterDate(new Date(take.date));
            const takenStatus = take.taken ? "pris" : "non pris";
            const review = take.review ? take.review : "";
            const pain = take.pain ? take.pain : "";
            return `
            <p style="font-weight: 500">${user.firstname} ${user.lastname}</p>
            <p>Médicament: ${medic.Name}</p>
            <p>Status: ${takenStatus}</p>
            <p>le ${date}</p>
            <p>Douleur ressentie : ${pain}</p>
            <p>Commentaire:${review}</p>
            <span style="display: block; height: 1px; width: 70%; background-color: #d6d6d6; margin-bottom: 4rem;"></span>
            `;
          })
        );
      })
    );
    return htmlParts.flat().join("");
  };

  const pdf = async (treatment) => {
    const users = await readList("users");
    const instructionsHtml = await genererInstructionsHtml(
        treatment.instructions,
        users
    );

    const html = `
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Traitement ${treatment.name}</title>
            <style>
              body {
                  text-align: center;
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
              }
      
              .header {
                  background-color: #9CDE00;
                  color: #fff;
                  padding: 20px;
              }
      
              .header h1 {
                  font-size: 30px;
                  font-weight: normal;
                  margin: 0;
              }
      
              .description {
                  margin: 20px;
                  text-align: left;
              }
      
              .description h2 {
                  font-size: 24px;
                  font-weight: normal;
              }
      
              .ressenti {
                  margin: 20px;
                  text-align: left;
              }
      
              .ressenti h2 {
                  font-size: 24px;
                  font-weight: normal;
              }
      
              .instructions {
                  font-size: 16px;
                  border-left: black 1px solid;
                  padding-left: 2rem;
              }
      
              .logo {
                  display: block;
                  margin: 20px auto;
                  width: 100px;
                  filter: brightness(0) invert(1);
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Traitement ${treatment.name}</h1>
          </div>
          
          <div class="description">
              <h2>Description</h2>
              <p>${treatment.description}</p>
          </div>
      
          <div class="ressenti">
              <h2>Suivis du traitement :</h2>
              <div class="instructions">
                  ${instructionsHtml}
              </div>
          </div>
      </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

    return (
        <SafeAreaView style={styles.container}>
            {treatments ? (
                <View>
                    <GoBackButton navigation={navigation}></GoBackButton>

                    <Text className=" text-center my-6 text-xl text-neutral-700 font-bold mt-[26px]">
                    Gestion des traitements
                    </Text>

                    <FlatList
                    data={treatments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                style={styles.listItem}
                                className="flex justify-start align-middle"
                                onPress={() => handleModalActivation(true, item)}
                            >
                                <View className="ml-4 flex-1 flex-row justify-between items-center">
                                    <Text className="flex-1">{item.name}</Text>
                                    <TouchableOpacity onPress={() => {
                                        pdf(item);
                                    }}>
                                        <Image source={require("../../assets/pdf.png")} className='w-8 h-8' />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    />
                    <ModalComponent
                        visible={modifModalVisible}
                        onClose={() => {

                            setModifModalVisible(false);
                        }}
                        styleAdded={{
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 20,
                            maxHeight: "80%",
                            width: "90%",
                        }}
                        children={modalModif}
                    />
                </View>

            ) : (
                <Text>Vous n'avez pas de traitement</Text>
            )}


        </SafeAreaView>
    );
}

