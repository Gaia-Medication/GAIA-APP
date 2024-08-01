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
  const [page2, setPage2] = useState(false);

  // INITIALISE: RECUPERE LES INFORMATIONS POUR SAVOIR SI PREMIERE CONNEXION
  const init = async () => {
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <SafeAreaView className="w-full h-full bg-grey-100 justify-between">

      {!page2 &&
        <>
          <View className="items-center justify-center items-start flex-column py-4 px-6 flex-1">
            <Text className="text-left text-green-100 text-title text-bold font-bold ">
              Bonjour ! 👋
            </Text>
            <Text className="text-left text-green-100 text-subtitle text-bold font-bold mt-10">
              Avez-vous déjà utilisé Gaïa ?
            </Text>

          </View>

          <View className="items-center">
            <ButtonB title="Oui" onPress={() => setPage2(true)} />
            <ButtonA title="Non, montrez moi" onPress={() => setPage2} />
          </View>
        </>

      }

      {
        page2 &&
        <>
          <View className="items-center justify-center items-start flex-column py-4 px-6 flex-1">
            <Text className="text-left text-green-100 text-title text-bold font-bold ">
              Super !
            </Text>
            <Text className="text-left text-green-100 text-subtitle text-bold font-bold mt-10">
              Commençons par les présentations...
            </Text>
          </View>
          <View className="items-center">
            <ButtonB title="Allons-y !" onPress={() => navigation.navigate("CreateProfile")} />
          </View>
        </>
      }

    </SafeAreaView >
  );
}
