import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Pressable, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { ChevronDown } from "react-native-feather";
import { getUserByID } from "../../dao/Storage";
import { styles } from "../../style/style";

interface AvatarButtonProps {
  onPress: () => void;
  users: User[];
  current: User;
}

const AvatarButton: React.FC<AvatarButtonProps> = ({ onPress, users, current }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useMemo(() => new Animated.Value(60), []);
  const textOpacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    console.log(users)
    Animated.timing(textOpacity, {
      toValue: expanded ? 1 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const toggleExpansion = () => {
    const toValue = expanded ? 60 : 340;
    const config = {
      toValue,
      useNativeDriver: false,
    };

    Animated.spring(animation, config).start();
    setExpanded((prevExpanded) => !prevExpanded);
    onPress();
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Pressable onPress={toggleExpansion}>
        <Animated.View
          style={{
            width: animation,
            height: 60,
            borderRadius: 100,
            borderWidth: expanded ? 1 : 0,
            borderColor: "#E8E8E8",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Text style={styles.AvatarIcon}>{current.firstname.charAt(0) + current.lastname.charAt(0)}</Text>
          {expanded && (
            <TouchableOpacity
              style={{
                width: "80%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
              }}
            >
              <Animated.View
                style={{
                  display: "flex",
                  opacity: textOpacity,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                >
                  {current.firstname}
                </Text>
                <Text>{current.lastname}</Text>
              </Animated.View>
              <ChevronDown
                stroke="#B9B9B9"
                width={24}
                height={24}
                style={styles.chevron}
              />
              <View style={styles.bar}></View>
              <Text
                style={{
                  color: "#4296E4",
                  backgroundColor: "#4296E450",
                  borderRadius: 15,
                  padding: 4,
                  paddingLeft: 6,
                  paddingRight: 6,
                }}
              >
                #profile {current.id}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default AvatarButton;
