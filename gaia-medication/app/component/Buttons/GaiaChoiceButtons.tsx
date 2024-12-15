import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "style/style";

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
        setButtons((prevButtons) =>
            prevButtons.map((button) => {
                if (button.placeholder === placeholder) {
                    // Toggle the clicked button's selected state
                    return { ...button, selected: !button.selected };
                } else if (!canBeMultiple) {
                    // Deselect other buttons if multiple selection is not allowed
                    return { ...button, selected: false };
                }
                // Leave other buttons unchanged
                return button;
            })
        );
        console.log(buttons);
        const noButtonSelected = buttons.every((button) => !button.selected);
        console.log(noButtonSelected);
        onSelectionChange(placeholder);
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
                    className={`${button.selected ? "bg-green-100" : "bg-grey-300"} w-[45%]`}
                    onPress={() => handlePressed(button.placeholder)}
                    style={[styles.button]}
                >
                    <Text className={`text-button font-bold ${!button.selected ? "text-grey-200" : "text-black"} ${!button.selected ? "dark:text-grey-200" : "dark:text-white"} uppercase`} >{button.placeholder}</Text>
                </TouchableOpacity>
            )
            )}
        </View>
    );
};

export default GaiaChoiceButtons;
