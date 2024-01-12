import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllTreatments } from '../../dao/Storage';
import { styles } from '../../style/style';
import ModalComponent from '../component/Modal';
import TakeItem from '../component/TakeItem';
import CustomButton from '../component/CustomButton';

export default function ManageTreatments() {
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

    return (
        <SafeAreaView style={styles.container}>
            {treatments ? (
                <View>
                    
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

