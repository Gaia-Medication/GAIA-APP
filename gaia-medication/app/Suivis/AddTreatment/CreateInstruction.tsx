import GaiaButtonA from "app/component/Buttons/GaiaButtonA";
import GaiaDateTimePicker from "app/component/Pickers/GaiaDateTimePicker";
import PageTitle from "app/component/PageTitle";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Alert, ScrollView, Animated, Dimensions } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NewInstruction, Take } from "types/Medical";
import GaiaChoiceButtons from "app/component/Buttons/GaiaChoiceButtons";
import GaiaButtonB from "app/component/Buttons/GaiaButtonB";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from '@react-native-community/blur';

const PageHeader = ({ scrollY }) => {
    const screenWidth = Dimensions.get('window').width;
    const [titleWidth, setTitleWidth] = useState(0); // To store title width
    const titleRef = useRef(null);
  
    // Header height transition (fixed height in this case)
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [50, 50], // Fixed header height (50px)
        extrapolate: 'clamp',
    });

    // Title scale (shrinks as you scroll)
    const titleScale = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0.5], // Title shrinks as you scroll
        extrapolate: 'clamp',
    });

    // Title opacity (fades out as you scroll)
    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0.8], // Title fades as you scroll
        extrapolate: 'clamp',
    });

    // Title vertical movement (moves down as you scroll)
    const titleTranslateX = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, screenWidth], // Dynamically center based on title width
        extrapolate: 'clamp',
      });

    return (
        <Animated.View
            style={{ height: headerHeight, opacity: titleOpacity }}
            className="flex-row justify-start items-center dark:bg-grey-800 w-screen position-fixed z-10"
        >
            {/* Title text */}
            <Animated.Text
                ref={titleRef}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout; 
                  setTitleWidth(width); // Set the title width dynamically
                }}
                style={[
                    {
                        transform: [{ scale: titleScale }, { translateX: titleTranslateX }],
                        opacity: titleOpacity,
                    },
                ]}
                className="text-4xl font-bold text-black dark:text-white text-center"
            >
                {"HOLA"}
            </Animated.Text>
        </Animated.View>
    );

};

export default function CreateInstruction({ route, navigation }) {
    const { newInstruction, user } = route.params as {
        newInstruction: NewInstruction;
        user: User;
    };
    const scrollY = new Animated.Value(0);
    const [regularity, setRegularity] = useState("");
    const [customTakes, setCustomTakes] = useState<Take[]>([]);

    const handleSelectionChange = (selectedRegularity: string) => {
        setRegularity(selectedRegularity);
    };

    const handleAddTakeCustom = () => {
        setCustomTakes([...customTakes, {
            userId: user.id,
            treatmentName: newInstruction.name,
            CIS: newInstruction.CIS,
            date: new Date().toString(),
            quantity: 1,
            taken: false,
            review: "",
            pain: 0
        }]);
    }

    const handleButtonNext = () => {

        navigation.navigate("QuantitiesInstruction", {
            newInstruction,
            user,
            takes: customTakes
        });
    };

    const ShowAlertDelete = (index: number) => {
        Alert.alert(
            "Supprimer",
            "Voulez-vous vraiment supprimer cette prise ?",
            [
                {
                    text: "Annuler",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () => setCustomTakes(customTakes.filter((_, i) => i !== index)), style: "destructive" }
            ]
        );
    }

    const canContinue = (): boolean => {
        return true;
    }

    return (
        <SafeAreaView className="bg-white w-full h-full dark:bg-grey-100">
            <AlertNotificationRoot>
                <View className="flex-1">
                    <PageHeader scrollY={scrollY} />
                    <ScrollView
                        className="flex-1"
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    >
                        <View className="px-4">
                            <View className="mb-10 ">
                                <Text className="color-grey-200 text-2xl font-medium mb-2">{"Fréquence"}</Text>
                                <GaiaChoiceButtons
                                    buttons={[
                                        { placeholder: "Régulier", selected: true },
                                        { placeholder: "Flexible", selected: false }
                                    ]}
                                    canBeMultiple={undefined}
                                    orientation={"horizontal"}
                                    gap={"30px"}
                                    onSelectionChange={handleSelectionChange}
                                />
                            </View>
                            {regularity === "Régulier" ? (
                                <View>
                                    <Text className="color-grey-200 text-2xl font-medium mb-2">{"Heure de prise"}</Text>
                                </View>
                            ) : (
                                <View>
                                    <Text className="color-grey-200 text-2xl font-medium mb-2">{"Prises"}</Text>
                                    {customTakes.map((take, index) => (
                                        <View key={index} className="flex-row">
                                            <GaiaDateTimePicker
                                                mode={"datetime"}
                                                buttonDisabled={false}
                                                buttonPlaceholder={"Date et heure"}
                                                onDateChange={(date) => {
                                                    customTakes[index].date = date.toString();
                                                }}
                                                onLongPress={() => {
                                                    ShowAlertDelete(index);
                                                }}
                                            />
                                        </View>
                                    ))}

                                    <GaiaButtonB
                                        margin={"mt-4"}
                                        title={"Ajouter une prise"}
                                        onPress={() => handleAddTakeCustom()}
                                    />
                                </View>
                            )}
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
                    <GaiaButtonB
                        width="45%"
                        title="Précédent"
                        onPress={() => navigation.goBack()}
                    />
                    <GaiaButtonA
                        width="45%"
                        disabled={!canContinue()}
                        title="Suivant"
                        onPress={() => handleButtonNext()}
                    />
                </View>

            </AlertNotificationRoot>
        </SafeAreaView>
    );


}