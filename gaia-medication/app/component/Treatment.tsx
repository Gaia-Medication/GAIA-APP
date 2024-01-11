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

const Treatment = ({ navigation, onPress, status = "actual" as "actual" | "next" | "previous", take, treatmentName, treatmentDescription, med, onTakePress, validateModalFun }) => {
  const [expanded, setExpanded] = useState(false);

  const [date, setDate] = useState<Date>(new Date());
  const [takeDetailsModalVisible, setTakeDetailsModalVisible] = useState(false);
  const [newTxt, setNewTxt] = useState("");
  

  const init = () => {
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
      <TouchableOpacity style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 40 }} onPress={() => handleReviewChange()}>
        <Text style={{ fontSize: 17, color:"#9CDE00" }}>Valider</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    init();
  }, [take]);

  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 10, maxHeight: "auto", marginBottom: 7, marginTop: 7, }}>
      <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", width: "20%", gap: 50 }}>
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <Text style={{ fontWeight: "800", fontSize: 20, color: status === "previous" ? "#BCBCBC" : status === "actual" ? "#9CDE00" : "#00000099" }}>{formatDate(date).day}</Text>
          <Text style={{ fontWeight: "800", fontSize: 20, color: status === "previous" ? "#BCBCBC" : status === "actual" ? "#9CDE00" : "#00000099" }}>{formatDate(date).dayOfMonth}</Text>
          <Text style={{ fontWeight: "800", fontSize: 20, color: status === "previous" ? "#BCBCBC" : status === "actual" ? "#9CDE00" : "#00000099" }}>{formatDate(date).month}</Text>
        </View>
        {status == "actual" && (date.toISOString() <= new Date().toISOString())&&(
          <TouchableOpacity onPress={() => onTakePress(take)}>
            <View style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20%", backgroundColor: take.taken ? ("#9CDE0030") : (status === "actual" ? "#FF000030" : "#CCCCCC"), padding: 10, borderRadius: 50 }}>
              {take.taken ? <Icon.CheckCircle color={status === "actual" ? "#9CDE00" : "grey"} width={30} height={30} /> : <Icon.AlertCircle color={status === "actual" ? "#FF0000" : "#666666"} width={30} height={30} />}

            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ display: "flex", flexDirection: "column", gap: 15, alignItems: "center"}} className=" flex-1">
        <View style={{
          width: 15,
          height: 15,
          borderRadius: 100,
          backgroundColor: status === "next"?"#FFFFFF":status === "previous"?"#BCBCBC90":"#9CDE00",  
          borderWidth: status !== "previous"?3:null,        
          borderColor:status !== "previous"? '#9CDE00':null 
        }}/>
        <View style={{
          width: 5,
          height: 230,
          borderRadius: 100,
          backgroundColor: status === "previous"? '#BCBCBC90':'#9CDE00',
        }}/>
      </View>
      <TouchableOpacity style={{
        alignItems: "center",
        zIndex: 1,
        width: "70%",
        backgroundColor: status === "actual" ? "#9CDE0010" : "#BCBCBC10",
        borderRadius: 17,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: status === "actual" ? "#9CDE00" : "#BCBCBC90",
        padding: 15,
        height: "auto",
        opacity: status === "previous" ?0.5:null
      }}
        disabled={!(status !== "next" && (date.toISOString() <= new Date().toISOString()))}
        onPress={() => setTakeDetailsModalVisible(true)}
      >
        <View style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
          <View className="flex-1 items-center mx-2"
          style={{
            backgroundColor: status === "previous" ? "#BCBCBC40" : "#9CDE00",
            borderRadius: 100,
            padding: 5,
          }}>
            <Text style={{ color: status === "previous" ? null : "white", fontWeight: "700", fontSize: 12,lineHeight:14, maxWidth: 180 }} numberOfLines={1} ellipsizeMode="tail">{take.treatmentName}</Text>
          </View>
          <Text className="mx-2" style={{ fontWeight: "700",fontSize:16, }}>{formatHour(date)}</Text>
        </View>

        <TouchableOpacity onPress={()=>navigation.navigate("Drug", { drugCIS: take.CIS })}
        style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, width: "100%", padding: 10, backgroundColor: status === "previous" ? "#BCBCBC40" : "#9CDE0040", borderRadius: 50 }}>
          <Icon.Info color={status === "previous" ? "#BCBCBC" : "#9CDE00"} width={25} height={25} />
          <Text style={{ fontWeight: "bold", color: "#444444" }} ellipsizeMode="tail" numberOfLines={1}>{med ? "x" + take.quantity+" "+med  : null}</Text>
        </TouchableOpacity>

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
        {status !== "next" && (date.toISOString() <= new Date().toISOString())&&(
          <View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              {take.taken ? (
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center", paddingVertical: 3 }}>
                  {take.review&&take.review.length>0&&<Icon.BookOpen className="mr-2" color={status === "previous" ? "#333333" : "#9CDE00"} width={30} height={30} />}
                  <Icon.CheckCircle color="#9CDE00" width={22} height={22} />
                  <Text style={{ color: "#9CDE00", fontWeight: "bold" }}>Pris</Text>
                </View>

              ) : (
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center", paddingVertical: 3, }}>
                  {take.review&&take.review.length>0&&<Icon.BookOpen className="mr-2" color={status === "previous" ? "#333333" : "#9CDE00"} width={30} height={30} />}
                  <Icon.AlertCircle color={status === "previous" ? "#333333" : "#FF000090"} width={22} height={22} />
                  <Text style={{ color: status === "previous" ? "#333333" : "#FF000090", fontWeight: "bold" }}>Non pris</Text>
                </View>

              )}
            </View>
          </View>
        )}

      </TouchableOpacity>
      {status !== "next" && (date.toISOString() <= new Date().toISOString())&&(
        <ModalComponent
          visible={takeDetailsModalVisible}
          onClose={()=>setTakeDetailsModalVisible(!takeDetailsModalVisible)}
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