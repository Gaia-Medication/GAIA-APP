import GaiaDateTimePicker from "app/component/GaiaDateTimePicker";
import GaiaInput from "app/component/GaiaInput";
import GaiaItemsSelected from "app/component/GaiaItemsSelected";
import GaiaSearchList from "app/component/GaiaSearchList";
import { GaiaTitleInput } from "app/component/GaiaTitleInput";
import MedIconByType from "app/component/MedIconByType";
import ModalComponent from "app/component/Modal";
import PageTitle from "app/component/PageTitle";
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { Icon } from "react-native-elements";
import { ArrowRightCircle } from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CreateTreatment({ route, navigation }) {
    const [treatmentName, setTreatmentName] = React.useState("My Treatment");
    const [treatmentDescription, setTreatmentDescription] = React.useState("");
    const [treatmentStartDate, setTreatmentStartDate] = React.useState(new Date());

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
        <SafeAreaView className="flex bg-white w-full h-full dark:bg-grey-100 p-4">
            <AlertNotificationRoot>
                <PageTitle title={"Nouveau traitement"} />
                <View className="flex w-full">

                    <GaiaInput
                        value={treatmentName}
                        onChangeText={(text: string) => {
                            setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1))
                        }}
                        placeholder={"Nom du traitement"}
                        width={undefined}
                    />
                    <GaiaTitleInput
                        value={treatmentName}
                        onChangeText={(text: string) => {
                            setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1))
                        }}
                        placeholder={"Nom du traitement"}
                        width={undefined}
                    />

                    <GaiaInput
                        value={treatmentDescription}
                        onChangeText={(text: string) => {
                            setTreatmentDescription(
                                text.charAt(0).toUpperCase() + text.slice(1)
                            );
                        }}
                        placeholder={"Description du traitement"}
                        width={undefined}
                        numberOfLines={5}
                    />

                    <Text className="mx-3">
                        Date de début
                    </Text>
                    <GaiaDateTimePicker
                        buttonPlaceholder="Sélectionner une date"
                        buttonDisabled={false}
                        onDateChange={(date: Date) => setTreatmentStartDate(date)}
                    />
                </View>
            </AlertNotificationRoot>
        </SafeAreaView>
    );

}