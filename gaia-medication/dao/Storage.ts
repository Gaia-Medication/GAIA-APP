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
export const readList = async (key: string) => {
  try {
    const val = await AsyncStorage.getItem(key);
    return val != null ? JSON.parse(val) : [];
  } catch (error) {
    console.error(`Erreur lors de la lecture de la liste ${key}:`, error);
  }
};

// Lire un user 
export const getUserByID = async (id: number) => {
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
export const addItemToList = async (key: string, item) => {
  try {
    let existingList = await readList(key);
    existingList.push(item)
    await AsyncStorage.setItem(key, JSON.stringify(existingList));
    console.log(`Élément ajouté à la liste ${key}.`);
  } catch (error) {
    console.error(`Erreur lors de l'ajout à la liste ${key}:`, error);
  }
};

// Mettre à jour un élément dans la liste dans AsyncStorage
export const updateItemInList = async (key: string, index, newItem) => {
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
export const removeItemFromList = async (key: string, index) => {
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
  const key = "stock"
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
  const key = "treatments"
  try {

    const treatments = await AsyncStorage.getItem(key);
    if (treatments == null) {
      return []
    }

    const treatmentsJson: [] = JSON.parse(treatments)
    const arrayOfTreatments = []
    treatmentsJson && treatments.length != 0 ? treatmentsJson.map((treatment: Treatment) => {
      const instructionsArray = []
      treatment.instructions ? treatment.instructions.map((instr) => {
        let daqDict = {};
        const instruction: Instruction = {
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
          takes: instr.takes,
        }
        instructionsArray.push(instruction)
      }): null
      const treatmentObject: Treatment = {
        name: treatment.name,
        userId: treatment.userId,
        description: treatment.description,
        startDate: new Date(treatment.startDate),
        instructions: instructionsArray
      }
      arrayOfTreatments.push(treatmentObject)
    }): null
    return arrayOfTreatments
  } catch (error) {
    console.error(error);
  }
}

export const initTreatments = async () => {
  const allTreatments: Treatment[] = await getAllTreatments();
  let takesArray = [];

  allTreatments ? allTreatments.forEach((treatment) => {
    console.log(treatment.name)
    treatment ? treatment.instructions.forEach((instr) => {
      instr.takes.forEach((take) => {
        console.log("take => ", take)
        takesArray.push(take)
      });
    }) : null;
  }) : new Error("No treatments found");
  return takesArray
};

export const getTreatmentByName = async (name: string, userId: number): Promise<Treatment> => {
  const allTreatments = await getAllTreatments();
  const treatment = allTreatments.find(treatment => treatment.name === name);
  return treatment || null;
}
