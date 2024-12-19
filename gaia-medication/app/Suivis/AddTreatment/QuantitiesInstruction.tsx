import GaiaButtonA from "app/component/Buttons/GaiaButtonA";
import GaiaDateTimePicker from "app/component/Pickers/GaiaDateTimePicker";
import PageTitle from "app/component/PageTitle";
import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { NewInstruction, Take } from "types/Medical";
import GaiaChoiceButtons from "app/component/Buttons/GaiaChoiceButtons";
import GaiaButtonB from "app/component/Buttons/GaiaButtonB";
import { formatDate } from "app/utils/functions";
import { ScrollView } from "react-native-gesture-handler";

export default function QuantitiesInstruction({ route, navigation }) {
    const { newInstruction, user, takes } = route.params as {
        newInstruction: NewInstruction;
        user: User;
        takes: Take[];
    };
    const [customTakes, setCustomTakes] = useState<Take[]>(takes);

    const canContinue = (): boolean => {
        return true;
    }

    return (
        <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100 px-4">
            <AlertNotificationRoot>

                <PageTitle title={newInstruction.name} />


                <ScrollView className="flex-1">
                    <View className="flex-1">
                        {customTakes.map((take, index) => (
                            <View key={index} className="flex-row justify-between items-center border-b border-grey-30 py-2">
                                <View>
                                    <Text className="text-white">{formatDate("dd:mmm:yyyy", new Date(take.date))}</Text>
                                    <Text className="text-white">{formatDate("hh:mm", new Date(take.date))}</Text>
                                </View>
                                <Text>{take.quantity}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>



                <View className="w-[100%] flex-row justify-around bg-red-30 mb-4 bg-red-300">
                    <GaiaButtonB
                        width="45%"
                        title="Précédent"
                        onPress={() => navigation.goBack()}
                    />
                    <GaiaButtonA
                        width="45%"
                        disabled={!canContinue()}
                        title="Suivant"
                        onPress={() => navigation.navigate("QuantitiesInstruction", { newInstruction, user })}
                    />
                </View>
            </AlertNotificationRoot>
        </SafeAreaView>
    );

}