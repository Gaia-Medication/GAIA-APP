import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const GaiaInput = ({
  value,
  onChangeText,
  placeholder,
  width
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef(null);

  const handleFocus = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleFocus}>
        <View style={[styles.inputContainer, width]} className="bg-grey-300">
          {!value && (
            <Text style={[styles.placeholder]} className='uppercase text-grey-200'>
              {placeholder}
            </Text>
          )}
          <TextInput
            ref={textInputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder=""
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
    height: 40,
    borderRadius: 20,
  },
  input: {
    padding: 6,
    fontSize: 20,
    height: 40,
    marginLeft: 10,
    zIndex: 1,
    color: '#5E5E5E',
    fontWeight: "600",
  },
  placeholder: {
    position: 'absolute',
    left: 20,
    fontSize: 20,
    zIndex: 2,
    fontWeight: "600",
    color: '#888',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default GaiaInput;
