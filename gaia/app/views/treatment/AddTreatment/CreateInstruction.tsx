import React, { useState, useRef } from "react";
import { View, Text, Alert, ScrollView, Animated } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import GaiaChoiceButtons from "../../../components/Buttons/GaiaChoiceButtons";
import GaiaButtonB from "../../../components/Buttons/GaiaButtonB";
import GaiaButtonA from "../../../components/Buttons/GaiaButtonA";
import GaiaDateTimePicker from "../../../components/Pickers/GaiaDateTimePicker";
import PageTitle from "../../../components/PageTitle";
import { GaiaDropdownMenu } from "../../../components/Pickers/GaiaDropdownMenu";
import LinearGradient from "react-native-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GaiaButtonD from "components/Buttons/GaiaButtonD";
import { CustomTake, RegularContinuityMode, RegularIntervalType, RegularIntervalUnit } from "types/Medical";
import { RegularTakesTime } from "./components/RegularTakesTime.tsx";
import { Calendar, CalendarTheme, toDateId } from "@marceloterreiro/flash-calendar";
import { GaiaCalendar } from "components/GaiaCalendar";
import { Modal } from "react-native";

export default function CreateInstruction({ route, navigation }) {
    // ! ADD IMPOSSIBILITY TO SELECT A DATE ALREADY USED IN A TAKE (id conflict)
    const { newInstruction, user } = route.params;

    const [regularity, setRegularity] = useState("Régulier");
    const [customTakes, setCustomTakes] = useState<CustomTake[]>([]);
    const [numOpen, setNumOpen] = useState(false);
    const [freqOpen, setFreqOpen] = useState(false);
    const [regularityOpen, setRegularityOpen] = useState(false);
    const [frequencyNumber, setFrequencyNumber] = useState("1");
    const [frequencyPeriod, setFrequencyPeriod] = useState("jour");
    const [regularContinuityMode, setRegularContinuityMode] = useState<string>(RegularContinuityMode.DAILY.toString());

    const items = [
        { label: "jour", value: "day" },
        { label: "semaine", value: "week" },
    ];

    const numbers = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
    ];

    const regularContinuities = [
        { label: "Tous les jours", value: RegularContinuityMode.DAILY },
        { label: "Certains jours", value: RegularContinuityMode.CUSTOM },
    ];

    const [selectedItem, setSelectedItem] = useState("jour");

    /**
     *  Stockage séparé des Animated.Value pour que:
     *  - L'état de navigation ne contienne pas ces valeurs non sérialisables.
     *  - On associe animations.current[index] à un "take" donné.
     */
    const animations = useRef([]);

    const handleSelectionChange = (selectedRegularity) => {
        setRegularity(selectedRegularity);
    };

    const handleAddTakeCustom = () => {
        let newDate =
            customTakes.length > 0
                ? new Date(customTakes[customTakes.length - 1].date)
                : new Date();
        newDate.setHours(newDate.getHours() + 1);

        // Objet de prise (SANS Animated.Value)
        const newTake: CustomTake = {

            CIS: newInstruction.CIS,
            date: newDate.toString(),
            quantity: 1,
        };

        // On initialise l'animation associée dans un useRef séparé
        animations.current[customTakes.length] = {
            animation: new Animated.Value(1),
            translateY: new Animated.Value(0),
        };

        setCustomTakes([...customTakes, newTake]);
        console.log("customTakes => ", customTakes);
    };

    const handleRemoveAllTakes = () => {
        setCustomTakes([]);
        animations.current = [];
    };

    const ShowAlertDelete = (index) => {
        Alert.alert(
            "Supprimer",
            "Voulez-vous vraiment supprimer cette prise ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    onPress: () => handleDeleteItem(index),
                    style: "destructive",
                },
            ]
        );
    };

    const showAlertDeleteAll = () => {
        Alert.alert(
            "Supprimer tout",
            "Voulez-vous vraiment supprimer toutes les prises ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    onPress: handleRemoveAllTakes,
                    style: "destructive",
                },
            ]
        );
    }

    const handleDateChange = (take) => (date) => {
        const updatedTakes = customTakes.map((item) => {
            if (item.date === take.date) {
                return {
                    ...item,
                    date: date.toString(),
                };
            }
            return item;
        });

        setCustomTakes(updatedTakes);
    };

    const handleDeleteItem = (index) => {
        const itemAnimations = animations.current[index];
        if (itemAnimations) {
            // Animation de sortie
            Animated.timing(itemAnimations.animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Une fois l'animation terminée, on supprime la prise
                const updatedTakes = customTakes.filter((_, i) => i !== index);
                setCustomTakes(updatedTakes);

                // On retire aussi l'animation associée
                animations.current = animations.current.filter((_, i) => i !== index);

                // Optionnel: animateOtherItems(index);
            });
        } else {
            // S'il n'y avait pas d'animations pour cet index
            const updatedTakes = customTakes.filter((_, i) => i !== index);
            setCustomTakes(updatedTakes);
        }
    };

    const canContinue = () => {
        if (regularity === "Régulier") {
            return true;
        } else {
            if (customTakes.length === 0) {
                return false;
            }
            for (let i = 0; i < customTakes.length; i++) {
                if (new Date(customTakes[i].date) < new Date()) {
                    return false;
                }
                // TODO: Vérifier le délai d'au moins 1h entre deux prises
            }
            return true;
        }
    };

    const handleButtonNext = () => {
        navigation.navigate("QuantitiesInstruction", {
            newInstruction,
            user,
            takes: customTakes,
        });
    };

    const today = toDateId(new Date());

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100">
                <AlertNotificationRoot>
                    <View className="flex-1">
                        <PageTitle title={newInstruction.name} />
                        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                            <View className="px-4 pb-20">
                                {/* Choix Régulier/Flexible */}
                                <View className="mb-10">
                                    <Text className="color-grey-200 text-2xl font-medium mb-2">
                                        {"Fréquence"}
                                    </Text>
                                    <GaiaChoiceButtons
                                        buttons={[
                                            { placeholder: "Régulier", selected: true },
                                            { placeholder: "Flexible", selected: false },
                                        ]}
                                        onSelectionChange={handleSelectionChange}
                                        canBeMultiple={false}
                                        orientation={"horizontal"}
                                        gap={"4"}
                                    />
                                </View>

                                {/* Mode Régulier */}
                                {regularity === "Régulier" ? (
                                    <View>
                                        <Text className="color-grey-200 text-2xl font-medium mb-2">
                                            {"Sélectionner la fréquence"}
                                        </Text>
                                        <View className="flex-row items-center mb-4">
                                            <GaiaDropdownMenu
                                                placeholder={frequencyNumber}
                                                visible={numOpen}
                                                handleClose={() => setNumOpen(false)}
                                                handleOpen={() => setNumOpen(true)}
                                                menuItems={numbers}
                                                onMenuItemPress={setFrequencyNumber}
                                            />
                                            <Text className="text-white text-xl font-semibold mx-2">
                                                fois par
                                            </Text>
                                            <GaiaDropdownMenu
                                                visible={freqOpen}
                                                handleClose={() => setFreqOpen(false)}
                                                handleOpen={() => setFreqOpen(true)}
                                                menuItems={items}
                                                placeholder={frequencyPeriod}
                                                onMenuItemPress={setFrequencyPeriod}
                                            />
                                        </View>

                                        <RegularTakesTime
                                            CIS={newInstruction.CIS}
                                            frequencyNumber={parseInt(frequencyNumber)}
                                            frequencyUnit={RegularIntervalUnit.DAY}
                                            updateTakes={setCustomTakes}
                                        />

                                        <GaiaDropdownMenu
                                            placeholder={regularContinuityMode}
                                            visible={regularityOpen}
                                            handleClose={() => setRegularityOpen(false)}
                                            handleOpen={() => setRegularityOpen(true)}
                                            menuItems={regularContinuities}
                                            onMenuItemPress={setRegularContinuityMode}
                                        />

                                        <Modal
                                            visible={false}
                                            animationType="slide"
                                            presentationStyle="pageSheet"
                                        >
                                            <GaiaCalendar
                                                markedDates={customTakes.map((take) => new Date(take.date))}
                                                onDayPress={(date) => {
                                                    console.log("Date selected => ", date);
                                                }}
                                            />
                                        </Modal>

                                    </View>
                                ) : (

                                    // Mode Flexible
                                    <View>
                                        <View className="flex-row justify-between items-end mb-4">
                                            <Text className="color-grey-200 text-2xl font-medium mb-2">
                                                {"Prises "}{customTakes.length > 0 ? `(${customTakes.length})` : ""}
                                            </Text>
                                            <GaiaButtonD
                                                title={"Tout effacer"}
                                                onPress={showAlertDeleteAll}
                                                width={"45%"}
                                                disabled={customTakes.length === 0}
                                            />
                                        </View>
                                        {customTakes.length > 0 &&
                                            customTakes.map((item, index) => {
                                                // Récupération des Animated.Value pour l'item
                                                const currentAnimations = animations.current[index];
                                                return (
                                                    <Animated.View
                                                        key={item.date.toString()}
                                                        style={{
                                                            opacity: currentAnimations?.animation ?? 1,
                                                            transform: [
                                                                {
                                                                    translateY:
                                                                        currentAnimations?.translateY ?? 0,
                                                                },
                                                            ],
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
                                                );
                                            })}
                                        <GaiaButtonB
                                            margin={"mt-4"}
                                            title={"Ajouter une prise"}
                                            onPress={handleAddTakeCustom}
                                        />
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* Linear gradient en bas */}
                        <LinearGradient
                            colors={["#1F1F1F00", "#1F1F1FFF"]}
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: 80,
                            }}
                        />
                    </View>

                    {/* Bottom buttons */}
                    <View className="w-[100%] flex-row justify-around py-8 bg-grey-100">
                        <GaiaButtonB
                            width="45%"
                            title="Précédent"
                            onPress={() => navigation.goBack()}
                        />
                        <GaiaButtonA
                            width="45%"
                            disabled={!canContinue()}
                            title="Suivant"
                            onPress={handleButtonNext}
                        />
                    </View>
                </AlertNotificationRoot>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
