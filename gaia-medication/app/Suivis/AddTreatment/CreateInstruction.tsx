import React, { useState, useRef, useEffect } from "react";
import { View, Text, Alert, ScrollView, Animated } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import GaiaChoiceButtons from "app/component/Buttons/GaiaChoiceButtons";
import GaiaButtonB from "app/component/Buttons/GaiaButtonB";
import GaiaButtonA from "app/component/Buttons/GaiaButtonA";
import GaiaDateTimePicker from "app/component/Pickers/GaiaDateTimePicker";
import { LinearGradient } from "expo-linear-gradient";
import PageTitle from "app/component/PageTitle";
import { FlatList } from "react-native";

export default function CreateInstruction({ route, navigation }) {
    const { newInstruction, user } = route.params;
    const [regularity, setRegularity] = useState("");
    const [customTakes, setCustomTakes] = useState([]);

    const animations = useRef([]); // Store animations in useRef so they persist through re-renders

    const handleSelectionChange = (selectedRegularity) => {
        setRegularity(selectedRegularity);
    };

    const handleAddTakeCustom = () => {
        let newDate = customTakes.length > 0 ? new Date(customTakes[customTakes.length - 1].date) : new Date();
        newDate.setHours(newDate.getHours() + 1);
        const newTake = {
            id: customTakes.length,
            date: newDate.toString(),
            animation: new Animated.Value(1),
            translateY: new Animated.Value(0),
        };
        animations.current.push(newTake); // Store the new animation in the ref
        setCustomTakes([...customTakes, newTake]);
    };

    const handleButtonNext = () => {
        navigation.navigate("QuantitiesInstruction", { newInstruction, user, takes: customTakes });
    };

    const ShowAlertDelete = (index: number) => {
        Alert.alert(
            "Supprimer",
            "Voulez-vous vraiment supprimer cette prise ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    onPress: () => handleDeleteItem(index),
                    style: "destructive"
                }
            ]
        );
    };

    const handleDateChange = (take) => (date) => {
        const updatedTakes = customTakes.map((item) => {
            if (item.id === take.id) {
                return {
                    ...item,
                    date: date.toString(),
                };
            }
            return item;
        });

        setCustomTakes(updatedTakes);
    };

    const animateOtherItems = (index: number) => { // TODO: Try to make it work to add an animation to the other items
        customTakes.forEach((item, i) => {
            console.log("i", i);
            if (i !== index && i > index) {
                console.log("*i", i);
                Animated.timing(item.translateY, {
                    toValue: -55,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        });
    };

    const handleDeleteItem = (index) => {
        const item = customTakes[index];
        Animated.timing(item.animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            const updatedTakes = customTakes.filter((item, i) => i !== index);
            setCustomTakes(updatedTakes);
            //animateOtherItems(index);
        });

    };

    return (
        <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100">
            <AlertNotificationRoot>
                <View className="flex-1">
                    <PageTitle title={newInstruction.name} />
                    <ScrollView className="flex-1">
                        <View className="px-4 pb-10">
                            <View className="mb-10">
                                <Text className="color-grey-200 text-2xl font-medium mb-2">{"Fréquence"}</Text>
                                <GaiaChoiceButtons
                                    buttons={[
                                        { placeholder: "Régulier", selected: true },
                                        { placeholder: "Flexible", selected: false },
                                    ]}
                                    onSelectionChange={handleSelectionChange}
                                    canBeMultiple={false}
                                    orientation={"horizontal"}
                                    gap={""}
                                />
                            </View>
                            {regularity === "Régulier" ? (
                                <View>
                                    <Text className="color-grey-200 text-2xl font-medium mb-2">{"Heure de prise"}</Text>
                                </View>
                            ) : (
                                <View>
                                    <Text className="color-grey-200 text-2xl font-medium mb-2">{"Prises"}</Text>
                                    {customTakes.length > 0 && (
                                        <FlatList
                                            data={customTakes}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={({ item, index }) => (
                                                <Animated.View
                                                style={{
                                                    opacity: item.animation, // Bind the opacity to the animation value
                                                    transform: [{ translateY: item.translateY }] // Add vertical movement
                                                }}
                                                className="flex-row"
                                            >
                                                <GaiaDateTimePicker
                                                    date={new Date(item.date)}
                                                    mode={"datetime"}
                                                    buttonPlaceholder={"Date et heure"}
                                                    onLongPress={() => ShowAlertDelete(index)}
                                                    buttonDisabled={undefined}
                                                    onDateChange={handleDateChange(item)}
                                                />
                                            </Animated.View>
                                            )}
                                        />
                                    )}
                                    
                                </View>
                            )}

                            <GaiaButtonB margin={"mt-4"} title={"Ajouter une prise"} onPress={handleAddTakeCustom} />
                        </View>
                    </ScrollView>

                    <LinearGradient
                        colors={['#1F1F1F00', '#1F1F1FFF']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 30,
                        }}
                    />
                </View>

                {/* Bottom buttons */}
                <View className="w-[100%] flex-row justify-around py-8 bg-grey-100">
                    <GaiaButtonB width="45%" title="Précédent" onPress={() => navigation.goBack()} />
                    <GaiaButtonA
                        width="45%"
                        disabled={false} // Replace with your validation logic
                        title="Suivant"
                        onPress={handleButtonNext}
                    />
                </View>
            </AlertNotificationRoot>
        </SafeAreaView>
    );
}
