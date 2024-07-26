import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserIdAutoIncrement, addItemToList } from "../../dao/Storage";
import { SearchAllergy } from "../../dao/Search";
import { styles } from "../../style/style";
import CustomButton from "../component/CustomButton";
import AllergySelector from "../component/AllergySelector";
import TutorialBubble from "../component/TutorialBubble";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ArrowLeft } from "react-native-feather";
import GoBackButton from "../component/GoBackButton";
import ButtonA from "../component/ButtonA";
import ButtonB from "../component/ButtonB";

interface ICreateProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function Welcome({ navigation }: ICreateProps) {
  // FORM DU USER
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [weight, setWeight] = useState<number>();
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // TUTORIEL
  const [firstConnection, setFirstConnection] = useState("");
  const [tutoStep, setTutoStep] = useState(0);
  const [TutoCreate, setTutoCreate] = useState("1");

  // VALIDATION DU FORMULAIRE
  const [isValidFirstname, setIsValidFirstname] = useState(true);
  const [isValidLastname, setIsValidLastname] = useState(true);
  const [isValidWeight, setIsValidWeight] = useState(true);
  const [validFirstPart, setValidFirstPart] = useState(false);
  // SELECTION DES ALLERGIES
  const [isAllergySelectorValid, setIsAllergySelectorValid] = useState(false);

  const isFirstFormEmpty = !firstname || !lastname || !gender;

  const isFormEmpty =
    !firstname ||
    !lastname ||
    !gender ||
    !dateOfBirth ||
    !weight ||
    !isValidWeight;

  const validateFirstname = () => {
    setIsValidFirstname(firstname.length >= 2);
  };

  const validateLastname = () => {
    setIsValidLastname(lastname.length >= 2);
  };

  const validateWeight = () => {
    if (weight > 0 || weight <= 999) {
      setIsValidWeight(true);
    } else {
      setIsValidWeight(false);
    }
  };

  const handleAllergySelectorValidation = (isValid) => {
    setIsAllergySelectorValid(isValid);
  };

  // FORMATE UNE DATE
  function formatDateToDDMMYYYY(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

    return formattedDate;
  }

  // INITIALISE: RECUPERE LES INFORMATIONS POUR SAVOIR SI PREMIERE CONNEXION
  const init = async () => {
    setFirstConnection(await AsyncStorage.getItem("isFirstConnection"));
    setTutoCreate(await AsyncStorage.getItem("TutoCreate"));
  };

  useEffect(() => {
    init();
  }, []);

  // GERE LES ETAPES DU TUTORIEL
  const handleTuto = (isClicked, step) => {
    if (isClicked) {
      if (step === 2) {
        setTutoStep(2);
      } else if (tutoStep < 1) {
        setTutoStep(tutoStep + 1);
      }
    }
  };

  // GERE LA PREMIERE PARTIE DU FORMULAIRE
  const handleFirstSumbit = () => {
    if (validFirstPart) {
      setValidFirstPart(false);
    } else {
      if (!isValidFirstname || !isValidLastname || isFirstFormEmpty) {
        console.log(`error not valid`);
      } else {
        setValidFirstPart(true);
        handleTuto(true, 2);
      }
    }
  };

  // GERE LA VALIDATION DU FORMULAIRE ET MISE EN STOCKAGE DU PROIFL
  const handleSumbit = async () => {
    if (!isValidFirstname || !isValidLastname || isFormEmpty) {
      console.log(`error not valid`);
    } else {
      try {
        if (firstConnection === "true") {
          await AsyncStorage.setItem("isFirstConnection", "false");
          await AsyncStorage.setItem("TutoCreate", "1");
        }
        const user: User = {
          id: await UserIdAutoIncrement(),
          firstname,
          lastname,
          dateOfBirth,
          weight,
          gender,
          preference,
        };

        await addItemToList("users", user);
        await AsyncStorage.setItem("currentUser", JSON.stringify(user.id));
        navigation.navigate("Home");
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-grey-100 justify-between">
    
      <View className="items-center justify-center items-start flex-column py-4 px-6 flex-1">
        <Text className="text-left text-green-100 text-title text-bold font-bold ">
          Bonjour ! 👋
        </Text>
        <Text className="text-left text-green-100 text-subtitle text-bold font-bold mt-20">
          Avez-vous déjà utilisé Gaïa ?
        </Text>
        
      </View>

      <View className="items-center">
        <ButtonB title="Oui" onPress={() => navigation.navigate("Login")} />
        <ButtonA title="Non, montrez moi" onPress={() => navigation.navigate("Welcome")} />
      </View>

    </SafeAreaView>
  );
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
