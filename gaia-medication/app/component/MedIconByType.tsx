import React from "react";
import { View, Image, Text, ActivityIndicator } from "react-native";

const MedIconByType = ({ type,size="h-5 w-5" }) => {
  const typeToImage = {
    gélule: require("../../assets/drug-icon/gélule.png"),
    comprimé: require("../../assets/drug-icon/comprimé.png"),
    suppositoire: require("../../assets/drug-icon/suppositoire.png"),
    granules: require("../../assets/drug-icon/granules.png"),
    solution: require("../../assets/drug-icon/solution.png"),
    crème: require("../../assets/drug-icon/crème.png"),
    sirop: require("../../assets/drug-icon/sirop.png"),
    suspension: require("../../assets/drug-icon/sirop.png"),
    gel: require("../../assets/drug-icon/gel.png"),
    pommade: require("../../assets/drug-icon/gel.png"),
    poudre: require("../../assets/drug-icon/poudre.png"),
    compresse: require("../../assets/drug-icon/bandage.png"),
    pansement: require("../../assets/drug-icon/bandage.png"),
    capsule: require("../../assets/drug-icon/capsule.png"),
    collyre: require("../../assets/drug-icon/collyre.png"),
    implant: require("../../assets/drug-icon/implant.png"),
    "plante(s)": require("../../assets/drug-icon/plantes.png"),
    mélange: require("../../assets/drug-icon/plantes.png"),
  };

  const imageUrl = type.includes("injectable")
    ? require("../../assets/drug-icon/implant.png")
    : typeToImage[type.split(" ")[0]] ||
      require("../../assets/drug-icon/drugs.png");

  return (
    <View>
      <Image className={size} source={imageUrl} />
    </View>
  );
};

export default MedIconByType;
