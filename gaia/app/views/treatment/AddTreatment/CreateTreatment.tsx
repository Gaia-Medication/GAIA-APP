import React from "react";
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard
} from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";

// Your existing imports
import GaiaButtonA from "../../../components/Buttons/GaiaButtonA";
import GaiaDateTimePicker from "../../../components/Pickers/GaiaDateTimePicker";
import GaiaInput from "../../../components/Inputs/GaiaInput";
import PageTitle from "../../../components/PageTitle";
import GaiaButtonB from "../../../components/Buttons/GaiaButtonB";

export default function CreateTreatment({ route, navigation }) {
    const { user } = route.params as {
        user: User;
    };
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
        if (treatmentName === "" || !isDateCorrect(treatmentStartDate)) return false;
        return true;
    };

    return (
        <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100 px-4">
            <AlertNotificationRoot>
                {/* 
          KeyboardAvoidingView: Ensures inputs stay above the keyboard.
          ScrollView: Allows scroll if the screen's content is taller than the viewport. 
        */}
                <KeyboardAvoidingView
                    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
                    behavior="padding"
                    style={{ flex: 1, paddingBottom: 20 }}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <PageTitle title={"Nouveau traitement"} />

                        <View className="flex-1">
                            <GaiaInput
                                value={treatmentName}
                                onChangeText={(text: string) => {
                                    setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1));
                                }}
                                placeholder={"Nom du traitement"}
                                width={undefined}
                            />

                            <GaiaDateTimePicker
                                date={treatmentStartDate}
                                onLongPress={() => { }}
                                buttonPlaceholder="Début"
                                buttonDisabled={false}
                                onDateChange={(date: Date) => setTreatmentStartDate(date)}
                                mode={"date"}
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

                        <View className="w-[100%] flex-row justify-around bg-red-30 mb-4">
                            <GaiaButtonB
                                title="Précédent"
                                onPress={() => {
                                    navigation.goBack();
                                }}
                                width={"45%"}
                            />
                            <GaiaButtonA
                                disabled={false} // You can replace with !canContinue() if you want to disable it conditionally
                                title="Suivant"
                                onPress={() => {
                                    // dimsiss then navigate
                                    Keyboard.dismiss();
                                    navigation.navigate("DrugsTreatment", { user })
                                }
                                }
                                width={"45%"}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </AlertNotificationRoot>
        </SafeAreaView>
    );
}
