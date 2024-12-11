import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const GaiaInput = ({
  className = null,
  editable = true,
  value,
  onChangeText,
  placeholder,
  width,
  numberOfLines = 1, // Default to 1 line if not provided
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
        <View
          style={[styles.inputContainer, width, numberOfLines > 1 ? { height: 20 * numberOfLines +20 } : {}]} // Dynamically calculate height based on numberOfLines
          className={`${editable ? 'bg-grey-300' : 'bg-grey-100'}`}
        >
          {!value && (
            <Text style={[styles.placeholder]} className='uppercase text-grey-200 font-light'>
              {placeholder}
            </Text>
          )}
          <TextInput
            editable={editable}
            ref={textInputRef}
            style={[styles.input, numberOfLines > 1 ? { height: 20 * numberOfLines +20 } : {}]} // Apply height dynamically
            value={value}
            onChangeText={onChangeText}
            placeholder=""
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline={numberOfLines > 1} // Enable multiline when numberOfLines is more than 1
            numberOfLines={numberOfLines} // Set number of lines for the input
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'flex-start',
    borderRadius: 6,
  },
  input: {
    padding: 10,
    fontSize: 16,
    marginLeft: 10,
    zIndex: 1,
    color: '#5E5E5E',
    fontWeight: '600',
    lineHeight: 20,
    
  },
  placeholder: {
    position: 'absolute',
    left: 16,
    fontSize: 16,
    zIndex: 2,
    color: '#888',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});

export default GaiaInput;
