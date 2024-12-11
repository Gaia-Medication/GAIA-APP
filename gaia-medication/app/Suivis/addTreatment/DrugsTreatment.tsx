import GaiaButtonA from "app/component/GaiaButtonA";
import ButtonA from "app/component/GaiaButtonA";
import GaiaButtonB from "app/component/GaiaButtonB";
import GaiaDateTimePicker from "app/component/GaiaDateTimePicker";
import GaiaInput from "app/component/GaiaInput";
import GaiaItemsSelected from "app/component/GaiaItemsSelected";
import GaiaSearchList from "app/component/GaiaSearchList";
import GaiaSearchResults from "app/component/GaiaSearchResults";
import { GaiaTitleInput } from "app/component/GaiaTitleInput";
import PageTitle from "app/component/PageTitle";
import { getMedbyCIS } from "dao/Meds";
import { searchMed } from "dao/Search";
import React, { useCallback, useRef } from "react";
import { View, Text } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";


export default function DrugsTreatment({ route, navigation }) {
    const { user } = route.params as {
        user: User;
    };
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [selectedDrug, setSelectedDrug] = React.useState(undefined);
    const [instructionsModalVisible, setInstructionsModalVisible] = React.useState(false);

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setInstructionsModalVisible(false);
        }
    }, []);

    // Snap points for the Bottom Sheet
    const snapPoints = ['25%', '90%'];

    const handleDrugSelection = async (CIS) => {
        const drug = await getMedbyCIS(CIS);
        console.log("Drug selected => ", drug);
        setSelectedDrug(drug);
        setInstructionsModalVisible(true);
    };

    const TESTinstructions: Instruction[] = [
        {
            CIS: 67119691,
            name: "Doliprane",
            regularFrequency: true,
            regularFrequencyMode: "Daily",
            regularFrequencyNumber: 2,
            regularFrequencyPeriods: "Day",
            regularFrequencyContinuity: "Daily",
            regularFrequencyDays: [],
            endModality: "EndDate",
            endDate: new Date("2024-12-31"),
            endQuantity: undefined,
            quantity: 1,
            takes: [
                {
                    userId: 101,
                    treatmentName: "Medication A",
                    CIS: 67119691,
                    date: new Date("2024-12-10T08:00:00"),
                    quantity: 1,
                    taken: false,
                    review: "No issues",
                    pain: 0
                },
                {
                    userId: 101,
                    treatmentName: "Medication A",
                    CIS: 67119691,
                    date: new Date("2024-12-10T20:00:00"),
                    quantity: 1,
                    taken: true,
                    review: "Slight nausea",
                    pain: 2
                }
            ]
        },
        {
            CIS: 62826517,
            name: "Reparil",
            regularFrequency: true,
            regularFrequencyMode: "Weekly",
            regularFrequencyNumber: 3,
            regularFrequencyPeriods: "Week",
            regularFrequencyContinuity: "Custom",
            regularFrequencyDays: ["Monday", "Wednesday", "Friday"],
            endModality: "Quantity",
            endDate: undefined,
            endQuantity: 15,
            quantity: 2,
            takes: [
                {
                    userId: 102,
                    treatmentName: "Reparil",
                    CIS: 62826517,
                    date: new Date("2024-12-11T09:00:00"),
                    quantity: 2,
                    taken: true,
                    review: "Effective",
                    pain: 0
                },
                {
                    userId: 102,
                    treatmentName: "Reparil",
                    CIS: 62826517,
                    date: new Date("2024-12-13T09:00:00"),
                    quantity: 2,
                    taken: false,
                    review: "Missed dose",
                    pain: 1
                }
            ]
        }
    ];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100 px-4">
                <AlertNotificationRoot>
                    <PageTitle title={"Nouveau traitement"} />
                    <View className="flex-1">

                        <GaiaSearchList
                            inputPlaceholder="Rechercher un médicament"
                            searchFunction={searchMed}
                            editable={true}
                            onItemPressed={(itemCIS: string) => {
                                handleDrugSelection(itemCIS);
                                bottomSheetRef.current?.snapTo(1);
                            }}
                            onItemMaintained={undefined}
                            allergies={user.allergies}
                        />
                        <GaiaItemsSelected
                            items={TESTinstructions}
                        />

                    </View>
                    <View className="w-[100%] flex-row justify-around bg-red-30">
                        <GaiaButtonB
                            width="45%"
                            title="Précédent"
                            onPress={() => navigation.goBack()}
                        />
                        <GaiaButtonA
                            width="45%"
                            disabled={true}
                            title="Suivant"
                            onPress={() => navigation.navigate("DrugsTreatment")}
                        />
                    </View>

                </AlertNotificationRoot>
            </SafeAreaView>
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                enableDynamicSizing={true}
                onChange={handleSheetChanges}
                maxDynamicContentSize={130}
                handleStyle={{
                    backgroundColor: '#090909',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}
                handleIndicatorStyle={{
                    backgroundColor: 'white',
                }}
            >
                <BottomSheetScrollView
                    style={{
                        backgroundColor: '#090909'
                    }}
                >
                    <ScrollView>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                        <Text className="text-white text-center font-semibold text-2xl mt-4 mb-4">{selectedDrug?.name}</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Instructions</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Présentation</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Contre-indications</Text>
                        <Text className="text-white text-center font-semibold text-lg mt-4 mb-4">Effets secondaires</Text>
                    </ScrollView>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    );

}