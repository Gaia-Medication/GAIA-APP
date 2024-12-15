import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export const GaiaTitleInput = ({
    className = null,
    editable = true,
    value,
    onChangeText,
    placeholder,
    width,
    color='white',
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
                <TextInput
                    editable={editable}
                    ref={textInputRef}
                    style={[styles.input, {color: color}]} // Apply height dynamically
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline={true} // Enable multiline when numberOfLines is more than 1
                />
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        backgroundColor: "transparent",
    },
    inputContainer: {
        position: 'relative',
        justifyContent: 'flex-start',
        borderRadius: 6,
    },
    input: {
        paddingBottom: 10,
        fontSize: 24,
        zIndex: 1,
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
