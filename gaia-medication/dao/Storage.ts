import AsyncStorage from "@react-native-async-storage/async-storage";


// Lire la liste depuis AsyncStorage
export const readList = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error(`Erreur lors de la lecture de la liste ${key}:`, error);
    return [];
  }
};

// Ajouter un élément à la liste dans AsyncStorage
export const addItemToList = async (key, item) => {
  try {
    const existingList = await readList(key);
    existingList.push(item);
    await AsyncStorage.setItem(key, JSON.stringify(existingList));
    console.log(`Élément ajouté à la liste ${key}.`);
  } catch (error) {
    console.error(`Erreur lors de l'ajout à la liste ${key}:`, error);
  }
};

// Mettre à jour un élément dans la liste dans AsyncStorage
export const updateItemInList = async (key, index, newItem) => {
  try {
    const existingList = await readList(key);
    if (index >= 0 && index < existingList.length) {
      existingList[index] = newItem;
      await AsyncStorage.setItem(key, JSON.stringify(existingList));
      console.log(`Élément mis à jour dans la liste ${key}.`);
    } else {
      console.error(`Index invalide pour la mise à jour dans la liste ${key}.`);
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour dans la liste ${key}:`, error);
  }
};

// Supprimer un élément de la liste dans AsyncStorage
export const removeItemFromList = async (key, index) => {
  try {
    const existingList = await readList(key);
    if (index >= 0 && index < existingList.length) {
      existingList.splice(index, 1);
      await AsyncStorage.setItem(key, JSON.stringify(existingList));
      console.log(`Élément supprimé de la liste ${key}.`);
    } else {
      console.error(`Index invalide pour la suppression dans la liste ${key}.`);
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression dans la liste ${key}:`, error);
  }
};