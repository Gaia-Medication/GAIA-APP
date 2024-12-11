import ButtonA from "app/component/GaiaButtonA";
import GaiaDateTimePicker from "app/component/GaiaDateTimePicker";
import GaiaInput from "app/component/GaiaInput";
import { GaiaTitleInput } from "app/component/GaiaTitleInput";
import PageTitle from "app/component/PageTitle";
import React from "react";
import { View } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CreateTreatment({ route, navigation }) {
    const [treatmentName, setTreatmentName] = React.useState("My Treatment");
    const [treatmentDescription, setTreatmentDescription] = React.useState("");
    const [treatmentStartDate, setTreatmentStartDate] = React.useState(new Date());

    const isDateCorrect = (date: Date): boolean => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return false;
        }

        const today = new Date();
        if (date < today) {
            return false;
        }
    
        return true;
    };

    const canContinue = (): boolean => {
        // TODO Check if TreatmentName is available
        
        if ((treatmentName === "") || (!isDateCorrect(treatmentStartDate))) return false;
        
        return true;
    }

    return (
        <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100 px-4">
            <AlertNotificationRoot>
                <PageTitle title={"Nouveau traitement"} />
                <View className="flex-1">

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

                    <GaiaDateTimePicker
                        buttonPlaceholder="Début"
                        buttonDisabled={false}
                        onDateChange={(date: Date) => setTreatmentStartDate(date)}
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

                </View>


                <View className="w-full flex-row justify-center bg-red-30">
                    <ButtonA
                        disabled={!canContinue()}
                        title="Suivant"
                        onPress={() => navigation.navigate("SearchMedication")}
                    />
                </View>

            </AlertNotificationRoot>
        </SafeAreaView>
    );

}