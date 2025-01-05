import GaiaButtonA from "../../../components/Buttons/GaiaButtonA";
import PageTitle from "../../../components/PageTitle";
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";
import { NewInstruction, QuantityMode, Take } from "types/Medical";
import GaiaButtonB from "../../../components/Buttons/GaiaButtonB";
import GaiaChoiceButtons from "../../../components/Buttons/GaiaChoiceButtons";
import { GaiaDropdownMenu } from "components/Pickers/GaiaDropdownMenu";
import GaiaInput from "components/Inputs/GaiaInput";

interface IQuantityUnit {
    label: string;
    value: string;
}

export default function QuantitiesInstruction({ route, navigation }) {
    const { newInstruction, user, takes } = route.params as {
        newInstruction: NewInstruction;
        user: User;
        takes: Take[];
    };
    const [quantityMode, setQuantityMode] = useState<QuantityMode>(QuantityMode.REGULAR);
    const [quantityUnit, setQuantityUnit] = useState<IQuantityUnit>({ label: "Comprimé(s)", value: "comprimé" });
    const [quantityUnitsOpen, setQuantityUnitsOpen] = useState<boolean>(false);
    const quantityUnits = [
        { label: "Comprimé", value: "comprimé" },
        { label: "Goutte", value: "goutte" },
        { label: "Cuillère(s)", value: "cuillère" },
        { label: "Unité(s)", value: "unité" },
        { label: "ml", value: "ml" },
        { label: "mg", value: "mg" },
        { label: "g", value: "g" },
        { label: "UI", value: "UI" },
        { label: "Autre", value: "autre" }
    ]

    // Quand mode = REGULAR
    const [regularQuantity, setRegularQuantity] = useState<number>(1);
    // Quand mode = CUSTOM
    const [customQuantities, setCustomQuantities] = useState<number[]>(
        () => takes.map(() => 1) // Par défaut: 1 comprimé par prise (à adapter)
    );

    

    const handleSelectionChange = (selecteQuantityMode: string) => {
        setQuantityMode(selecteQuantityMode === 'Constante' ? QuantityMode.REGULAR : QuantityMode.CUSTOM);
    };

    const canContinue = (): boolean => {
        return true;
    }

    return (
        <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100 px-4">
            <AlertNotificationRoot>
                <View className="flex-1">
                    <PageTitle title={newInstruction.name} />

                    {/* Choix du mode de quantité */}
                    <View className="py-4">
                        <Text className="color-grey-200 text-2xl font-medium mb-2">
                            {"Quantité"}
                        </Text>
                        <GaiaChoiceButtons
                            buttons={[
                                { placeholder: "Constante", selected: quantityMode === QuantityMode.REGULAR },
                                { placeholder: "Variable", selected: quantityMode === QuantityMode.CUSTOM },
                            ]}
                            onSelectionChange={handleSelectionChange}
                            canBeMultiple={false}
                            orientation={"horizontal"}
                            gap={"4"}
                        />
                    </View>

                    <ScrollView style={{ flex: 1 }}>
                        {quantityMode === QuantityMode.REGULAR && (
                            <View>
                                <GaiaInput
                                    placeholder="Quantité"
                                    value={String(regularQuantity)}
                                    width={"10"}
                                    onChangeText={setRegularQuantity}
                                />

                                {/* Unité de quantité */}
                                <GaiaDropdownMenu
                                    placeholder={quantityUnit.label}
                                    visible={quantityUnitsOpen}
                                    handleClose={() => setQuantityUnitsOpen(false)}
                                    handleOpen={() => setQuantityUnitsOpen(true)}
                                    menuItems={quantityUnits}
                                    onMenuItemPress={(item) => {
                                        setQuantityUnit(quantityUnits.find((unit) => unit.value === item));
                                        setQuantityUnitsOpen(false);
                                    }}
                                />
                            </View>
                        )}

                        {quantityMode === QuantityMode.CUSTOM && (
                            <View>
                                <GaiaDropdownMenu
                                    placeholder={quantityUnit.label}
                                    visible={quantityUnitsOpen}
                                    handleClose={() => setQuantityUnitsOpen(false)}
                                    handleOpen={() => setQuantityUnitsOpen(true)}
                                    menuItems={quantityUnits}
                                    onMenuItemPress={(item) => {
                                        setQuantityUnit(quantityUnits.find((unit) => unit.value === item));
                                        setQuantityUnitsOpen(false);
                                    }}
                                />
                                <View className="bg-grey-300 p-4 rounded-lg">
                                    <TextInput
                                        className="bg-grey-200 p-2 rounded-lg mb-4"    
                                        placeholder="Prise 1"
                                        value={String(customQuantities[0])}
                                        onChangeText={(text) => {
                                            set
                                        }}
                                    />
                                    <GaiaButtonB
                                        margin="mb-4"
                                        title="Définir une même quantité pour toutes les prises"
                                        onPress={() => bulkSetCustomQuantity("2")} // exemple: on force toutes les prises à "2"
                                    />
                                </View>
                                {customQuantities.map((quantity, index) => (
                                    <View key={index}>
                                        <GaiaInput
                                            placeholder={`Prise ${index + 1}`}
                                            value={String(quantity)}
                                            width={"10"}
                                            onChangeText={(text) => {
                                                const newQuantities = [...customQuantities];
                                                newQuantities[index] = parseInt(text, 10);
                                                setCustomQuantities(newQuantities);
                                            }}
                                        />
                                    </View>
                                ))}
                                {/* Bouton d’édition globale (bulk) */}
                                <GaiaButtonB
                                    margin="mb-4"
                                    title="Définir une même quantité pour toutes les prises"
                                    onPress={() => bulkSetCustomQuantity("2")} // exemple: on force toutes les prises à "2"
                                />
                                {takes.map((take, index) => (
                                    <View key={take.id} style={{ marginBottom: 10 }}>
                                        <Text>Prise {index + 1}</Text>
                                        <Text>Date : {take.dateTime}</Text>

                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                </View>
                <View className="w-[100%] flex-row justify-around py-8 bg-grey-100">
                    <GaiaButtonB width="45%" title="Précédent" onPress={() => navigation.goBack()} />
                    <GaiaButtonA
                        width="45%"
                        disabled={!canContinue()} // Replace with your validation logic
                        title="Suivant"
                        onPress={undefined}
                    />
                </View>

            </AlertNotificationRoot>
        </SafeAreaView>
    );

}