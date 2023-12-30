import { NavigationProp, ParamListBase, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { addItemToList, readList } from "../../dao/Storage";
import { View, Text, TextInput, FlatList, TouchableOpacity, Button } from "react-native";
import { Input } from "react-native-elements";
import MultipleSelect from "../component/MultipleSelect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../style/style";
import { getAllMed, getMedbyCIS } from "../../dao/Meds";
import ModalComponent from "../component/Modal";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton, Checkbox } from 'react-native-paper';

interface ICreateProps {
    navigation: NavigationProp<ParamListBase>;
}

export default function AddTreatment({ navigation }: ICreateProps) {
    const isFocused = useIsFocused();
    const [allMeds, setAllMeds] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedMed, setSelectedMed] = useState("");
    const [selectedMedCIS, setSelectedMedCIS] = useState("");
    const [searchText, setSearchText] = useState("");
    const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);
    const [instructionModalVisible, setInstructionModalVisible] = useState(false);
    const [treatmentName, setTreatmentName] = useState("");
    const [treatmentDescription, setTreatmentDescription] = useState("");
    const [instructions, setInstructions] = useState([]);
    const [frequency, setFrequency] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [checkFrequency, setCheckFrequency] = useState('');
    const [checkQty, setCheckQty] = useState('');
    const [checkLast, setCheckLast] = useState('');
    const [arrayOfDates, setArrayOfDates] = useState([]);
    const [digitInput, setDigitInput] = useState("0");
    const [dateDigitAssociations, setDateDigitAssociations] = useState({});
    const [selectAllText, setSelectAllText] = useState('Select All');
    const [selectAllColor, setSelectAllColor] = useState('red');
    const frequencyList = [
        { label: "Une seule fois", value: "null" },
        { label: "Toutes les 30 minutes", value: "00:30" },
        { label: "Toutes les heures", value: "01:00" },
        { label: "Toutes les 2 heures", value: "02:00" },
        { label: "Toutes les 3 heures", value: "03:00" },
        { label: "Toutes les 4 heures", value: "04:00" },
        { label: "Toutes les 5 heures", value: "05:00" },
        { label: "Toutes les 6 heures", value: "06:00" },
        { label: "Toutes les 8 heures", value: "08:00" },
        { label: "Tous les jours", value: "24:00" },
        { label: "Tous les 2 jours", value: "48:00" },
        { label: "Tous les 3 jours", value: "72:00" },
        { label: "Tous les 4 jours", value: "96:00" },
    ];
    const [quantity, setQuantity] = useState(0);
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };
    const [checkedDates, setCheckedDates] = useState([]);

    const toggleDate = (date) => {
        if (checkedDates.includes(date)) {
            // If date is already in the checkedDates array, remove it
            setCheckedDates(checkedDates.filter((d) => d !== date));
        } else {
            // If date is not in the checkedDates array, add it
            setCheckedDates([...checkedDates, date]);
        }
    }

    const init = async () => {
        const allMeds = getAllMed();
        const medsWithKey = allMeds.map((med) => ({
            id: med.CIS,
            label: med.Name,
        }));
        setAllMeds(medsWithKey);
    };

    const toggleSelectAll = () => {
        if (selectAllText === 'Select All') {
          setCheckedDates([...arrayOfDates]);
          setSelectAllText('Deselect All');
          setSelectAllColor('red'); // Change color to blue
        } else {
          setCheckedDates([]);
          setSelectAllText('Select All');
          setSelectAllColor('blue'); // Change color to blue
        }
      };

      const associateDigitWithDates = () => {
        const updatedAssociations = { ...dateDigitAssociations };
    
        checkedDates.forEach((date) => {
          updatedAssociations[date.toISOString()] = digitInput;
        });
    
        setDateDigitAssociations(updatedAssociations);
        console.log(updatedAssociations);
    
        // Reset digitInput to "0" after associating with selected dates
        setDigitInput("0");
      };

    const filteredData =
        searchText === ""
            ? allMeds
            : allMeds.filter((item) => item.label.toLowerCase().includes(searchText.toLowerCase())
            );

    const handleMedSelect = (med, CIS) => {
        setSelectedMed(med);
        setIsVisible(false);
        setSearchText("");
        setSelectedMedCIS(CIS);
        setInstructionModalVisible(true);
    };

    const handleInstructionSumbit = (CIS) => {
        const currentMed = getMedbyCIS(CIS);
        const instruction: Instruction = {
          CIS: currentMed.CIS,
          CIP: currentMed.Name,
          qty: quantity,
          frequency: frequency,
          endDate: endDate,
        };
        setInstructions([...instructions, instruction]);
      };

    // Formatte la date pour l'affichage
    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    const addDates = () => {
        let array = []
        let date = new Date(startDate);
  
        while (date < endDate) {
            array.push(new Date(date)); // Push a new Date object to avoid reference issues
            date.setDate(date.getDate() + 1);
        }
        setArrayOfDates(array)
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleMedSelect(item.label, item.id)}
            >
                <Text>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    const lastTakeForm = checkLast === 'number' ? (
        <View>
            <Text>Selectioner la quantité</Text>
            <Input
                placeholder="Selectioner la quantité de médicament"
                leftIcon={{}}
                onChangeText={(text) => setQuantity(parseInt(text))}
                value={quantity ? quantity.toString() : ""}
                keyboardType="numeric"
            ></Input>
        </View>
    ) : checkLast === 'last'?(
        <View>
            <Text>Date de la dernière prise</Text>
            <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={{ marginBottom: 20 }}
            >
            <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                editable={false}
                value={formatDate(endDate)}
                placeholder="Selectionner une date"
            />
            </TouchableOpacity>
                {showEndPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={endDate}
                    mode="date"
                    display="calendar"
                    onChange={(event, selectedDate) => {
                        console.log(selectedDate)
                        setShowEndPicker(false)
                        setEndDate(selectedDate)
                    }}
                />
                )}
        </View>
    ) : null;

    const periodicityForm = checkFrequency === 'regular' ? (
        <View className="flex justify-center gap-4 p-2">
            <Text className="text-center text-xl font-bold text-blue-400">
                {"Détail des prises"}
            </Text>
            <Text>Selectionner la fréquence</Text>
            <RNPickerSelect
                placeholder={{
                    label: "Selectioner la fréquence",
                }}
                onValueChange={(value) => setFrequency(value)}
                items={frequencyList}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="number"
                    status={checkLast === 'number' ? 'checked' : 'unchecked'}
                    onPress={() => setCheckLast('number')}
                />
                <Text>Nombre de prises</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="last"
                    status={checkLast === 'last' ? 'checked' : 'unchecked'}
                    onPress={() => setCheckLast('last')}
                />
                <Text>Date de la dernière prise</Text>
            </View>
            {lastTakeForm}
        </View>
    ) : checkFrequency==='custom'?(
        <View className="flex justify-center gap-4 p-2">
            <Text className="text-center text-xl font-bold text-blue-400">
                {selectedMed}
            </Text>
        </View>
    ):null;

    const quantityForm = checkQty === 'regular' ? (
        <View>
            <Text>Selectioner la quantité</Text>
            <Input
                placeholder="Selectioner la quantité de médicament"
                leftIcon={{}}
                onChangeText={(text) => setQuantity(parseInt(text))}
                value={quantity ? quantity.toString() : ""}
                keyboardType="numeric"
            ></Input>
        </View>
    ) : checkQty==='custom' && arrayOfDates.length != 0?(
        <View>
            <TouchableOpacity onPress={toggleSelectAll}>
                <Text style={[styles.selectAllButton, { color: selectAllColor }]}>{selectAllText}</Text>
            </TouchableOpacity>
            {arrayOfDates.map((date, index) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                        status={checkedDates.includes(date) ? 'checked' : 'unchecked'}
                        onPress={() => toggleDate(date)}
                    />
                    <Text style={{textAlignVertical: "center"}} key={index}>{date.toLocaleDateString('en-US', options)}</Text>
                    <TextInput
                        style={{borderWidth: 1, borderColor: 'gray', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16}}
                        placeholder="Enter Digit"
                        value={dateDigitAssociations[date.toISOString()] || ""} // Display the associated digit for the date
                        onChangeText={(text) => {
                        // Update the dateDigitAssociations state with the new value for the date
                        const updatedAssociations = { ...dateDigitAssociations };
                        updatedAssociations[date.toISOString()] = text;
                        setDateDigitAssociations(updatedAssociations);
                        }}
                    />
                </View>
            ))}
            <TextInput
            style={{borderWidth: 1, borderColor: 'gray', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16}}
                placeholder="Enter Digit"
                value={digitInput}
                onChangeText={(text) => setDigitInput(text)}
            />
            <Button title="Associate Digit" onPress={associateDigitWithDates} />
        </View>
    ):null;

    const customQuantities = checkFrequency != ''?(
        <View className="flex justify-center gap-4 p-2">
            <Text className="text-center text-xl font-bold text-blue-400">
                {"Quantities"}
            </Text>
            <Text>Selectionner la fréquence</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="regular"
                    status={checkQty === 'regular' ? 'checked' : 'unchecked'}
                    onPress={() => setCheckQty('regular')}
                />
                <Text>Régulière</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="custom"
                    status={checkQty === 'custom' ? 'checked' : 'unchecked'}
                    onPress={() => {
                        addDates()
                        setCheckQty('custom')
                    }}
                />
                <Text>Personnalisée</Text>
            </View>
            {quantityForm}
        </View>
    ) : null;

    const modalContent = selectedMed ? (
        <View className="flex justify-center gap-4 p-2">
            <Text className="text-center text-xl font-bold text-blue-400">
                {selectedMed}
            </Text>
            <Text>Selectionner la fréquence</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="regular"
                    status={checkFrequency === 'regular' ? 'checked' : 'unchecked'}
                    onPress={() => setCheckFrequency('regular')}
                />
                <Text>Régulière</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="custom"
                    status={checkFrequency === 'custom' ? 'checked' : 'unchecked'}
                    onPress={() => setCheckFrequency('custom')}
                />
                <Text>Personnalisée</Text>
            </View>
            {periodicityForm}
            {customQuantities}
            <View style={{marginTop: 50}}>
                <Button title="VALIDER" color={"green"} />
            </View>
        </View>
    ) : null;

    useEffect(() => {
        console.log("Nav on AddTreatment Page");
        try {
            init()
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <View style={styles.modalTitle}>
            <Text className=" text-3xl">Ajouter un Traitement</Text>
            <View className=" flex justify-center pt-8">
                <Text>Nom du traitement*</Text>
                <Input
                    placeholder="Entrez le nom du traitement"
                    leftIcon={{}}
                    onChangeText={(text) =>
                        setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1))
                    }
                    value={treatmentName}
                />

                <Text>Description du traitement</Text>
                <Input
                    placeholder="Entrez la description du traitement"
                    leftIcon={{}}
                    onChangeText={(text) =>
                        setTreatmentDescription(
                            text.charAt(0).toUpperCase() + text.slice(1)
                        )
                    }
                    value={treatmentDescription}
                />

                <Text>Date de début</Text>
                <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={{ marginBottom: 20 }}
                >
                <TextInput
                    style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                    editable={false}
                    value={formatDate(startDate)}
                    placeholder="Selectionner une date"
                />
                </TouchableOpacity>
                {showStartPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode="date"
                    display="calendar"
                    onChange={(event, selectedDate) => {
                        console.log(selectedDate)
                        setShowStartPicker(false)
                        setStartDate(selectedDate)
                    }}
                />
                )}

                <Text>Médicament à ajouter</Text>
                <TextInput
                    style={styles.dropdownInput}
                    onFocus={() => {
                        setIsVisible(true);
                        console.log("Focus");
                    }}
                    onChangeText={(text) => {
                        setSearchText(text);
                        setIsVisible(true);
                    }}
                    value={searchText}
                    placeholder="Selectioner vos médicaments..."
                />
                {isVisible && (
                    <FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={styles.dropdownList}
                    />
                )}
            </View>
            <ModalComponent
                visible={instructionModalVisible}
                onClose={() => {
                    setInstructionModalVisible(false);
                }}
                styleAdded={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 20,
                    maxHeight: "80%",
                }}
                children={modalContent}
            />
        </View>
    );
};
