import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-elements";
import { ChevronDown } from "react-native-feather";
import { styles } from "../../style/style";
import { getTreatmentByName } from "../../dao/Storage";
import * as Icon from "react-native-feather";
import { SafeAreaView } from "react-native-safe-area-context";
import ModalComponent from "./Modal";
import { validatePathConfig } from "@react-navigation/native";

const Treatment = ({ onPress, status = "actual" as "actual" | "next" | "previous", take, treatmentName, treatmentDescription, med, onTakePress, validateModalFun }) => {
  const [expanded, setExpanded] = useState(false);

  const validStates = ['previous', 'actual', 'next'];
  const isStateValid = validStates.includes(status);
  const [bgColor, setBgColor] = useState("#9CDE00");
  const [date, setDate] = useState<Date>(new Date());
  const [takeDetailsModalVisible, setTakeDetailsModalVisible] = useState(false);
  const [newTxt, setNewTxt] = useState("");


  const init = () => {
    if (status === "actual" || status === "next") {
      setBgColor("#9CDE0010");
    } else {
      setBgColor("#BCBCBC10");
    }
    setNewTxt(take.review);
    setDate(new Date(take.date));
  };

  const formatHour = (hour) => {
    if (hour instanceof Date) {
      const hours = hour.getHours();
      const minutes = hour.getMinutes();
      const formattedTime = `${hours.toString()}:${minutes.toString().padStart(2, '0')}`;
      return formattedTime;
    }
    return "";
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      console.error("Invalid date");
      return null;
    }

    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    let dayOfWeek = days[date.getDay()];
    let dayOfMonth = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    return { day: dayOfWeek, dayOfMonth: dayOfMonth, month: month, year: year };
  };

  const handleReviewChange = () => {
    take.review=newTxt;
    validateModalFun(take)
    setTakeDetailsModalVisible(false);
  }

  const takeModalContent = (
    <View style={{ backgroundColor: "white", width: "80%", display: "flex", justifyContent: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#333333", fontSize: 20 }}>{med}</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 40 }}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: 10 }}>
          <Icon.BookOpen color="#333333" width={30} height={30} />
          <Text style={{ fontSize: 17 }}>{treatmentDescription}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 }}>
          <Icon.Calendar color="#333333" width={30} height={30} />
          <Text style={{ fontSize: 17 }}>{formatDate(new Date(take.date)).day} {formatDate(new Date(take.date)).dayOfMonth} {formatDate(new Date(take.date)).month} {formatDate(new Date(take.date)).year}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 }}>
          <Icon.Clock color="#333333" width={30} height={30} />
          <Text style={{ fontSize: 17 }}>{formatHour(new Date(take.date))}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 10 }}>
          <TextInput
          multiline
          numberOfLines={10} 
          value={newTxt}
          onChangeText={(text) => setNewTxt(text)}
          style={{ fontSize: 17, width: "100%", borderBottomColor: "#333333", borderWidth: 2, borderRadius: 10, padding: 5, textAlignVertical: "top" }}
          placeholder={take.review === "" ? "Ajouter un review..." : take.review}
          />
        </View>

      </View>

      <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: 40, backgroundColor: "#FF000080" }} onPress={() => setTakeDetailsModalVisible(false)}>
        <Icon.X color="#333333" width={30} height={30} />
        <Text style={{ fontSize: 17 }}>Fermer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: 40, backgroundColor: "#9CDE00" }} onPress={(text) => handleReviewChange()}>
        <Icon.X color="#FFFFFF" width={30} height={30} />
        <Text style={{ fontSize: 17 }}>Valider</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    init();
  }, []);

  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 10, maxHeight: "auto", marginBottom: 7, marginTop: 7, }}>
      <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", width: "20%", gap: 50 }}>
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Text style={{ fontWeight: "800", fontSize: 20, color: status === "previous" ? "#BCBCBC" : status === "actual" ? "#9CDE00" : "#00000099" }}>{formatDate(date).day}</Text>
          <Text style={{ fontWeight: "800", fontSize: 20, color: status === "previous" ? "#BCBCBC" : status === "actual" ? "#9CDE00" : "#00000099" }}>{formatDate(date).dayOfMonth}</Text>
          <Text style={{ fontWeight: "800", fontSize: 20, color: status === "previous" ? "#BCBCBC" : status === "actual" ? "#9CDE00" : "#00000099" }}>{formatDate(date).month}</Text>
        </View>
        {status !== "next" ? (
          <TouchableOpacity onPress={() => onTakePress(take)}>
            <View style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20%", backgroundColor: take.taken ? (status === "previous" ? "#CCCCCC" : "#9CDE0030") : (status === "actual" ? "#FF000030" : "#CCCCCC"), padding: 10, borderRadius: 50 }}>
              {take.taken ? <Icon.CheckCircle color={status === "actual" ? "#9CDE00" : "grey"} width={30} height={30} /> : <Icon.AlertCircle color={status === "actual" ? "#FF0000" : "#666666"} width={30} height={30} />}

            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={{ display: "flex", flexDirection: "column", gap: 15, alignItems: "center"}} className=" flex-1">
        <View style={{
          width: 15,
          height: 15,
          borderRadius: 100,
          backgroundColor: status === "next"?"#FFFFFF":(bgColor.length == 9 ? bgColor.slice(0, -2) : bgColor),  
          borderWidth: status !== "previous"?3:null,        
          borderColor:status !== "previous"? '#9CDE00':null 
        }}/>
        <View style={{
          width: 5,
          height: 230,
          borderRadius: 100,
          backgroundColor: bgColor.length == 9 ? bgColor.slice(0, -2) : bgColor,
        }}/>
      </View>
      <TouchableOpacity style={{
        alignItems: "center",
        zIndex: 1,
        width: "70%",
        backgroundColor: status === "previous" ? "#BCBCBC10" : "#9CDE0010",
        borderRadius: 17,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: bgColor.length == 9 ? bgColor.slice(0, -2) : bgColor,
        padding: 15,
        height: "auto",
        opacity: status === "previous" ?0.5:null
      }}
        onPress={() => setTakeDetailsModalVisible(true)}
      >
        <View style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
          <View style={{
            backgroundColor: status === "previous" ? "#BCBCBC40" : "#9CDE00",
            borderRadius: 100,
            padding: 10,
          }}>
            <Text style={{ color: status === "previous" ? null : "white", fontWeight: "700", fontSize: 15, maxWidth: 180 }} numberOfLines={1} ellipsizeMode="tail">{take.treatmentName}</Text>
          </View>
          <Text style={{ fontWeight: "700" }}>{formatHour(date)}</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, width: "100%", padding: 10, backgroundColor: status === "previous" ? "#BCBCBC40" : "#9CDE0040", borderRadius: 50 }}>
          <Icon.Info color={status === "previous" ? "#BCBCBC" : "#9CDE00"} width={25} height={25} />
          <Text style={{ fontWeight: "bold", color: "#444444" }} ellipsizeMode="tail" numberOfLines={1}>{med ? med + " x " + take.quantity : null}</Text>
        </View>

        <View style={{ padding: 30, display: "flex", flexDirection: "row", gap: 15 }} >
          <View style={{
            backgroundColor: status === "previous" ? "#BCBCBC90" : "#9CDE00",
            width: 5,
            borderRadius: 100,

          }} />
          <View>
            <Text style={{ color: status === "previous" ? "#7B7B7B" : "black", fontWeight: "bold" }}>Description :</Text>
            <Text style={{ color: "#C9C9C9", fontWeight: "700" }} numberOfLines={3} ellipsizeMode="tail">{treatmentDescription ? treatmentDescription : "Aucune description..."}</Text>
          </View>

        </View>
        {status !== "next" ? (
          <View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              {take.taken ? (
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center", paddingVertical: 3 }}>
                  <Icon.CheckCircle color="#9CDE00" width={22} height={22} />
                  <Text style={{ color: status === "previous" ? "#9CDE00" : "black", fontWeight: "bold" }}>Pris</Text>
                </View>

              ) : (
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center", paddingVertical: 3, }}>
                  <Icon.AlertCircle color={status === "previous" ? "#333333" : "#FF000090"} width={22} height={22} />
                  <Text style={{ color: status === "previous" ? "#333333" : "#FF000090", fontWeight: "bold" }}>Non pris</Text>
                </View>

              )}
            </View>
          </View>
        ) : null}

      </TouchableOpacity>
      {status !== "next" &&(
        <ModalComponent
          visible={takeDetailsModalVisible}
          onClose={null}
          children={takeModalContent}
          styleAdded={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            maxHeight: "80%",
            width: "80%",
          }}
        />
      )}
    </SafeAreaView>

  );
};

export default Treatment;