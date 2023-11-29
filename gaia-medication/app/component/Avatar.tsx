import React, { useState, useMemo } from "react";
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "react-native-elements";
import { styles } from "../../style/style";
import { ChevronDown, Bell } from "react-native-feather";

interface AvatarButtonProps {
  onPress: () => void;
}

const AvatarButton: React.FC<AvatarButtonProps> = ({ onPress }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useMemo(() => new Animated.Value(60), []);

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
      <TouchableWithoutFeedback onPress={toggleExpansion}>
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
          <Text style={styles.AvatarIcon}>AC</Text>
          {expanded && (
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <View style={{
                display: "flex",
              }}>
                <Text>Alexandre</Text>
                <Text>Clenet</Text>
              </View>
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
                #profile 1
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AvatarButton;
