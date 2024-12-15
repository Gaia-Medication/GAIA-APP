import GaiaButtonA from "app/component/Buttons/GaiaButtonA";
import ButtonA from "app/component/Buttons/GaiaButtonA";
import GaiaDateTimePicker from "app/component/Pickers/GaiaDateTimePicker";
import GaiaInput from "app/component/Inputs/GaiaInput";
import { GaiaTitleInput } from "app/component/Inputs/GaiaTitleInput";
import PageTitle from "app/component/PageTitle";
import React from "react";
import { View } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { NewInstruction } from "types/Medical";
import GaiaChoiceButtons from "app/component/Buttons/GaiaChoiceButtons";


export default function CreateInstruction({ route, navigation }) {
    const { newInstruction, user } = route.params as {
        newInstruction: NewInstruction;
        user: User;
    };
    const [regularity, setRegularity] = React.useState("");
    const handleSelectionChange = (selectedRegularity: string) => {
        console.log("Selected Buttons:", selectedRegularity);
    };

    const canContinue = (): boolean => {
        return true;
    }

    return (
        <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100 px-4">
            <AlertNotificationRoot>
                <PageTitle title={newInstruction.name} />
                <GaiaChoiceButtons
                    buttons={
                        [{placeholder: "Régulier", selected: true}, {placeholder: "Flexible", selected: false}]
                    }
                    canBeMultiple={undefined}
                    orientation={"horizontal"}
                    gap={"30px"}
                    onSelectionChange={handleSelectionChange}
                />


            </AlertNotificationRoot>
        </SafeAreaView>
    );

}