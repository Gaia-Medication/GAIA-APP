import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllTreatments } from '../../dao/Storage';
import { styles } from '../../style/style';

const Tile = ({ treatment }) => {
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
        <View style={[styles.square, { backgroundColor: predefinedColors[item.startDate.getHours() % predefinedColors.length], height: Math.max(tileHeight, contentMinHeight) }]}>
            <Text style={{ fontWeight: "700", marginBottom: 10 }}>{item.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", marginBottom: 10 }}>
                <View style={{ width: 5, height: "100%", borderRadius: 5, backgroundColor: "#00000070" }} />
                <Text style={{ fontWeight: "700", color: "#00000070", paddingLeft: 4 }} numberOfLines={4} ellipsizeMode='tail'>{item.description || "Aucune description renseignéeAucune des renseignée hghdihqihf"}</Text>
            </View>
        </View>
    );
};

export default function ManageTreatments() {
    const isFocused = useIsFocused();
    const [treatments, setTreatments] = useState<Treatment[]>([]);
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

    return (
        <ImageBackground
            source={require('./../../assets/logo_gaia_loading.png')} // Replace with your logo image source
            style={styles.customContainer}
        >
            <SafeAreaView edges={['top']} style={styles.customContent}>
                <ScrollView>
                    {treatments ? (
                    <FlatList
                        key={treatments.length}
                        data={treatments}
                        keyExtractor={(item) => item.name}
                        numColumns={2} // Display two items in each row
                        renderItem={({ item }) => <Tile treatment={item} />}
                    />
                ) : (
                    <Text>Vous n'avez pas de traitement</Text>
                )}
                </ScrollView>
                
            </SafeAreaView>
            
        </ImageBackground>
        );
}

