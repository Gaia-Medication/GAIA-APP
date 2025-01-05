import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';

interface MenuItem {
    label: string;
    value: string;
}

interface DropdownMenuProps {
    placeholder: string;
    visible: boolean;
    handleClose: () => void;
    handleOpen: () => void;
    dropdownWidth?: number;
    menuItems: MenuItem[];
    onMenuItemPress: (actionKey: string) => void;
}

export const GaiaDropdownMenu: React.FC<DropdownMenuProps> = ({
    placeholder,
    visible,
    handleOpen,
    handleClose,
    dropdownWidth = 150,
    menuItems,
    onMenuItemPress,
}) => {
    const triggerRef = useRef<View>(null);
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });

    useEffect(() => {
        if (triggerRef.current && visible) {
            triggerRef.current.measure((fx, fy, width, height, px, py) => {
                setPosition({
                    x: px,
                    y: py + height,
                    width: width,
                });
            });
        }
    }, [visible]);

    return (
        <View>
            <TouchableWithoutFeedback onPress={handleOpen}>
                <TouchableOpacity ref={triggerRef} onPress={handleOpen}>
                    <View className='flex-row items-center px-2 py-1 rounded-md bg-grey-200'>
                        <Text className={`text-white text-lg font-semibold ${visible ? 'text-green-100' : 'text-white'} transition-colors duration-800`}>
                            {menuItems.find((item) => item.value === placeholder)?.label}
                        </Text>
                    </View>
                </TouchableOpacity>
            </TouchableWithoutFeedback>
            {visible && (
                <Modal
                    transparent={true}
                    visible={visible}
                    animationType="fade"
                    onRequestClose={handleClose}>
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <View style={styles.modalOverlay}>
                            <View
                                style={[
                                    styles.menu,
                                    {
                                        top: position.y,
                                        left: position.x,
                                        width: dropdownWidth,
                                    },

                                ]}>
                                {menuItems.map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() => {
                                            onMenuItemPress(item.value)
                                            handleClose()
                                        }}>
                                        <View key={item.value} style={{ padding: 5 }}>
                                            <Text className='text-white text-medium font-semibold'>
                                                {item.label}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    menu: {
        position: 'absolute',
        width: 80,
        backgroundColor: '#000',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
});