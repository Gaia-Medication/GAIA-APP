import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "../../../style/style";

interface GaiaButton {
    placeholder: string;
    selected: boolean;
}

interface GaiaChoiceButtonsProps {
    buttons: GaiaButton[];
    canBeMultiple: boolean;
    orientation: "horizontal" | "vertical";
    gap: string;
    onSelectionChange?: (selectedButton: string) => void;
}

const GaiaChoiceButtons: React.FC<GaiaChoiceButtonsProps> = ({
    buttons: initialButtons,
    canBeMultiple,
    orientation,
    gap,
    onSelectionChange
}) => {
    // Use state to manage button selection
    const [buttons, setButtons] = useState<GaiaButton[]>(initialButtons);

    const handlePressed = (placeholder: string) => {
        setButtons((prevButtons) => {
          const newButtons = prevButtons.map((button) => {
            if (button.placeholder === placeholder) {
              return { ...button, selected: !button.selected };
            } else if (!canBeMultiple) {
              return { ...button, selected: false };
            }
            return button;
          });
      
          const noButtonSelected = newButtons.every((button) => !button.selected);
          console.log(newButtons);
          console.log(noButtonSelected);
          
          // You can also call onSelectionChange here if needed
          noButtonSelected ? onSelectionChange?.(undefined) : onSelectionChange?.(placeholder);
          
          return newButtons;
        });
      };
      

    return (
        <View
            style={{
                flexDirection: orientation === "horizontal" ? "row" : "column",
                justifyContent: "space-between",
                gap: gap,
            }}
            className="w-full "
        >
            {buttons.map((button) => (
                <TouchableOpacity
                    key={button.placeholder}
                    className={`${button.selected ? "bg-green-200" : "bg-grey-300"} w-[45%] flex justify-center items-center`}
                    onPress={() => handlePressed(button.placeholder)}
                    style={[styles.button]}
                >
                    <Text className={`text-button font-bold ${!button.selected ? "text-grey-200" : "text-black"} ${!button.selected ? "dark:text-grey-200" : "dark:text-green-100"}`} >{button.placeholder}</Text>
                </TouchableOpacity>
            )
            )}
        </View>
    );
};

export default GaiaChoiceButtons;
