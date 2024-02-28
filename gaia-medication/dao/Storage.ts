import AsyncStorage from "@react-native-async-storage/async-storage";

//Auto-incrémentation pour l'id d'un profile à sa création
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

// Supprimer un élément de la liste Stock dans AsyncStorage
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

// Récupétation de tous les traitements
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
      }) : null
      const treatmentObject: Treatment = {
        name: treatment.name,
        userId: treatment.userId,
        description: treatment.description,
        startDate: new Date(treatment.startDate),
        instructions: instructionsArray
      }
      arrayOfTreatments.push(treatmentObject)
    }) : null
    return arrayOfTreatments
  } catch (error) {
    console.error(error);
  }
}

// Mise en forme d'un traitement pour la lecture
export const initTreatments = async () => {
  const allTreatments: Treatment[] = await getAllTreatments();
  let takesArray = [];
  allTreatments ? allTreatments.forEach((treatment) => {
    treatment ? treatment.instructions.forEach((instr) => {
      instr.takes.forEach((take) => {
        takesArray.push({
          take: take,
          treatmentName: treatment.name,
          treatmentDescription: treatment.description,
          med: instr.name,
        })
      });
    }) : null;
  }) : new Error("No treatments found");
  return takesArray
};

// Récupérer le traitement par le Nom
export const getTreatmentByName = async (name: string, userId: number): Promise<Treatment> => {
  const allTreatments = await getAllTreatments();
  const treatment = allTreatments.find(treatment => treatment.name === name);
  return treatment || null;
}

export async function getDaysTakes() {
  const groupedTakesByDay = {};
  const allTreatments = await getAllTreatments();

  // Iterate through allTreatments and extract takes
  allTreatments ? allTreatments.forEach((treatment) => {
    treatment ? treatment.instructions.forEach((instruction) => {
      let medName = instruction.name;
      instruction ? instruction.takes.forEach((take) => {

        let date = new Date(take.date);
        if (date instanceof Date) {
          const dateKey = date.toDateString(); // Use the date as the key

          if (!groupedTakesByDay[dateKey]) {
            groupedTakesByDay[dateKey] = [];
          }

          groupedTakesByDay[dateKey].push({ ...take, medName: medName });
        } else {
          console.error("Date invalide");
        }
      }) : null;
    }) : null;
  }) : null;

  return groupedTakesByDay;
}

export async function dropTake(take) {
  const allTreatments = await getAllTreatments();
  allTreatments ? allTreatments.forEach((treatment) => {
    if (treatment.name === take.treatmentName) {
      treatment ? treatment.instructions.forEach((instruction) => {
        instruction ? instruction.takes.forEach((tak, index) => {
          if (new Date(tak.date).toISOString() === new Date(take.date).toISOString()) {
            instruction.takes.splice(index, 1);
          }

        }) : null;
      }) : null;
    }

  }) : null;
  await AsyncStorage.setItem("treatments", JSON.stringify(allTreatments));
}


export async function addTake(take) {

  const allTreatments = await getAllTreatments();
  allTreatments ? allTreatments.forEach((treatment) => {
    if (treatment.name === take.treatmentName) {
      treatment ? treatment.instructions.forEach((instruction) => {
        instruction ? instruction.takes.push(take) : null;
      }) : null;
    }

  }) : null;
  await AsyncStorage.setItem("treatments", JSON.stringify(allTreatments));
}

export const changeTreatments = async (tak: Take) => {
  const treatments = await getAllTreatments();
  treatments.forEach((treatment) => {
    if (treatment.name === tak.treatmentName) {
      treatment.instructions.forEach((instruction) => {
        if (Number(instruction.CIS) === tak.CIS) {
          instruction.takes.forEach((take) => {
            if (take.date === tak.date) {
              take.taken = tak.taken;
              take.review = tak.review;
            }
          });
        }
      });
    }
  });
  AsyncStorage.setItem("treatments", JSON.stringify(treatments));
  return treatments;
};


export const saveNotifs = async (notificationsList) => {
  const newNotifs = notificationsList
  const notifsAlreadySaved: Notif[] = await readList("notifications");
  const updatedNotifs = [...notifsAlreadySaved];
  newNotifs.forEach((notif) => {
    if (notif.type === "daily") {
      console.log("NOTIF DAILY");
      if (!notifsAlreadySaved.find((notifAlreadySaved) => ((notifAlreadySaved.type === "daily") && (new Date(notifAlreadySaved.date).getDate() === new Date(notif.date).getDate())))) {
        updatedNotifs.push(notif);
      }
    }
    if (notif.type === "take") {
      console.log("NOTIF TAKE");
      if (!notifsAlreadySaved.find((notifAlreadySaved) => ((notifAlreadySaved.type === "take") && (new Date(notifAlreadySaved.date).getTime() === new Date(notif.date).getTime())))) {
        updatedNotifs.push(notif);
      }
    }
    if (notif.type === "late") {
      if (!notifsAlreadySaved.find((notifAlreadySaved) => ((notifAlreadySaved.type === "late") && (new Date(notifAlreadySaved.date).getDate() === new Date(notif.date).getDate())))) {
        updatedNotifs.push(notif);
      }
    }
  })
  console.log("Notifs Saved :", updatedNotifs.length);
  await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifs));
};