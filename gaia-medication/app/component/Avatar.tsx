import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
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
}

const AvatarButton: React.FC<AvatarButtonProps> = ({
  onPress,
  users,
  current,
  setUser,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dropdownListVisible, setDropdownListVisible] = useState(false);
  const animation = useMemo(() => new Animated.Value(60), []);
  const textOpacity = useMemo(() => new Animated.Value(0), []);

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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Text>
        #profile {item.id}
        {item.firstname}
        {item.lastname}
      </Text>
    </TouchableOpacity>
  );

  const handleSelect = async (item) => {
    setUser(item);
    await AsyncStorage.setItem("currentUser", JSON.stringify(item.id));
    setDropdownListVisible(false);
  };

  return (
    <View style={{ alignItems: "center" }}>
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
          <Text style={styles.AvatarIcon}>
            {current.firstname.charAt(0) + current.lastname.charAt(0)}
          </Text>
          <View
            style={{
              display: "flex",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            {expanded && (
              <>
                <TouchableOpacity
                  onPress={() => setDropdownListVisible(!dropdownListVisible)}
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
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
                {dropdownListVisible && (
                  <FlatList
                    style={{
                      width: "80%",
                      backgroundColor: "#4296E4",
                    }}
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
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
