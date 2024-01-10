import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllTreatments } from '../../dao/Storage';
import { styles } from '../../style/style';
import ModalComponent from '../component/Modal';
import TakeItem from '../component/TakeItem';

const Tile = ({ treatment, onPress }) => {
    const item: Treatment = treatment;
    const generateRandomHeight = () => {
        const minHeight = 100;
        const maxHeight = 200;
        return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    };

    const predefinedColors = ['#1ABC9C', '#27AE60', '#117864', '#45B39D', '#58D68D'];

    const tileHeight = generateRandomHeight();
    const contentMinHeight = 200; // Adjust this value as needed

    return (
        <TouchableOpacity onPress={() => onPress(true, treatment)} style={[styles.square, { backgroundColor: predefinedColors[item.startDate.getHours() % predefinedColors.length], height: Math.max(tileHeight, contentMinHeight) }]}>
            <Text style={{ fontWeight: "700", marginBottom: 10 }}>{item.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", marginBottom: 10 }}>
                <View style={{ width: 5, height: "100%", borderRadius: 5, backgroundColor: "#00000070" }} />
                <Text style={{ fontWeight: "700", color: "#00000070", paddingLeft: 4 }} numberOfLines={4} ellipsizeMode='tail'>{item.description || "Aucune description renseignéeAucune des renseignée hghdihqihf"}</Text>
            </View>
        </TouchableOpacity>
    );
};

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
        <View style={{ gap: 30, paddingBottom: 100 }}>
            <Text>{selectedTreatment.name}</Text>
            <View style={styles.container}>
                {selectedTreatment.instructions.map((instruction, index) => (
                    <View>
                        {instruction.takes.map((take, index) => (
                            <TakeItem item={take} />
                        ))}
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={() => setModifModalVisible(false) }style={{ backgroundColor: "red" }}>
                <Text>Close</Text>
            </TouchableOpacity>
        </View>
    ) : null;

    const handleModalActivation = (visible, treatment) => {
        setTakeList(treatment.takes);
        setSelectedTreatment(treatment);
        setModifModalVisible(visible);
    }

    return (
        <ImageBackground
            source={require('./../../assets/logo_gaia_loading.png')} // Replace with your logo image source
            style={styles.customContainer}
        >
            <View style={styles.customContent}>
                {treatments ? (
                    <View>
                        <FlatList
                            key={treatments.length}
                            data={treatments}
                            keyExtractor={(item) => item.name}
                            numColumns={2} // Display two items in each row
                            renderItem={({ item }) => <Tile treatment={item} onPress={handleModalActivation} />}
                        />
                        <ModalComponent
                            visible={modifModalVisible}
                            onClose={() => {

                                setModifModalVisible(false);
                            }}
                            styleAdded={{
                                backgroundColor: "white",
                                borderRadius: 10,
                                padding: 20,
                                maxHeight: "80%",
                            }}
                            children={modalModif}
                        />
                    </View>

                ) : (
                    <Text>Vous n'avez pas de traitement</Text>
                )}

            </View>

        </ImageBackground>
    );
}

