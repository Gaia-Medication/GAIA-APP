import React from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';
import { ContextMenuView } from 'react-native-ios-context-menu';


interface MenuItem {
    actionKey: string;
    actionTitle: string;
}

interface FrequencyPickerProps {
    menuItems: MenuItem[];
}

const FrequencyPicker: React.FC<FrequencyPickerProps> = ({ menuItems }) => {

    return (
        <View className='flex-row gap-3 items-center'>
            <TextInput className='w-auto bg-grey-200 p-2 rounded-xl text-xl text-white' style={{ textAlignVertical: 'center' }} />
            <Text className='text-white text-xl font-semibold ml-4 w-50'>fois par</Text>
            <ContextMenuView
                menuConfig={{
                    menuTitle: 'Actions',
                    menuItems: [{
                        actionKey: 'details',
                        actionTitle: 'Résumé',
                        icon: {
                            type: 'IMAGE_SYSTEM',
                            imageValue: {
                              systemName: 'doc.text',
                            },
                          }
                    }, {
                        actionKey: 'modify',
                        actionTitle: 'Modifier',
                        icon: {
                            type: 'IMAGE_SYSTEM',
                            imageValue: {
                              systemName: 'pencil',
                            },
                          }
                    }, {
                        actionKey: 'delete',
                        actionTitle: 'Supprimer',
                        menuAttributes: ['destructive'],
                        icon: {
                            type: 'IMAGE_SYSTEM',
                            imageValue: {
                              systemName: 'trash',
                            },
                          }
                    }],

                }}
            >
                <Text>
                    Press And Hold To Show Context Menu
                </Text>
            </ContextMenuView>

        </View>
    );
};

export default FrequencyPicker;
