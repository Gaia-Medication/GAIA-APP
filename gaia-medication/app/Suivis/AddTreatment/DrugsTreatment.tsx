import GaiaButtonA from "app/component/Buttons/GaiaButtonA";
import GaiaButtonB from "app/component/Buttons/GaiaButtonB";
import GaiaItemsSelected from "app/component/GaiaItemsSelected";
import GaiaSearchList from "app/component/GaiaSearchList";
import PageTitle from "app/component/PageTitle";
import { searchMed } from "dao/Search";
import React, { useCallback, useRef } from "react";
import { View, Text, Modal } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { SearchDrug } from "types/Search";
import { NewInstructionFactory } from "types/Factories";
import { Instruction, NewInstruction } from "types/Medical";
import ModalInstructionDetails from "app/component/ModalInstructionDetail";
import { getMedbyCIS } from "dao/Meds";


export default function DrugsTreatment({ route, navigation }) {
    const { user } = route.params as {
        user: User;
    };

    const [selectedDrug, setSelectedDrug] = React.useState(undefined); // * Used to be passed to the CreateInstruction screen
    const [selectedInstruction, setSelectedInstruction] = React.useState(undefined); // * Used to display information about a selected instruction in the modal
    const [instructionModalVisible, setInstructionModalVisible] = React.useState(false); // * Used to display information about a created instruction

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setInstructionModalVisible(false);
        }
    }, []);

    const handleDrugSelection = async (drug: SearchDrug) => {
        const newInstruction = NewInstructionFactory(drug);
        console.log(newInstruction);
        navigation.navigate("CreateInstruction", { newInstruction: newInstruction, user: user });
    };

    const handleInstructionClick = (instruction: NewInstruction) => {
        console.log(instruction);
        setSelectedInstruction(instruction);
        let drugRelated = getMedbyCIS(instruction.CIS);
        setSelectedDrug(drugRelated);
        setInstructionModalVisible(true);
    };

    const canContinue = (): boolean => {
        // TODO Check if TreatmentName is available

        for (const instruction of TESTinstructions) {
            if (!instruction.completed) {
                return false;
            }
        }
        
        return true;
    }

    const TESTinstructions: NewInstruction[] = [
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
            endDate: new Date("2024-12-31").toISOString(),
            endQuantity: undefined,
            quantity: 1,
            takes: [
                {
                    userId: 101,
                    treatmentName: "Medication A",
                    CIS: 67119691,
                    date: new Date("2024-12-10T08:00:00").toISOString(),
                    quantity: 1,
                    taken: false,
                    review: "No issues",
                    pain: 0
                },
                {
                    userId: 101,
                    treatmentName: "Medication A",
                    CIS: 67119691,
                    date: new Date("2024-12-10T20:00:00").toISOString(),
                    quantity: 1,
                    taken: true,
                    review: "Slight nausea",
                    pain: 2
                }
            ],
            completed: true
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
                    date: new Date("2024-12-11T09:00:00").toISOString(),
                    quantity: 2,
                    taken: true,
                    review: "Effective",
                    pain: 0
                },
                {
                    userId: 102,
                    treatmentName: "Reparil",
                    CIS: 62826517,
                    date: new Date("2024-12-13T09:00:00").toISOString(),
                    quantity: 2,
                    taken: false,
                    review: "Missed dose",
                    pain: 1
                }
            ],
            completed: true
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
                            onItemPressed={(item: SearchDrug) => {
                                handleDrugSelection(item);
                            }}
                            onItemMaintained={undefined}
                            allergies={user.allergies}
                        />
                        <GaiaItemsSelected
                            items={TESTinstructions}
                            onItemPressed={(item: NewInstruction) => {
                                handleInstructionClick(item);
                            }}
                        />

                        <Modal
                            animationType="slide"
                            presentationStyle="pageSheet"
                            visible={instructionModalVisible}
                            onRequestClose={() => {
                                setInstructionModalVisible(false);
                            }}
                        >
                            <ModalInstructionDetails
                                instruction={selectedInstruction}
                                drugRelated={selectedDrug}
                                onClickClose={() => setInstructionModalVisible(false)}
                                onClickValidate={() => setInstructionModalVisible(false)}
                                canValidate={false}
                            />
                        </Modal>

                    </View>
                    <View className="w-[100%] flex-row justify-around bg-red-30 mb-4">
                        <GaiaButtonB
                            width="45%"
                            title="Précédent"
                            onPress={() => navigation.goBack()}
                        />
                        <GaiaButtonA
                            width="45%"
                            disabled={!canContinue()}
                            title="Suivant"
                            onPress={() => navigation.navigate("DrugsTreatment")}
                        />
                    </View>

                </AlertNotificationRoot>
            </SafeAreaView>
        </GestureHandlerRootView>
    );

}