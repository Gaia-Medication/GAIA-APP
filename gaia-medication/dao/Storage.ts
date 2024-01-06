import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserIdAutoIncrement = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("users");
    const users = jsonValue != null ? JSON.parse(jsonValue) : [];
    const userIds = users.map(user => user.id);
    let incr = 1;
    while (userIds.includes(incr)) {
      incr += 1;
    }
    return incr
  } catch (error) {
    console.error(`Erreur UserIdAutoIncrement:`, error);
  }
};

// Lire la liste depuis AsyncStorage
export const readList = async (key:string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error(`Erreur lors de la lecture de la liste ${key}:`, error);
    return [];
  }
};

// Lire un user 
export const getUserByID = async (id:number) => {
  try {
    const jsonValue = await AsyncStorage.getItem("users");
    const users = jsonValue != null ? JSON.parse(jsonValue) : [];
    const user = users.find(user => user.id === id);
    return user || null;
  } catch (error) {
    console.error(`Erreur lors de la lecture de l'user avec l'id ${id}:`, error);
  }
}

// Ajouter un élément à la liste dans AsyncStorage
export const addItemToList = async (key:string, item) => {
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
export const updateItemInList = async (key:string, index, newItem) => {
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
export const removeItemFromList = async (key:string, index) => {
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

export const removeItemFromStock = async (cis, cip, idUser) => {
  const key="stock"
  try {
    const existingList = await readList(key);
    const indexToRemove = existingList.findIndex(item => item.CIS == cis && item.CIP == cip && item.idUser == idUser);
    if (indexToRemove !== -1) {
      existingList.splice(indexToRemove, 1);
      await AsyncStorage.setItem(key, JSON.stringify(existingList));
      console.log(`Élément supprimé de la liste ${key}.`);
    } else {
      console.error(`Élément non trouvé dans la liste ${key}.`);
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression dans la liste ${key}:`, error);
  }
};

export const getAllTreatments = async (): Promise<Treatment[]> => {
  const key="treatments"
  try {

    const treatments = await AsyncStorage.getItem(key);
    if (treatments == null) {
      return []
    }

    const treatmentsJson = JSON.parse(treatments)
    const arrayOfTreatments = []
    treatmentsJson.map((treatment) => {
      const instructions= JSON.parse(treatment.instructions._j)
      const instructionsArray = []
      instructions.map((instr) => {
        let daqDict = {};
        Object.entries(instr.datesAndQuantities).forEach(([date, quantity]) => {
          daqDict[date] = Number(quantity);
        })
        const instruction : Instruction = {
          CIS: instr.CIS,
          name: instr.name,
          regularFrequency: instr.regularFrequency,
          regularFrequencyMode: instr.regularFrequencyMode,
          regularFrequencyNumber: instr.regularFrequencyNumber,
          regularFrequencyPeriods: instr.regularFrequencyPeriods,
          regularFrequencyContinuity: instr.regularFrequencyContinuity,
          regularFrequencyDays: instr.regularFrequencyDays,
          endModality: instr.endModality,
          endDate: instr.endDate,
          endQuantity: instr.endQuantity,
          quantity: instr.quantity,
          datesAndQuantities: daqDict,
        }
        instructionsArray.push(instruction)
      })
      const treatmentObject : Treatment = {
        name: treatment.name,
        description: treatment.description,
        startDate: new Date(treatment.startDate), 
        instruction: instructionsArray
      }
      arrayOfTreatments.push(treatmentObject)
    })
    return arrayOfTreatments
  } catch (error) {
    console.error(error);
  }
}
