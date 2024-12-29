import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MedIconByType from './MedIconByType';
import { NewInstruction } from 'types/Medical';
import { ContextMenuView } from 'react-native-ios-context-menu';

interface GaiaItemSelectedProps {
  item: NewInstruction;
  complete: boolean;
  onPress: (item: NewInstruction) => void;
  onEdit: (item: NewInstruction) => void;
  onDelete: (item: NewInstruction) => void;
}

const GaiaItemSelected = ({ item, complete, onPress, onEdit, onDelete }) => {
  complete = complete as boolean;

  return (
    <ContextMenuView
      menuConfig={{
        menuTitle: 'Doliprane',
        menuPreferredElementSize: 'medium',
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
      onPressMenuItem={({ nativeEvent }) => {
        switch (nativeEvent.actionKey) {
          case 'details':
            onPress(item);
            break;
          case 'modify':
            onEdit(item);
            break;
          case 'delete':
            onDelete(item);
            break;
        }
      }}
    >

      <TouchableOpacity
        className={`flex-row bg-grey-100 mt-2 mx-2 p-2 rounded-md border-2 ${complete ? 'border-green-100' : 'border-grey-200'} p-5`}
        onLongPress={() => {
          console.log('Long Press');
        }}
        onPress={() => onPress(item)}
      >
        <MedIconByType type={item.type} />
        <Text className='text-white text-base font-semibold ml-4'>{item.name}</Text>
      </TouchableOpacity>
    </ContextMenuView>
  );
};

const GaiaItemsSelected = ({ items, onItemPressed, onItemEdit, onItemDelete }) => {
  return (
    <View className='w-full flex-row justify-start align start flex-wrap h-full'>
      <ScrollView className='h-full'>
        {items.map((item: NewInstruction) => (

          <GaiaItemSelected key={item.CIS} item={item} complete={item.completed} onPress={onItemPressed} onEdit={onItemEdit} onDelete={onItemDelete} />

        ))}
      </ScrollView>

    </View>
  );
};

export default GaiaItemsSelected;
