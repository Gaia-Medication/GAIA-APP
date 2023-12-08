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

interface AvatarButtonProps {
  onPress: () => void;
  users: User[];
  current: User;
  setUser: any;
  navigation;
}

const AvatarButton: React.FC<AvatarButtonProps> = ({
  onPress,
  users,
  current,
  setUser,
  navigation,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dropdownListVisible, setDropdownListVisible] = useState(false);
  const usersNoCurrent = users.filter((user) => user.id !== current.id);
  // const pour le style
  const animation = useMemo(() => new Animated.Value(60), []);
  const textOpacity = useMemo(() => new Animated.Value(0), []);
  const windowWidth = Dimensions.get("window").width;
  const avatarColors = [
    "#FFCF26",
    "#268AFF",
    "#1FD13C",
    "#FF4D26",
    "#FF8E26",
    "#C7FF26",
    "#276A0F",
    "#41D0D9",
    "#343ADD",
    "#9234DD",
    "#EA5CCA",
  ];

  useEffect(() => {
    console.log(users);
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

  const renderItem = (item: User, isLast: boolean) => (
    <>
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 5,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: "#F6F6F6",
        }}
      >
        <Text
          style={[
            styles.AvatarIcon,
            item.id
              ? { backgroundColor: avatarColors[item.id - 1] }
              : { backgroundColor: "#8E8E8E" },
          ]}
        >
          {item.firstname.charAt(0) + item.lastname.charAt(0)}
        </Text>
        <Text style={styles.avatarText}>
          {item.firstname} {item.lastname}
        </Text>
        <Text style={styles.profileNoHighlight}>#profil {item.id}</Text>
      </TouchableOpacity>
      {isLast && (
        <TouchableOpacity onPress={() => navigation.navigate("CreateProfile")}>
          <Text style={{ textAlign: "center", padding: 10, color: "#8E8E8E" }}>
            + Ajouter un profil
          </Text>
        </TouchableOpacity>
      )}
    </>
  );

  const handleSelect = async (item) => {
    setUser(item);
    await AsyncStorage.setItem("currentUser", JSON.stringify(item.id));
    setDropdownListVisible(false);
  };

  return (
    <View style={{ alignItems: "center", zIndex: 1 }}>
      <Pressable onPress={toggleExpansion}>
        <Animated.View
          style={{
            width: animation,
            borderRadius: 100,
            borderWidth: expanded ? 1 : 0,
            borderColor: "#E8E8E8",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
          }}
        >
          <Text
            style={[
              styles.AvatarIcon,
              current.id
                ? { backgroundColor: avatarColors[current.id - 1] }
                : { backgroundColor: "#8E8E8E" },
            ]}
          >
            {current.firstname.charAt(0) + current.lastname.charAt(0)}
          </Text>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 14,
            }}
          >
            {expanded && (
              <>
                <TouchableOpacity
                  onPress={() => setDropdownListVisible(!dropdownListVisible)}
                  style={{
                    width: "85%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                  <Text style={styles.profileHighlight}>
                    #profil {current.id}
                  </Text>
                </TouchableOpacity>
                {dropdownListVisible && (
                  <FlatList
                    style={{
                      width: windowWidth,
                      backgroundColor: "#fff",
                      position: "absolute",
                      top: 55,
                      left: -50,
                      paddingRight: "18%",
                    }}
                    data={usersNoCurrent}
                    renderItem={({ item, index }) => {
                      const isLast = index === usersNoCurrent.length - 1;
                      return (
                        <React.Fragment key={item.id}>
                          {renderItem(item, isLast)}
                        </React.Fragment>
                      );
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                      <TouchableOpacity
                        onPress={() => navigation.navigate("CreateProfile")}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            padding: 10,
                            color: "#8E8E8E",
                          }}
                        >
                          + Ajouter un profil
                        </Text>
                      </TouchableOpacity>
                    }
                  ></FlatList>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default AvatarButton;
