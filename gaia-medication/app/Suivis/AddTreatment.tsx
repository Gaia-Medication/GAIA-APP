import {
  NavigationProp,
  ParamListBase,
  useIsFocused,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  addItemToList,
  getAllTreatments,
  getUserByID,
  readList,
} from "../../dao/Storage";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../style/style";
import { getAllMed, getMedbyCIS } from "../../dao/Meds";
import ModalComponent from "../component/Modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton, Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as Icon from "react-native-feather";
import MedIconByType from "../component/MedIconByType";
import { searchMed } from "../../dao/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { Input } from "react-native-elements";
import { ArrowRightCircle } from "react-native-feather";
import GoBackButton from "../component/GoBackButton";

export default function AddTreatment({route, navigation}) {
  const isFocused = useIsFocused();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  let drugScanned; 
    if (route.params) {
        ({ drugScanned } = route.params); 
    }
  // INPUTS
  const [treatmentName, setTreatmentName] = useState("");
  const [treatmentDescription, setTreatmentDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [search, setSearch] = useState(searchMed("E"));
  const [searchText, setSearchText] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [endNumber, setEndNumber] = useState("1");
  const [quantity, setQuantity] = useState("");
  const [digitInput, setDigitInput] = useState("0");
  const [customPeriodicityBisNumber, setCustomPeriodicityBisNumber] =
    useState("1");
  const [customPeriodicityNumber, setCustomPeriodicityNumber] = useState("1");

  // CHECKBOXES, RADIO BUTTONS, PICKERS
  const [checkFrequency, setCheckFrequency] = useState("");
  const [frequencyMode, setFrequencyMode] = useState("regular");
  const [customPeriodicity, setCustomPeriodicity] = useState("day");
  const [weekDays, setWeekDays] = useState([
    { day: "Dimanche", checked: false },
    { day: "Lundi", checked: false },
    { day: "Mardi", checked: false },
    { day: "Mercredi", checked: false },
    { day: "Jeudi", checked: false },
    { day: "Vendredi", checked: false },
    { day: "Samedi", checked: false },
  ]);
  const [checkDaily, setCheckDaily] = useState("");
  const [checkLast, setCheckLast] = useState("");
  const [checkQty, setCheckQty] = useState("");
  const [checkedDates, setCheckedDates] = useState([]);

  // VISIBILITY
  const [isVisible, setIsVisible] = useState(false);
  const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);
  const [instructionModalVisible, setInstructionModalVisible] = useState(false);
  const [instructionsDetailModal, setInstructionsDetailModal] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNewTimePicker, setShowNewTimePicker] = useState(false);
  const [showHourPickerBis, setShowHourPickerBis] = useState(false);

  const [allMeds, setAllMeds] = useState([]);
  const [showHourPicker, setShowHourPicker] = useState([]);

  // DATA
  const [hoursAssociations, setHoursAssociations] = useState([]);
  const [selectedHourBis, setSelectedHourBis] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date());
  const [selectAllText, setSelectAllText] = useState("Select All");
  const [selectAllColor, setSelectAllColor] = useState("blue");
  const [selectedMed, setSelectedMed] = useState({});
  const [selectedMedCIS, setSelectedMedCIS] = useState("");
  const [selectedMedName, setSelectedMedName] = useState("");
  const [tempDate, setTempDate] = useState(new Date());
  const [instructionsList, setInstructionsList] = useState<Instruction[]>([]);
  const [selectedInstruction, setSelectedInstruction] =
    useState<Instruction>(null);
  const [arrayOfDates, setArrayOfDates] = useState([]);
  const [takes, setTakes] = useState<Take[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // DATA ARRAYS
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const periodicity = [
    { label: "JOUR", value: "day" },
    { label: "SEMAINE", value: "week" },
  ];
  const trad = {
    day: "jour",
    week: "semaine",
    month: "mois",
    year: "année",
  };

  // FUNCTIONS
  const onTimeChange = (event, selectedTime) => {
    setShowNewTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(tempDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setArrayOfDates([...arrayOfDates, newDateTime]);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempDate(new Date(selectedDate));
      setShowDatePicker(false);
      setShowNewTimePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  // SUPPRIMER UNE DATE DE PRISE DU TABLEAU ARRAYOFDATES
  const removeDate = (index) => {
    const newDates = [...arrayOfDates];
    newDates.splice(index, 1);
    setArrayOfDates(newDates);
  };

  // AJOUTER UNE DATE AU TABLEAU DES DATES SELECTIONNEES AFIN DE MODIFIER SA QUANTITE
  const toggleDate = (date) => {
    if (checkedDates.includes(date)) {
      // ENLEVER LA DATE SI ELLE EST DEJA DANS LE TABLEAU
      setCheckedDates(checkedDates.filter((d) => d !== date));
    } else {
      // SINON AJOUTER LA DATE AU TABLEAU
      setCheckedDates([...checkedDates, date]);
    }
  };

  // AJOUTE / MODIFIE DATE DE PRISE
  const handleHourChange = (selectedDate, index) => {
    const updatedHourAssociations = [...hoursAssociations];
    updatedHourAssociations[index] = selectedDate;
    setHoursAssociations(updatedHourAssociations);
  };

  // MODIFIE LE BOUTON DE SELECTION DE TOUTES LES DATES
  const toggleSelectAll = () => {
    if (selectAllText === "Select All") {
      setCheckedDates([...arrayOfDates]);
      setSelectAllText("Deselect All");
      setSelectAllColor("red"); // Change color to blue
    } else {
      setCheckedDates([]);
      setSelectAllText("Select All");
      setSelectAllColor("blue"); // Change color to blue
    }
  };

  // ASSOCIATE UN DIGIT (QUANTITE) A UNE DATE
  const addInstruction = async () => {
    let updatedTakes=[]
    if (checkQty === "custom") {
      // Convert checkedDates to a map for quick lookup
      const checkedDatesMap = new Map(
        checkedDates.map((date) => [date.toDateString(), true])
      );

      // Filter out the old takes that match any of the checkedDates
      const remainingTakes = takes.filter(
        (take) => !checkedDatesMap.has(new Date(take.date).toDateString())
      );

      // Create new takes for each checked date
      const newTakes = checkedDates.map((date) => ({
        userId: user.id,
        treatmentName: treatmentName,
        CIS: Number(selectedMedCIS),
        date: date.toISOString(),
        quantity: Number(quantity),
        taken: false,
        review: "",
      }));

      // Combine the remaining takes with the new takes and sort them by date
      updatedTakes = [...remainingTakes, ...newTakes].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      console.log("UPDATED TAKES => ", updatedTakes);

      // Update the takes state
      setTakes(updatedTakes);
    } else {
      updatedTakes = [];

      arrayOfDates.map((date) => {
        updatedTakes.push({
          userId: user.id,
          treatmentName: treatmentName,
          CIS: Number(selectedMedCIS),
          date: date.toISOString(),
          quantity: Number(quantity),
          taken: false,
          review: "",
        });
      });

      console.log("UPDATED TAKES => ", updatedTakes);
      setTakes(updatedTakes);
    }
    addDates();
    console.log("ADD INSTRUCTION");
    console.log("TAKES", updatedTakes);
    const newInstruction: Instruction = {
      CIS: selectedMedCIS,
      name: selectedMedName,
      regularFrequency: checkFrequency === "regular", // CE MÉDICAMENT EST-IL À PRENDRE RÉGULIÈREMENT ?

      // REGULIER
      regularFrequencyMode: frequencyMode ? frequencyMode : null, // COMMENT ? (X FOIS PAR JOUR/SEMAINE/MOIS OU TOUS LES X JOURS)
      regularFrequencyNumber: frequencyMode
        ? customPeriodicityNumber
          ? Number(customPeriodicityNumber)
          : Number(customPeriodicityBisNumber)
        : null, // X ?
      regularFrequencyPeriods:
        frequencyMode === "regular"
          ? customPeriodicity
            ? customPeriodicity
            : "day"
          : null, // SI X FOIS PAR (JOUR/SEMAINE/MOIS), PÉRIODICITÉ
      regularFrequencyContinuity: checkDaily ? checkDaily : null, // EST-CE QUOTIDIEN OU SEULEMENT CERTAINS JOURS ? (DAILY/CUSTOM)
      regularFrequencyDays:
        checkDaily === "custom"
          ? weekDays.filter((day) => day.checked).map((day) => day.day)
          : null, // SI CERTAINS JOURS, LESQUELS ?

      // PERSONNALISÉ

      endModality: checkLast, // COMMENT S'ARRÊTE LE TRAITEMENT ? (NOMBRE DE PRIS OU DATE DE FIN)
      endDate: checkLast === "last" ? endDate : null, // DATE DE FIN SI FIN À UNE DATE PRÉCISE
      endQuantity: checkLast === "number" ? Number(endNumber) : null, // NOMBRE DE PRIS SI FIN AU BOUT D'UN CERTAIN NOMBRE DE PRIS
      quantity: checkQty === "regular" ? Number(quantity) : null, // QUANTITÉ À PRENDRE À CHAQUE PRISE SI QUANTITÉ RÉGULIÈRE
      takes: updatedTakes, // TABLEAU DES PRISES
    };
    await addItemToList("instructions", newInstruction);
    console.log(newInstruction)
    setInstructionsList([...instructionsList, newInstruction]);
    setInstructionModalVisible(false);
  };

  // SETUP UN MEDICAMENT
  const handleMedSelect = async (CIS) => {
    if (treatmentName === "") {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Erreur",
        textBody: "Veuillez renseigner un nom de traitement",
        button: "Fermer",
      });
      return;
    }
    const treatments = await getAllTreatments();
    if (treatments.find((treatment) => treatment.name === treatmentName)) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Erreur",
        textBody: "Ce nom de traitement existe déjà",
        button: "Fermer",
      });
      return;
    }
    const med = getMedbyCIS(CIS);
    console.log(med);
    setSelectedMed(med);
    setSelectedMedCIS(CIS);
    setSelectedMedName(med.Name);
    setInstructionModalVisible(true);
  };

  // FORMATTE LA DATE
  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  // FORMATTE L'HEURE
  const formatHour = (hour) => {
    if (hour instanceof Date) {
      const hours = hour.getHours();
      const minutes = hour.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      return formattedTime;
    }
    return "";
  };

  // AFFICHE UN SATETIMEPICKER SPECIFIQUE
  const toggleShowHourPicker = (index) => {
    const updatedShowHourPickers = [...showHourPicker];
    updatedShowHourPickers[index] = !updatedShowHourPickers[index];
    setShowHourPicker(updatedShowHourPickers);
  };

  // GERE LES CHECKBOXES DS JOURS DE PRISES
  const toggleCheckbox = (index) => {
    const updatedWeekDays = [...weekDays];
    if (updatedWeekDays[index].checked) {
      updatedWeekDays[index].checked = !updatedWeekDays[index].checked;
      setWeekDays(updatedWeekDays);
    } else {
      if (customPeriodicity != "week") {
        updatedWeekDays[index].checked = !updatedWeekDays[index].checked;
        setWeekDays(updatedWeekDays);
      } else if (
        weekDays.filter((day) => day.checked).length <
        parseInt(customPeriodicityNumber)
      ) {
        updatedWeekDays[index].checked = !updatedWeekDays[index].checked;
        setWeekDays(updatedWeekDays);
      }
    }
  };

  // CALCUL LE NOMBRE DE PRISES SI CUSTOMPERIODICITY == WEEK && CHECKLAST == last
  function calculateTotalTakes() {
    const msInDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    let totalTakes = 0;
    let currentDate = new Date(startDate);

    // Create a map for quick lookup of the days of the week
    const daysMap = {
      Dimanche: 0,
      Lundi: 1,
      Mardi: 2,
      Mercredi: 3,
      Jeudi: 4,
      Vendredi: 5,
      Samedi: 6,
    };

    // Convert weekDays to their respective numbers
    const targetDays = weekDays
      .filter((day) => day.checked)
      .map((day) => daysMap[day.day]);

    while (currentDate <= endDate) {
      if (targetDays.includes(currentDate.getDay())) {
        totalTakes++; // Increment count if it's a target day
      }

      // Move to the next day
      currentDate = new Date(currentDate.getTime() + msInDay);
    }

    console.log("TOTAL TAKES => ", totalTakes);
    return totalTakes;
  }

  function calculateTakesEveryXDays() {
    const msInDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    let totalTakes = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      totalTakes++; // Increment count for each interval

      // Move to the next interval day
      currentDate = new Date(
        currentDate.getTime() + parseInt(customPeriodicityBisNumber) * msInDay
      );
    }

    return totalTakes;
  }

  // LIT TOUS LES INPUTS? CHECKBOXES ETC POUR RECUPERER UN TABLEAU DE DATES SANS QUANTITE
  const addDates = async () => {
    console.log("ADD DATES");
    let array = [];
    const daysMap = {
      Dimanche: 0,
      Lundi: 1,
      Mardi: 2,
      Mercredi: 3,
      Jeudi: 4,
      Vendredi: 5,
      Samedi: 6,
    };
    let startDateObj = new Date(startDate);
    const daysDifference =
      checkLast === "last"
        ? Math.floor(
            (Number(endDate) - Number(startDateObj)) / (24 * 60 * 60 * 1000)
          )
        : null;
    const numberOfTimes =
      checkLast === "last"
        ? frequencyMode === "regular"
          ? customPeriodicity === "day"
            ? parseInt(customPeriodicityNumber) * daysDifference +
              parseInt(customPeriodicityNumber)
            : calculateTotalTakes()
          : calculateTakesEveryXDays()
        : Number(endNumber);
    let currentDate = new Date(startDateObj);
    const intervalDays = parseInt(customPeriodicityBisNumber);
    console.log("DAYS DIFFERENCE ", daysDifference);
    numberOfTimes ? console.log("NUMBER OF TIMES ", numberOfTimes) : null;

    if (checkFrequency === "regular") {
      if (frequencyMode === "regular") {
        if (customPeriodicity === "week") {
          const targetDays = weekDays
            .filter((day) => day.checked)
            .map((day) => daysMap[day.day]);
          while (array.length < numberOfTimes) {
            if (targetDays.includes(currentDate.getDay())) {
              array.push(new Date(currentDate)); // Add the date if it's a target day
            }
            currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Move to the next day
          }
        } else if (customPeriodicity === "day") {
          if (checkDaily === "daily") {
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
          } else if (checkDaily === "custom") {
            // Custom daily logic to use numberOfTimes
            while (array.length < numberOfTimes) {
              if (weekDays[currentDate.getDay()].checked) {
                hoursAssociations.forEach((hour) => {
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
        }
      } else if (frequencyMode === "bis") {
        console.log("BIS");
        console.log(customPeriodicityNumber);
        console.log("INTERVAL DAYS ", intervalDays);
        console.log("DAYS DIFFERENCE ", daysDifference);
        console.log("NB OF TIMES ", numberOfTimes);
        console.log(endDate);
        console.log(array.length < numberOfTimes);
        console.log(hoursAssociations);
        while (array.length < numberOfTimes) {
          console.log("bbb");
          if (array.length < numberOfTimes) {
            const newDate = new Date(currentDate);
            newDate.setHours(
              selectedHourBis.getHours(),
              selectedHourBis.getMinutes(),
              0,
              0
            );
            array.push(newDate);
          }

          // Move to the next medication date by adding the interval days
          currentDate.setDate(currentDate.getDate() + intervalDays);
        }
      }
      setArrayOfDates(array);
    }

    console.log("Generated Dates => ", array);
    console.log("END DATE => ", endDate);
  };

  const lastTakeForm =
    checkLast === "number" ? (
      <View>
        <Text>Selectioner le nombre de prises</Text>
        <TextInput
          style={{
            borderWidth: 2,
            borderColor: "gray",
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 6,
            fontSize: 16,
            marginBottom: 10,
          }}
          onChangeText={(text) => setEndNumber(text)}
          value={endNumber ? endNumber : ""}
          keyboardType="numeric"
        ></TextInput>
      </View>
    ) : checkLast === "last" ? (
      <View>
        <Text>Date de la dernière prise</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={{ marginBottom: 20 }}
        >
          <TextInput
            style={{
              borderWidth: 2,
              borderColor: "gray",
              borderRadius: 5,
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 16,
              marginBottom: 10,
            }}
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
              console.log(selectedDate);
              setShowEndPicker(false);
              setEndDate(selectedDate);
            }}
          />
        )}
      </View>
    ) : null;

  const frequencyForm =
    frequencyMode === "regular" ? (
      customPeriodicity === "day" ? (
        <View>
          <Text>Renseignez l'heure de chaque prise</Text>
          {Array.from(
            { length: parseInt(customPeriodicityNumber) },
            (_, index) => (
              <View key={index}>
                {hoursAssociations[index] ? (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => toggleShowHourPicker(index)}
                      style={{
                        backgroundColor: "#9CDE00",
                        padding: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Icon.Clock color={"white"} />
                    </TouchableOpacity>

                    <Text style={{ color: "green", marginBottom: 10 }}>
                      Heure de prise : {formatHour(hoursAssociations[index])}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => toggleShowHourPicker(index)}
                      style={{
                        backgroundColor: "#FF0000",
                        padding: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Icon.Clock color={"white"} />
                    </TouchableOpacity>

                    <Text style={{ color: "red", marginBottom: 10 }}>
                      Renseigner l'heure
                    </Text>
                  </View>
                )}
                {showHourPicker[index] ? (
                  <DateTimePicker
                    testID="timePicker"
                    value={selectedHour}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      toggleShowHourPicker(index);
                      handleHourChange(selectedDate, index);
                    }}
                  />
                ) : null}
              </View>
            )
          )}

          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton
                value="daily"
                status={checkDaily === "daily" ? "checked" : "unchecked"}
                onPress={() => setCheckDaily("daily")}
              />
              <Text>Quotidienne</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton
                value="custom"
                status={checkDaily === "custom" ? "checked" : "unchecked"}
                onPress={() => setCheckDaily("custom")}
              />
              <Text>Personnalisé</Text>
            </View>
          </View>
          {checkDaily == "custom" ? (
            <View>
              <Text>Selectionner les jours de prises</Text>
              <View>
                {weekDays.map((day, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Checkbox
                      status={day.checked ? "checked" : "unchecked"}
                      onPress={() => {
                        toggleCheckbox(index);
                      }}
                    />
                    <Text>{day.day}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      ) : customPeriodicity == "week" ? (
        <View>
          <View>
            <Text>Selectionner les jours de prises</Text>
            <View>
              {weekDays.map((day, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Checkbox
                    status={day.checked ? "checked" : "unchecked"}
                    onPress={() => {
                      toggleCheckbox(index);
                    }}
                  />
                  <Text>{day.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : null
    ) : frequencyMode === "bis" ? (
      <View>
        <Button
          title="Heure de prise"
          onPress={() => {
            setShowHourPickerBis(true);
          }}
        />
        {selectedHourBis ? (
          <Text style={{ color: "green", marginBottom: 10 }}>
            Heure de prise : {formatHour(selectedHourBis)}
          </Text>
        ) : (
          <Text style={{ color: "red", marginBottom: 10 }}>
            Renseigner l'heure
          </Text>
        )}
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

  const periodicityForm =
    checkFrequency === "regular" ? (
      <View className="flex justify-center gap-4 p-2">
        <Text className="text-center text-xl font-bold text-blue-400">
          {"Détail des prises"}
        </Text>
        <Text>Selectionner la fréquence</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <RadioButton
            value="regular"
            status={frequencyMode === "regular" ? "checked" : "unchecked"}
            onPress={() => setFrequencyMode("regular")}
          />
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 16,
              marginRight: 6,
            }}
            keyboardType="numeric"
            maxLength={2}
            value={customPeriodicityNumber}
            onChange={(event) => {
              if (
                customPeriodicity === "week" &&
                parseInt(event.nativeEvent.text) > 7
              ) {
                setCustomPeriodicityNumber("7");
              } else {
                setCustomPeriodicityNumber(event.nativeEvent.text);
                setShowHourPicker(
                  Array.from(
                    { length: parseInt(event.nativeEvent.text) },
                    (_, index) => false
                  )
                );
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
                day.checked = false;
              });
              setWeekDays(updatedWeekDays);
              setCustomPeriodicity(itemValue);
            }}
          >
            {periodicity.map((item, index) => (
              <Picker.Item label={item.label} value={item.value} key={index} />
            ))}
          </Picker>
        </View>

        {frequencyMode === "regular" ? frequencyForm : null}

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <RadioButton
            value="bis"
            status={frequencyMode === "bis" ? "checked" : "unchecked"}
            onPress={() => setFrequencyMode("bis")}
          />
          <Text>Tout(.tes) les</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 16,
              marginLeft: 6,
              marginRight: 6,
            }}
            keyboardType="numeric"
            maxLength={1}
            value={customPeriodicityBisNumber}
            onChange={(event) => {
              setCustomPeriodicityBisNumber(event.nativeEvent.text);
            }}
          />
          <Text>jours.</Text>
        </View>
        {frequencyMode === "bis" ? frequencyForm : null}
        <Text className="text-center text-xl font-bold text-blue-400">
          Fin de la prise
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="number"
            status={checkLast === "number" ? "checked" : "unchecked"}
            onPress={() => setCheckLast("number")}
          />
          <Text>Nombre de prises</Text>
        </View>
        {checkLast === "number" ? lastTakeForm : null}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="last"
            status={checkLast === "last" ? "checked" : "unchecked"}
            onPress={() => setCheckLast("last")}
          />
          <Text>Date de la dernière prise</Text>
        </View>
        {checkLast === "last" ? lastTakeForm : null}
      </View>
    ) : checkFrequency === "custom" ? (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {arrayOfDates.map((date, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text style={{ marginRight: 10 }}>{formatDate(date)}</Text>
            <Text style={{ marginRight: 10 }}>{formatHour(date)}</Text>
            <TouchableOpacity
              onPress={() => removeDate(index)}
              style={{
                backgroundColor: "#FF000030",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Icon.Trash color={"red"} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          className=" flex items-center justify-center"
          onPress={() => setShowDatePicker(true)}
          style={{ backgroundColor: "#6721ec30", padding: 10, borderRadius: 5 }}
        >
          <Text className=" text-[#363636] text-lg">Ajouter une échéance</Text>
        </TouchableOpacity>
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

  const handleInputChange = (text) => {
    if (!isNaN(parseFloat(text)) && isFinite(text)) {
        setQuantity(text)
    } else {
      console.log("NOT A NUMBER");
      if (text != "") {
        setDigitInput("1");
      } else {
        setDigitInput("");
      }
    }
  };

  const quantityForm =
    checkQty === "regular" ? (
      <View>
        <Text>Selectionner la quantité</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 6,
            fontSize: 16,
          }}
          onChangeText={(text) => {
            setQuantity(text);
          }}
          value={quantity ? quantity.toString() : ""}
          keyboardType="numeric"
        ></TextInput>
      </View>
    ) : checkQty === "custom" && arrayOfDates.length != 0 ? (
      <View>
        <TouchableOpacity onPress={toggleSelectAll}>
          <Text style={[styles.selectAllButton, { color: selectAllColor }]}>
            {selectAllText}
          </Text>
        </TouchableOpacity>
        {arrayOfDates.map((date, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Checkbox
              status={checkedDates.includes(date) ? "checked" : "unchecked"}
              onPress={() => toggleDate(date)}
            />
            <Text style={{ textAlignVertical: "center" }}>
              {date.toLocaleDateString("en-US", options)}
            </Text>
            <Text style={{ textAlignVertical: "center" }}>
              {formatHour(date)}
            </Text>
            <TextInput
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 6,
                fontSize: 16,
              }}
              placeholder={
                takes.find((take) => take.date === date.toISOString())
                  ? takes
                      .find((take) => take.date === date.toISOString())
                      .quantity.toString()
                  : "0"
              }
              value={
                takes.find((take) => take.date === date.toISOString())
                  ? takes
                      .find((take) => take.date === date.toISOString())
                      .quantity.toString()
                  : "1"
              }
              onChangeText={(text) => {}}
              keyboardType="numeric"
            />
          </View>
        ))}
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 6,
            fontSize: 16,
          }}
          placeholder="Enter Digit"
          value={digitInput}
          onChangeText={(text) => {
            handleInputChange(text);
          }}
          keyboardType="numeric"
        />
      </View>
    ) : null;

  const customQuantities =
    checkFrequency != "" ? (
      <View className="flex justify-center gap-4 p-2">
        <Text className="text-center text-xl font-bold text-blue-400">
          {"Quantities"}
        </Text>
        <Text>Selectionner la régularité des quantitées</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="regular"
            status={checkQty === "regular" ? "checked" : "unchecked"}
            onPress={() => {
              addDates();
              setCheckQty("regular");
            }}
          />
          <Text>Régulière</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="custom"
            status={checkQty === "custom" ? "checked" : "unchecked"}
            onPress={() => {
              addDates();
              setCheckQty("custom");
            }}
          />
          <Text>Personnalisée</Text>
        </View>
        {quantityForm}
      </View>
    ) : null;



  const addTreatment = async () => {
    const asyncInstructions = await readList("instructions");
    console.log("ASYNC INSTRUCTIONS => ", asyncInstructions);
    AsyncStorage.setItem("instructions", JSON.stringify([]));
    const newTreatment = {
      name: treatmentName,
      treatmentName: treatmentName,
      userId: user.id,
      description: treatmentDescription,
      startDate: startDate,
      instructions: asyncInstructions,
    };
    await addItemToList("treatments", newTreatment);
    navigation.navigate("SuivisHandler",{screen:"Suivis"})
  };

  const handleValidate = () => {
    let canValidate = true;
    let missingFields = "";
    if (checkFrequency === "") {
      missingFields += "Fréquence de prise (régulière ou personnalisée) \n\n";
      canValidate = false;
    }
    if (checkFrequency === "regular") {
      if (frequencyMode === "") {
        missingFields +=
          "Le mode de fréquence \n (X fois par jour/semaine ou tous les X jours)\n\n";
        canValidate = false;
      }
      if (frequencyMode === "regular") {
        if (customPeriodicity === "") {
          missingFields += "La périodicité de prise \n (jour/semaine)\n\n";
          canValidate = false;
        }
        if (
          customPeriodicityNumber === "" ||
          parseInt(customPeriodicityNumber) === 0
        ) {
          missingFields +=
            "Une périodicité de prise valide \n (nombre de fois par jour/semaine)\n\n";
          canValidate = false;
        }
        if (checkDaily === "" && customPeriodicity === "day") {
          missingFields +=
            "La continuité de prise \n (quotidienne ou personnalisée)\n\n";
          canValidate = false;
        }
        if (customPeriodicity === "week") {
          if (
            weekDays.filter((day) => day.checked).length === 0 ||
            weekDays.filter((day) => day.checked).length <
              parseInt(customPeriodicityNumber)
          ) {
            missingFields += "Les jours de prise \n\n";
            canValidate = false;
          }
        }
        if (checkDaily === "custom" && customPeriodicity === "day") {
          if (weekDays.filter((day) => day.checked).length === 0) {
            missingFields += "Les jours de prise \n\n";
            canValidate = false;
          }
        }
      } else if (frequencyMode === "bis") {
        if (customPeriodicityBisNumber === "") {
          missingFields +=
            "Une périodicité de prise valide \n (nombre de jours par semaine)\n\n";
          canValidate = false;
        }
      }
      if (checkLast === "") {
        missingFields +=
          "La modalité de fin de prise \n (nombre de prises ou date de fin)\n\n";
        canValidate = false;
      }
      if (checkLast === "number") {
        if (parseInt(endNumber) === 0 || endNumber === "") {
          missingFields += "Le nombre total de prises \n\n";
          canValidate = false;
        }
      } else if (checkLast === "last") {
        if (endDate.getTime() < startDate.getTime()) {
          missingFields += "Une date de fin de prise valide \n\n";
          canValidate = false;
        }
      }
      if (checkQty === "") {
        missingFields +=
          "La régularité des quantitées \n (régulière ou personnalisée)\n\n";
        canValidate = false;
      }
      if (checkQty === "regular") {
        if (parseInt(quantity) === 0 || quantity === "") {
          missingFields += "Une quantité globale valide \n\n";
          canValidate = false;
        }
      }
    } else if (checkFrequency === "custom") {
      if (checkQty === "") {
        missingFields +=
          "La régularité des quantitées \n (régulière ou personnalisée)\n\n";
        canValidate = false;
      }
      if (checkQty === "regular") {
        if (parseInt(quantity) === 0 || quantity === "") {
          missingFields += "Une quantité globale valide \n\n";
          canValidate = false;
        }
      }
    }
    if (canValidate) {
      addInstruction();
      resetModalVariables();
    } else {
      //Alert.alert("Veuillez renseigner : \n" + missingFields);
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Oups !",
        textBody: "Veuillez renseigner : \n\n" + missingFields,
        button: "Fermer",
      });
    }
  };

  const modalContent = selectedMed ? (
    <ScrollView>
    <View className="flex justify-center gap-4 p-2">
      <Text className="text-center text-xl font-bold text-blue-400">
        {selectedMedName}
      </Text>
      <Text>Selectionner la fréquence</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RadioButton
          value="regular"
          status={checkFrequency === "regular" ? "checked" : "unchecked"}
          onPress={() => setCheckFrequency("regular")}
        />
        <Text>Régulière</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RadioButton
          value="custom"
          status={checkFrequency === "custom" ? "checked" : "unchecked"}
          onPress={() => setCheckFrequency("custom")}
        />
        <Text>Personnalisée</Text>
      </View>
      {periodicityForm}
      {customQuantities}
      <View
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-around",
          alignItems: "center",
          marginVertical: 60,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setIsVisible(false);
            handleValidate();
            // Reset the state first
          }}
          style={{ backgroundColor: "#9CDE00", padding: 10, borderRadius: 5 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>VALIDER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleClosePress()}
          style={{ backgroundColor: "#FF0000", padding: 10, borderRadius: 5 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>ANNULER</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  ) : null;

  const resetModalVariables = () => {
    console.log("RESET");
    setCheckFrequency("");
    setCheckLast("");
    setCheckQty("");
    setCheckDaily("");
    setFrequencyMode("regular");
    setCustomPeriodicity("day");
    setCustomPeriodicityNumber("");
    setCustomPeriodicityBisNumber("");
    setEndDate(new Date());
    setDigitInput("");
    setArrayOfDates([]);
    setTakes([]);
    setCheckedDates([]);
    setQuantity("0");
    setEndNumber("0");
    setSelectedHour(new Date());
    setSelectedHourBis(new Date());
    setShowHourPicker(
      Array.from(
        { length: parseInt(customPeriodicityNumber) },
        (_, index) => false
      )
    );
    setShowHourPickerBis(false);
    setSelectAllText("Select All");
    setSelectAllColor("blue");
  };

  // Function to handle close button press
  const handleClosePress = () => {
    console.log("CLOSE");
    resetModalVariables(); // Reset the state first
    setInstructionModalVisible(false);
  };

  const modalDescriptionContent = selectedInstruction ? (
    <View className="flex justify-center gap-4 p-2">
      <Text className="text-center text-xl font-bold text-blue-400">
        {selectedInstruction.name}
      </Text>
      <Text>
        Ce médicament est à prendre de façon{" "}
        {selectedInstruction.regularFrequency === true
          ? "régulière"
          : "irrégulière"}
      </Text>
      {selectedInstruction.regularFrequency === true ? (
        <View>
          <Text>
            Il est à prendre{" "}
            {selectedInstruction.regularFrequencyMode === "regular"
              ? selectedInstruction.regularFrequencyNumber +
                " fois par " +
                trad[selectedInstruction.regularFrequencyPeriods]
              : "tous les " +
                selectedInstruction.regularFrequencyNumber +
                " jours"}
          </Text>
          {selectedInstruction.regularFrequencyMode === "regular" &&
          selectedInstruction.regularFrequencyPeriods === "week" ? (
            <Text>
              Il est à prendre les{" "}
              {selectedInstruction.regularFrequencyDays.join(", ")}
            </Text>
          ) : selectedInstruction.regularFrequencyMode === "regular" &&
            selectedInstruction.regularFrequencyPeriods === "day" ? (
            selectedInstruction.regularFrequencyContinuity === "daily" ? (
              <Text>Il est à prendre tous les jours</Text>
            ) : null
          ) : null}
          {selectedInstruction.endModality === "number" ? (
            <Text>
              Il est à prendre {selectedInstruction.endQuantity} fois, jusqu'au{" "}
              {selectedInstruction.takes[selectedInstruction.takes.length]&&formatDate(
                selectedInstruction.takes[selectedInstruction.takes.length].date
              )}
            </Text>
          ) : selectedInstruction.regularFrequencyContinuity === "number" ? (
            <Text>Il est à prendre {selectedInstruction.endQuantity} fois</Text>
          ) : null}
          {selectedInstruction.regularFrequencyDays ? (
            <Text>
              Il est à prendre les{" "}
              {selectedInstruction.regularFrequencyDays.join(", ")}
            </Text>
          ) : null}
        </View>
      ) : (
        <View>
          <Text>Il est à prendre {selectedInstruction.endQuantity} fois</Text>
          <Text>
            Il est à prendre les{" "}
            {selectedInstruction.regularFrequencyDays.join(", ")}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => setInstructionsDetailModal(false)}
        style={{ backgroundColor: "#FF000080", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>FERMER</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  // QUAND ON APPUIE SUR LE BOUTON SUPPRIMER
  const handleDeleteInstruction = async (instruction) => {
    const updatedInstructions = instructionsList.filter(
      (item) => item.name !== instruction.name
    );
    setInstructionsList(updatedInstructions);
    await AsyncStorage.setItem(
      "instructions",
      JSON.stringify(updatedInstructions)
    );
  };

  const init = async () => {
    const allMeds = getAllMed();
    const currentId = await AsyncStorage.getItem("currentUser");
    const current = await getUserByID(JSON.parse(currentId));
    setUser(current);
    const medsWithKey = allMeds.map((med) => ({
      id: med.CIS,
      label: med.Name,
    }));
    setAllMeds(medsWithKey);
  };

  useEffect(() => {
    console.log("Nav on AddTreatment Page");
    try {
      init();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <SafeAreaView className="flex w-full bg-white flex-1 pt-[2px] pb-2 px-2">
      

      <AlertNotificationRoot>
        <View className="flex-row items-center justify-between py-4 px-6">
          <GoBackButton navigation={navigation}></GoBackButton>
          <Text className=" text-center text-2xl text-neutral-700 font-bold">
            Ajouter un Traitement
          </Text>
        </View>

        <View className=" flex w-full h-[86%] -mt-[5%] -mb-[8%] scale-95">
          <Input
            label="Nom du traitement*"
            labelStyle={styles.label}
            editable={instructionsList.length === 0}
            placeholder="Entrez le nom du traitement"
            placeholderTextColor={"#dedede"}
            onChangeText={(text) =>
              setTreatmentName(text.charAt(0).toUpperCase() + text.slice(1))
            }
            value={treatmentName}
          />

          <Input
            label="Description du traitement"
            labelStyle={styles.label}
            editable={instructionsList.length === 0}
            placeholder="Entrez la description du traitement"
            placeholderTextColor={"#dedede"}
            onChangeText={(text) =>
              setTreatmentDescription(
                text.charAt(0).toUpperCase() + text.slice(1)
              )
            }
            value={treatmentDescription}
          />

          <Text style={styles.label} className="mx-3">
            Date de début
          </Text>
          <TouchableOpacity
            disabled={instructionsList.length > 0}
            onPress={() => setShowStartPicker(true)}
            className="flex items-center"
          >
            <TextInput
              className="text-white text-center font-semibold bg-blue-400 rounded-lg w-[80%] m-4 p-2 "
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
                console.log(selectedDate);
                setShowStartPicker(false);
                setStartDate(selectedDate);
              }}
            />
          )}
          {!drugScanned ? (
            <Input
              className=" text-[#363636] text-lg"
              label="Médicaments"
              labelStyle={styles.label}
              onFocus={() => {
                setIsVisible(true);
                console.log("Focus");
              }}
              onChangeText={(text) => {
                setSearchText(text);
                setSearch(searchMed(text));
                setIsVisible(true);
              }}
              value={searchText}
              placeholder="Choisir vos médicaments..."
              placeholderTextColor={"#dedede"}
            />
          ):(
            <Text>Médicaments détectés</Text>
          )}
          {isVisible && (
            <FlatList
              className="border-0"
              data={search}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  className="flex justify-start align-middle"
                  onPress={() => handleMedSelect(item.CIS)}
                >
                  <MedIconByType type={item.type} />
                  <Text className="ml-4">{item.Name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
            />
          )}
          {drugScanned && (
            <FlatList
              className="border-0"
              data={drugScanned}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item }) => {
                const drug = getMedbyCIS(item.med.CIS)
                return(
                    <TouchableOpacity
                      style={styles.listItem}
                      className="flex justify-start align-middle"
                      onPress={() => handleMedSelect(drug.CIS)}
                    >
                      <MedIconByType type={drug.Shape} />
                      <Text className="ml-4">{drug.Name}</Text>
                    </TouchableOpacity>
                )
              }
              }
              style={styles.dropdownList}
            />
          )}

          {instructionsList.length > 0
            && instructionsList.map((instruction, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 30,
                    marginVertical: 10,
                  }}
                >
                  <TouchableOpacity
                    className=" flex items-center justify-center"
                    onPress={() => {
                      setSelectedInstruction(instruction);
                      setInstructionsDetailModal(true);
                    }}
                    style={{
                      backgroundColor: "#01A9F580",
                      padding: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      className=" text-[#363636] text-lg"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {instruction.name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className=" flex items-center justify-center"
                    onPress={() => handleDeleteInstruction(instruction)}
                    style={{
                      backgroundColor: "#FF0000",
                      padding: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Icon.Trash color={"white"} />
                  </TouchableOpacity>
                  <ModalComponent
                    visible={instructionsDetailModal}
                    onClose={() => {
                      setInstructionsDetailModal(false);
                    }}
                    children={modalDescriptionContent}
                  />
                </View>
              ))
            }
        </View>
        <View className="absolute w-full" style={{ top: windowHeight * 0.85 }}>
          <TouchableOpacity
            disabled={!(instructionsList.length > 0)}
            className="flex flex-row items-center justify-between bg-lime-400 rounded-2xl p-4 mb-2"
            
            onPress={() => addTreatment()}
          >
            <Text className="text-white text-lg ml-[10%]">
              Ajouter le traitement
            </Text>
            <ArrowRightCircle height={30} width={30} color={"#fff"} />
          </TouchableOpacity>
        </View>
        <ModalComponent
          visible={instructionModalVisible}
          onClose={() => {
            setInstructionModalVisible(false);
          }}
          children={modalContent}
        />
      </AlertNotificationRoot>
    </SafeAreaView>
  );
}
