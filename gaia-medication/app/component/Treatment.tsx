import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-elements";
import { ChevronDown } from "react-native-feather";
import { styles } from "../../style/style";
import { getTreatmentByName } from "../../dao/Storage";
import * as Icon from "react-native-feather";

const Treatment = ({
  onPress,
  status = "actual" as "actual" | "next" | "previous",
  take,
  treatment,
  onTakePress,
}) => {
  const [expanded, setExpanded] = useState(false);

  const validStates = ["previous", "actual", "next"];
  const isStateValid = validStates.includes(status);
  const [bgColor, setBgColor] = useState("#9CDE00");
  const [date, setDate] = useState<Date>(new Date());

  const init = () => {
    if (status === "actual" || status === "next") {
      setBgColor("#9CDE0010");
    } else {
      setBgColor("#BCBCBC10");
    }

    setDate(new Date(take.date));
  };

  const formatHour = (hour) => {
    if (hour instanceof Date) {
      const hours = hour.getHours();
      const minutes = hour.getMinutes();
      const formattedTime = `${hours.toString()}:${minutes
        .toString()
        .padStart(2, "0")}`;
      return formattedTime;
    }
    return "";
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      console.error("Invalid date");
      return null;
    }

    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    let dayOfWeek = days[date.getDay()];
    let dayOfMonth = date.getDate();
    let month = months[date.getMonth()];

    return [dayOfWeek, dayOfMonth, month];
  };

  useEffect(() => {
    init();
    console.log("Treatmet", treatment);
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 10,
        maxHeight: "auto",
        marginBottom: 7,
        marginTop: 7,
        height: 320,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "20%",
          gap: 50,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontWeight: "800",
              fontSize: 20,
              color:
                status === "previous"
                  ? "#BCBCBC"
                  : status === "actual"
                  ? "#9CDE00"
                  : "#00000099",
            }}
          >
            {formatDate(date)[0]}
          </Text>
          <Text
            style={{
              fontWeight: "800",
              fontSize: 20,
              color:
                status === "previous"
                  ? "#BCBCBC"
                  : status === "actual"
                  ? "#9CDE00"
                  : "#00000099",
            }}
          >
            {formatDate(date)[1]}
          </Text>
          <Text
            style={{
              fontWeight: "800",
              fontSize: 20,
              color:
                status === "previous"
                  ? "#BCBCBC"
                  : status === "actual"
                  ? "#9CDE00"
                  : "#00000099",
            }}
          >
            {formatDate(date)[2]}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onTakePress(take)}
          disabled={status === "next"}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "20%",
              backgroundColor: take.taken
                ? status === "actual"
                  ? "#9CDE0030"
                  : "#CCCCCC"
                : status === "actual"
                ? "#FF000030"
                : "#CCCCCC",
              padding: 10,
              borderRadius: 50,
            }}
          >
            {take.taken ? (
              <Icon.CheckCircle
                color={status === "actual" ? "#9CDE00" : "grey"}
                width={30}
                height={30}
              />
            ) : (
              <Icon.AlertCircle
                color={status === "actual" ? "#FF0000" : "#666666"}
                width={30}
                height={30}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 15,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 15,
            height: 15,
            borderRadius: 100,
            backgroundColor:
              bgColor.length == 9 ? bgColor.slice(0, -2) : bgColor,
          }}
        ></View>
        <View
          style={{
            width: 5,
            height: 230,
            borderRadius: 100,
            backgroundColor:
              bgColor.length == 9 ? bgColor.slice(0, -2) : bgColor,
          }}
        ></View>
      </View>
      <View
        style={{
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
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <View
            style={{
              backgroundColor: status === "previous" ? "#BCBCBC40" : "#9CDE00",
              borderRadius: 100,
              padding: 10,
            }}
          >
            <Text
              style={{
                color: status === "previous" ? "black" : "white",
                fontWeight: "700",
                fontSize: 15,
                maxWidth: 180,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {take.treatmentName}
            </Text>
          </View>
          <Text
            style={{
              color: status === "previous" ? "#D0D0D0" : "black",
              fontWeight: "700",
            }}
          >
            {formatHour(date)}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: 10,
            backgroundColor: status === "previous" ? "#BCBCBC40" : "#9CDE0040",
            borderRadius: 50,
          }}
        >
          <Icon.Info
            color={status === "previous" ? "#BCBCBC" : "#9CDE00"}
            width={25}
            height={25}
          />
          <Text
            style={{ fontWeight: "bold", color: "#444444" }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {treatment
              ? treatment.instructions.find((ins) => ins.CIS === take.CIS)
                  .name +
                " x " +
                take.quantity
              : null}
          </Text>
        </View>

        <View
          style={{
            padding: 30,
            display: "flex",
            flexDirection: "row",
            gap: 15,
          }}
        >
          <View
            style={{
              backgroundColor: status === "previous" ? "#BCBCBC90" : "#9CDE00",
              width: 5,
              borderRadius: 100,
            }}
          />
          <View>
            <Text
              style={{
                color: status === "previous" ? "#7B7B7B" : "black",
                fontWeight: "bold",
              }}
            >
              Description :
            </Text>
            <Text
              style={{ color: "#C9C9C9", fontWeight: "700" }}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {treatment && treatment.description
                ? treatment.description
                : "Aucune description..."}
            </Text>
          </View>
        </View>

        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {take.taken ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  alignItems: "center",
                  paddingVertical: 3,
                }}
              >
                <Icon.CheckCircle color="#9CDE00" width={22} height={22} />
                <Text
                  style={{
                    color: status === "previous" ? "#9CDE00" : "black",
                    fontWeight: "bold",
                  }}
                >
                  Pris
                </Text>
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  alignItems: "center",
                  paddingVertical: 3,
                }}
              >
                <Icon.AlertCircle
                  color={status === "next" ? "#333333" : "#FF000090"}
                  width={22}
                  height={22}
                />
                <Text
                  style={{
                    color: status === "next" ? "#333333" : "#FF000090",
                    fontWeight: "bold",
                  }}
                >
                  Non pris
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Treatment;
