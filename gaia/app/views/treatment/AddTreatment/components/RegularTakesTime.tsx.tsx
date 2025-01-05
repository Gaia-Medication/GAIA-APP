import GaiaDateTimePicker from "components/Pickers/GaiaDateTimePicker";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { CustomTake, RegularIntervalUnit, Take } from "types/Medical";

interface RegularTakesTimeProps {
    CIS: number;
    frequencyNumber: number;
    frequencyUnit: RegularIntervalUnit;
    updateTakes: (takes: CustomTake[]) => void;
}

export const RegularTakesTime: React.FC<RegularTakesTimeProps> = ({ CIS, frequencyNumber, frequencyUnit, updateTakes }) => {
    const [takes, setTakes] = useState<CustomTake[]>([]);

    useEffect(() => {
        const startDate = new Date();
      
        const newTakes = Array.from({ length: frequencyNumber }).map((_, index) => {

          const date = new Date(startDate.getTime() + index * 60 * 60 * 1000);
          
          return {
            CIS: CIS,
            date: date.toISOString(),
            quantity: 1,
          };
        });
      
        setTakes(newTakes);
        console.log(newTakes);
      }, [frequencyNumber, frequencyUnit, updateTakes]);

    const handleTimeChange = (date: Date, index: number) => {
        const newTakes = [...takes];
        newTakes[index].date = date.toISOString();
        setTakes(newTakes);
        updateTakes(newTakes);
        console.log(newTakes);
    }


    return (
        <View>
            {takes.length > 0 && takes.map((take, index) => (
                <GaiaDateTimePicker
                    key={index}
                    date={new Date(take.date)}
                    buttonPlaceholder="Heure de prise"
                    buttonDisabled={false}
                    onDateChange={(date) => handleTimeChange(date, index)}
                    mode="time"
                    timeDayOnly={true}
                />
            ))}
        </View>
    );
}