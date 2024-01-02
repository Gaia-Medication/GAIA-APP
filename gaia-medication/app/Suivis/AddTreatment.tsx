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
import { Picker } from '@react-native-picker/picker';

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
    const [quantity, setQuantity] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showNewTimePicker, setShowNewTimePicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };
    const [checkedDates, setCheckedDates] = useState([]);
    const periodicity = [
        { label: "JOUR", value: "day" },
        { label: "SEMAINE", value: "week" },
    ]
    // const periodicityBis = [
    //     { label: "MINUTE(S)", value: "min" },
    //     { label: "HEURE(S)", value: "hour" },
    //     { label: "JOUR(S)", value: "day" },
    // ]
    const [weekDays, setWeekDays] = useState([
        { day: 'Dimanche', checked: false },
        { day: 'Lundi', checked: false },
        { day: 'Mardi', checked: false },
        { day: 'Mercredi', checked: false },
        { day: 'Jeudi', checked: false },
        { day: 'Vendredi', checked: false },
        { day: 'Samedi', checked: false },
    ]);
    const [customPeriodicity, setCustomPeriodicity] = useState("week");
    const [customPeriodicityBisNumber, setCustomPeriodicityBisNumber] = useState("0");
    const [frequencyMode, setFrequencyMode] = useState("regular");
    const [customPeriodicityNumber, setCustomPeriodicityNumber] = useState("0");
    const [selectedHour, setSelectedHour] = useState(new Date());
    const [showHourPicker, setShowHourPicker] = useState([]);
    const [selectedHourBis, setSelectedHourBis] = useState(new Date());
    const [showHourPickerBis, setShowHourPickerBis] = useState(false);
    const [hoursAssociations, setHoursAssociations] = useState([]);
    const [checkDaily, setCheckDaily] = useState('');

    const onTimeChange = (event, selectedTime) => {
        setShowNewTimePicker(false); // Hide the time picker
        if (selectedTime) {
            const newDateTime = new Date(tempDate);
            newDateTime.setHours(selectedTime.getHours());
            newDateTime.setMinutes(selectedTime.getMinutes());
            setArrayOfDates([...arrayOfDates, newDateTime]); // Add the new date and time to the list
        }
    };

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(new Date(selectedDate)); // Set the selected date into tempDate
            setShowDatePicker(false); // Hide the date picker
            setShowNewTimePicker(true); // Show the time picker
        } else {
            setShowDatePicker(false); // User cancelled, hide the picker
        }
    };

    // Function to remove a date
    const removeDate = (index) => {
        const newDates = [...arrayOfDates];
        newDates.splice(index, 1);
        setArrayOfDates(newDates);
    };

    // Function to add a new date and hour (modify as needed)
    const addNewDate = () => {
        const newDate = new Date(); // Replace with the actual new date and hour you want to add
        setArrayOfDates([...arrayOfDates, newDate]);
    };

    const toggleDate = (date) => {
        if (checkedDates.includes(date)) {
            // If date is already in the checkedDates array, remove it
            setCheckedDates(checkedDates.filter((d) => d !== date));
        } else {
            // If date is not in the checkedDates array, add it
            setCheckedDates([...checkedDates, date]);
        }
    }

    const showHourPickerMethod = (index) => {
        // Create a copy of showHourPicker to modify
        const updatedShowHourPicker = [...showHourPicker];
        // Toggle the visibility for the specified index
        updatedShowHourPicker[index] = !updatedShowHourPicker[index];
        // Update the state
        setShowHourPicker(updatedShowHourPicker);
    };

    const showTimePicker = (index) => {
        const updatedShowHourPicker = [...showHourPicker];
        updatedShowHourPicker[index] = !showHourPicker[index];
        setShowHourPicker(updatedShowHourPicker);
    };

    const handleHourChange = (selectedDate, index) => {
        const updatedHourAssociations = [...hoursAssociations];
        updatedHourAssociations[index] = selectedDate;
        setHoursAssociations(updatedHourAssociations);
        console.log(updatedHourAssociations);
    };

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

    // Formatte la date pour l'affichage
    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    const addDates = () => {
        let array = [];
        let startDateObj = new Date(startDate);
        const daysDifference = checkLast === 'last' ? Math.floor((Number(endDate) - Number(startDateObj)) / (24 * 60 * 60 * 1000)) : null
        const numberOfTimes = checkLast === 'last' ? (frequencyMode === "regular" ? (parseInt(customPeriodicityNumber) * daysDifference) : (parseInt(customPeriodicityBisNumber) * daysDifference)) : quantity;
        const currentDate = new Date(startDateObj);
        const intervalDays = parseInt(customPeriodicityBisNumber);
    
        if (checkFrequency === 'regular') {
            if (frequencyMode === 'regular') {
                if (checkDaily === 'daily') {
                    while (array.length < numberOfTimes) {
                        for (let hour of hoursAssociations) {
                            if (array.length >= numberOfTimes) {
                                break;
                            }
                            const newDate = new Date(currentDate);
                            newDate.setHours(hour.getHours(), hour.getMinutes(), 0, 0); // Set the specific hour and minute
                            array.push(newDate);
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                } else if (checkDaily === 'custom') {
                    // Custom daily logic to use numberOfTimes
                    while (array.length < numberOfTimes && (!endDate || currentDate <= endDate)) {
                        if (weekDays[currentDate.getDay()].checked) {
                            hoursAssociations.forEach(hour => {
                                if (array.length < numberOfTimes) {
                                    const newDate = new Date(currentDate);
                                    newDate.setHours(hour.getHours(), hour.getMinutes(), 0, 0);
                                    array.push(newDate);
                                }
                            });
                        }
                        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
                    }
                }
            } else if (frequencyMode === 'bis') {
                console.log("BIS")
                console.log(customPeriodicityNumber)
                console.log("INTERVAL DAYS ", intervalDays)
                console.log("DAYS DIFFERENCE ", daysDifference)
                console.log("NB OF TIMES ", numberOfTimes)
                console.log(endDate)
                console.log(array.length < numberOfTimes)
                console.log(hoursAssociations)
                while (array.length < numberOfTimes) {
                    console.log("bbb")
                        if (array.length < numberOfTimes) {
                            const newDate = new Date(currentDate);
                            newDate.setHours(selectedHourBis.getHours(), selectedHourBis.getMinutes(), 0, 0);
                            array.push(newDate);
                        };
    
                    // Move to the next medication date by adding the interval days
                    currentDate.setDate(currentDate.getDate() + intervalDays);
                }
            }
            setArrayOfDates(array);
        }
        
        console.log("Generated Dates => ", array);
        console.log("END DATE => ", endDate)
    };
    
    

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleMedSelect(item.label, item.id)}
                key={item.id}
            >
                <Text>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    const lastTakeForm = checkLast === 'number' ? (
        <View>
            <Text>Selectioner le nombre de prises</Text>
            <Input
                placeholder="Selectioner la quantité de médicament"
                leftIcon={{}}
                onChangeText={(text) => setQuantity(parseInt(text))}
                value={quantity ? quantity.toString() : ""}
                keyboardType="numeric"
            ></Input>
        </View>
    ) : checkLast === 'last' ? (
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

    // Function to toggle the visibility of a specific DateTimePicker
    const toggleShowHourPicker = (index) => {
        const updatedShowHourPickers = [...showHourPicker];
        updatedShowHourPickers[index] = !updatedShowHourPickers[index];
        setShowHourPicker(updatedShowHourPickers);
    };
    const formatHour = (hour) => {
        if (hour instanceof Date) {
            const hours = hour.getHours();
            const minutes = hour.getMinutes();
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            return formattedTime;
        }
        return "";
    };

    const toggleCheckbox = (index) => {
        const updatedWeekDays = [...weekDays];
        if (updatedWeekDays[index].checked ){
            updatedWeekDays[index].checked = !updatedWeekDays[index].checked;
            setWeekDays(updatedWeekDays);
        } else {
            if (customPeriodicity != "week"){
                updatedWeekDays[index].checked = !updatedWeekDays[index].checked;
                setWeekDays(updatedWeekDays);
            } else if (weekDays.filter(day => day.checked).length < parseInt(customPeriodicityNumber)){
                updatedWeekDays[index].checked = !updatedWeekDays[index].checked;
                setWeekDays(updatedWeekDays);
            }
        }
        
        
        
    };
    const frequencyForm = frequencyMode === 'regular' ? (
        customPeriodicity === 'day' ? (
            <View>
                <Text>Renseignez l'heure de chaque prise</Text>
                <TextInput
                    placeholder="Enter a number"
                    keyboardType='default'
                    value={customPeriodicityNumber}
                    onChangeText={(text) => {
                        setCustomPeriodicityNumber(text)
                    }}
                />
                {Array.from({ length: parseInt(customPeriodicityNumber) }, (_, index) => (
                    <View key={index}>
                        <Button title={`${index + 1}`} onPress={() => {
                            toggleShowHourPicker(index)
                        }} />
                        {hoursAssociations[index] ? (
                            <Text style={{ color: "green", marginBottom: 10 }}>Heure de prise : {formatHour(hoursAssociations[index])}</Text>
                        ) : <Text style={{ color: "red", marginBottom: 10 }}>Renseigner l'heure</Text>}
                        {showHourPicker[index] ? (
                            <DateTimePicker
                                testID="timePicker"
                                value={selectedHour}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => {
                                    toggleShowHourPicker(index); // Close the time picker
                                    handleHourChange(selectedDate, index); // Handle hour selection
                                }}
                            />
                        ) : null}
                    </View>

                ))}

                <View style={{ flexDirection: 'column', alignItems: "flex-start" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton
                            value="daily"
                            status={checkDaily === 'daily' ? 'checked' : 'unchecked'}
                            onPress={() => setCheckDaily('daily')}
                        />
                        <Text>Quotidienne</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton
                            value="custom"
                            status={checkDaily === 'custom' ? 'checked' : 'unchecked'}
                            onPress={() => setCheckDaily('custom')}
                        />
                        <Text>Personnalisé</Text>
                    </View>
                </View>
                {checkDaily == "custom" ? (
                    <View>
                        <Text>Selectionner les jours de prises</Text>
                        <View>
                            {weekDays.map((day, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Checkbox
                                        status={day.checked ? 'checked' : 'unchecked'}
                                        onPress={() => { toggleCheckbox(index) }}
                                    />
                                    <Text>{day.day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : null}
            </View>
        ) : customPeriodicity=="week" ? (
            <View>
                <View>
                        <Text>Selectionner les jours de prises</Text>
                        <View>
                            {weekDays.map((day, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Checkbox
                                        status={day.checked ? 'checked' : 'unchecked'}
                                        onPress={() => { 
                                            toggleCheckbox(index) 
                                        }}
                                    />
                                    <Text>{day.day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
            </View>
        ) : null
    ) : frequencyMode === 'bis' ? (
        <View>
            <Button title="Heure de prise" onPress={() => {
                setShowHourPickerBis(true)
            }} />
            {selectedHourBis  ? (
                <Text style={{ color: "green", marginBottom: 10 }}>Heure de prise : {formatHour(selectedHourBis)}</Text>
            ) : <Text style={{ color: "red", marginBottom: 10 }}>Renseigner l'heure</Text>}
            {showHourPickerBis ? (
                <DateTimePicker
                    testID="timePicker"
                    value={selectedHourBis}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowHourPickerBis(false); // Close the time picker
                        setSelectedHourBis(selectedDate); // Handle hour selection
                    }}
                />
            ) : null}
        </View>
    ) : null;

    const periodicityForm = checkFrequency === 'regular' ? (
        <View className="flex justify-center gap-4 p-2">
            <Text className="text-center text-xl font-bold text-blue-400">
                {"Détail des prises"}
            </Text>
            <Text>Selectionner la fréquence</Text>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <RadioButton
                    value="regular"
                    status={frequencyMode === 'regular' ? 'checked' : 'unchecked'}
                    onPress={() => setFrequencyMode('regular')}
                />
                <TextInput style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    fontSize: 16,
                    marginRight: 6
                }}
                    keyboardType="numeric"
                    maxLength={2}
                    value={customPeriodicityNumber}
                    onChange={(event) => {
                        if (customPeriodicity === "week" && parseInt(event.nativeEvent.text) > 7) {
                            setCustomPeriodicityNumber("7")
                        } else {
                            setCustomPeriodicityNumber(event.nativeEvent.text)
                            setShowHourPicker(Array.from({ length: parseInt(event.nativeEvent.text) }, (_, index) => false))
                        }
                    }}
                />
                <Text>fois par</Text>
                <Picker
                    selectedValue={customPeriodicity}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => {
                        const updatedWeekDays = [...weekDays];
                        updatedWeekDays.map((day, index) => {
                            day.checked = false
                        })
                        setWeekDays(updatedWeekDays);
                        setCustomPeriodicity(itemValue)
                    }}
                >
                    {periodicity.map((item, index) => (
                        <Picker.Item label={item.label} value={item.value} key={index} />
                    ))}
                </Picker>
            </View>

            {frequencyMode === 'regular' ? frequencyForm : null}

            <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <RadioButton
                    value="bis"
                    status={frequencyMode === 'bis' ? 'checked' : 'unchecked'}
                    onPress={() => setFrequencyMode('bis')}
                />
                <Text>Tout(.tes) les</Text>
                <TextInput style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    fontSize: 16,
                    marginLeft: 6,
                    marginRight: 6
                }}
                    keyboardType="numeric"
                    maxLength={1}
                    value={customPeriodicityBisNumber}
                    onChange={(event) => {
                        setCustomPeriodicityBisNumber(event.nativeEvent.text)
                    }}
                />
                <Text>jours.</Text>
                {/* <Picker
                    selectedValue={customPeriodicityBis}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => setCustomPeriodicityBis(itemValue)}
                >
                    {periodicityBis.map((item, index) => (
                        <Picker.Item label={item.label} value={item.value} key={index} />
                    ))}
                </Picker> */}
            </View>
            {frequencyMode === 'bis' ? frequencyForm : null}
            <Text className="text-center text-xl font-bold text-blue-400">Fin de la prise</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="number"
                    status={checkLast === 'number' ? 'checked' : 'unchecked'}
                    onPress={() => setCheckLast('number')}
                />
                <Text>Nombre de prises</Text>
            </View>
            {checkLast === 'number' ? (
                lastTakeForm
            ):null}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    value="last"
                    status={checkLast === 'last' ? 'checked' : 'unchecked'}
                    onPress={() => setCheckLast('last')}
                />
                <Text>Date de la dernière prise</Text>
            </View>
            {checkLast === 'last' ? (
                lastTakeForm
            ):null}
        </View>
    ) : checkFrequency === 'custom' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <FlatList
                data={arrayOfDates}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ marginRight: 10 }}>{item.toLocaleString()}</Text>
                        <TouchableOpacity onPress={() => removeDate(index)} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <Button title="Add New Date + Hour" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={tempDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            {showNewTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={tempDate}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onTimeChange}
                />
            )}
        </View>

    ) : null;

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
    ) : checkQty === 'custom' && arrayOfDates.length != 0 ? (
        <View>
            <TouchableOpacity onPress={toggleSelectAll}>
                <Text style={[styles.selectAllButton, { color: selectAllColor }]}>{selectAllText}</Text>
            </TouchableOpacity>
            {arrayOfDates.map((date, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                        status={checkedDates.includes(date) ? 'checked' : 'unchecked'}
                        onPress={() => toggleDate(date)}
                    />
                    <Text style={{ textAlignVertical: "center" }}>{date.toLocaleDateString('en-US', options)}</Text>
                    <Text style={{ textAlignVertical: "center" }}>{formatHour(date)}</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16 }}
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
                style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 6, fontSize: 16 }}
                placeholder="Enter Digit"
                value={digitInput}
                onChangeText={(text) => setDigitInput(text)}
            />
            <Button title="Associate Digit" onPress={associateDigitWithDates} />
        </View>
    ) : null;

    const customQuantities = checkFrequency != '' ? (
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

    const addInstruction = async () => {
        const newInstruction = {
            CIS: selectedMedCIS,
            regularFrequency: checkFrequency === 'regular', // CE MÉDICAMENT EST-IL À PRENDRE RÉGULIÈREMENT ?

            // REGULIER
            regularFrequencyMode: frequencyMode? frequencyMode : null, // COMMENT ? (X FOIS PAR JOUR/SEMAINE/MOIS OU TOUS LES X JOURS)
            regularFrequencyNumber: frequencyMode? (customPeriodicityNumber? customPeriodicityNumber : customPeriodicityBisNumber) : null, // X ?
            regularFrequencyPeriods: frequencyMode === "regular"? (customPeriodicity? customPeriodicity : "day") : null, // SI X FOIS PAR (JOUR/SEMAINE/MOIS), PÉRIODICITÉ
            regularFrequencyContinuity: checkDaily? checkLast : null, // EST-CE QUOTIDIEN OU SEULEMENT CERTAINS JOURS ? (DAILY/CUSTOM) 
            regularFrequencyDays: checkDaily === "custom"? weekDays.filter(day => day.checked).map(day => day.day) : null, // SI CERTAINS JOURS, LESQUELS ?

            // PERSONNALISÉ


            endModality: checkLast, // COMMENT S'ARRÊTE LE TRAITEMENT ? (NOMBRE DE PRIS OU DATE DE FIN)
            endDate: checkLast === 'last' ? endDate : null, // DATE DE FIN SI FIN À UNE DATE PRÉCISE
            endQuantity: checkLast === 'number' ? quantity : null, // NOMBRE DE PRIS SI FIN AU BOUT D'UN CERTAIN NOMBRE DE PRIS
            quantity: checkQty === 'regular' ? quantity : null, // QUANTITÉ À PRENDRE À CHAQUE PRISE SI QUANTITÉ RÉGULIÈRE
            datesAndQuantities: dateDigitAssociations,
        };
        const instructionsJson = await AsyncStorage.getItem('instructions');
        let instructions = instructionsJson ? JSON.parse(instructionsJson) : [];

        instructions.push(newInstruction);

    };
    const addTreatment = async () => {
        let instructions = AsyncStorage.getItem("instructions");
        const treatment = {
            name: treatmentName,
            description: treatmentDescription,
            startDate: startDate,
            instructions: instructions,
        };
        navigation.navigate("Suivis");
    }

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
            <View style={{ marginTop: 50 }}>
                <Button title="VALIDER" color={"green"} onPress={addInstruction}/>
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
                        keyExtractor={(item) => item.id.toString()}
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
