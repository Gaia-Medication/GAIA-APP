import data from './medication.json';
import data2 from './interaction.json';
import data3 from './ATC_Label.json';

const ATC_label=JSON.parse(JSON.stringify(data3))

//Tous les médicamenets
const medicaments=JSON.parse(JSON.stringify(data))
export function getAllMed(){   
  try {
    return medicaments
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

const interactions=JSON.parse(JSON.stringify(data2))
export function getAllInteractions(){   
  try {
    return interactions
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}


//Return le médicament à partir de son CIS
export function getMedbyCIS(CIS){   
  try {
    const medicament = medicaments.find(med => med.CIS === CIS);
    return medicament || null;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

//Return tous les génériques d'un médicament à partir de son CIS
export function getAllGenOfCIS(CIS){   
  try {
    const medicament = medicaments.find(med => med.CIS === CIS);
    if(medicament.Generique===null)return []
    const gens = medicaments.filter(med => med.Generique === medicament.Generique && med.CIS !== CIS);
    return gens
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

//Return tous les médicaments similaire à partir de son CIS
export function getAllSameCompOfCIS(CIS){   
  try {
    let areSetsEqual = (set1, set2) => set1.size === set2.size && [...set1].every(val => set2.has(val));
    const medicament = medicaments.find(med => med.CIS === CIS);
    const composition = medicament.Composition
    const principesActifsUniques = new Set();
    composition.forEach((element) => {
      const principeActif = element["Principe actif"][0];
      principesActifsUniques.add(principeActif);
    });
    
    const DosageUniques = new Set();
    composition.forEach((element) => {
      const principeActif = element["Dosage"][0]; 
      DosageUniques.add(principeActif);
    });
    const sameComp = medicaments.filter(med => med.Composition && 
      areSetsEqual(new Set( med.Composition.map(element => element["Principe actif"][0])), principesActifsUniques) && 
      areSetsEqual(new Set( med.Composition.map(element => element["Dosage"][0])), DosageUniques) &&
      med.CIS !== CIS);
    return sameComp
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getAllSameCompOfCISWithHimself(CIS){   
  try {
    let areSetsEqual = (set1, set2) => set1.size === set2.size && [...set1].every(val => set2.has(val));
    const medicament = medicaments.find(med => med.CIS === CIS);
    const composition = medicament.Composition
    const principesActifsUniques = new Set();
    composition.forEach((element) => {
      const principeActif = element["Principe actif"][0];
      principesActifsUniques.add(principeActif);
    });
    const sameComp = medicaments.filter(med => med.Composition && 
      areSetsEqual(new Set( med.Composition.map(element => element["Principe actif"][0])), principesActifsUniques));
    return sameComp
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

//Tous les principes actifs
export function getAllPA(){   
  try {
    const allPrincipesActifsUniques = new Set(); // Ensemble global pour tous les principes actifs uniques
    
    // Parcourir tous les médicaments
    medicaments.forEach((med) => {
      const medComposition = med.Composition;
      
      // Parcourir la composition de chaque médicament
      medComposition&&medComposition.forEach((element) => {
        const principeActif = element["Principe actif"][0];
        allPrincipesActifsUniques.add(principeActif);
      });
    });

    return allPrincipesActifsUniques;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

//Return le/les principe(s) actif(s) d'un medicament à partir de son CIS
export function getPAfromMed(CIS: number){   
  try {
    const medicament = medicaments.find(med => med.CIS === CIS);
    const composition = medicament.Composition
    const principesActifsUniques = new Set();
    composition.forEach((element) => {
      const principeActif = element["Principe actif"][0];
      principesActifsUniques.add(principeActif);
    });

    return principesActifsUniques;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}


//Return le/les intéractions médicamenteuses d'un médicament à partir de son CIS
export function getIMfromMed(CIS: number){   
  try {
    const principesActifsUniques=getPAfromMed(CIS)
    const interactionsMed = []
    principesActifsUniques.forEach((pa:string) => {
      if (interactions[`${pa.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`]) { // Check if there are interactions listed for this active substance
        interactions[`${pa.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`].forEach((interaction) => {
          interactionsMed.push(interaction); // Add each interaction to the IM array
        });
      }else{
        pa.split(/[\s']/).forEach((pa:string) => {
          if (interactions[`${pa.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`]) { // Check if there are interactions listed for this active substance
            interactions[`${pa.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`].forEach((interaction) => {
              interactionsMed.push(interaction); // Add each interaction to the IM array
            });
          }
        });
      }
    });
    return interactionsMed; // Return the array of interactions
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}


//Reformate la composition d'un médicament
export function getComposition(composition){   
  try {
    const dictionnaireTypes = {};

    composition.forEach((comprime) => {
      comprime["type"].forEach((type, index) => {
        if (!dictionnaireTypes[type]) {
          dictionnaireTypes[type] = [];
        }
      });
      if(comprime["type"].length>1){
        comprime["type"].forEach((type, index) => {
          dictionnaireTypes[type].push({
            PrincipeActif: comprime["Principe actif"][0],
            Dosage: comprime["Dosage"][index],
            Quantite: comprime["Quantité"][0],
          });
        });
      }else{
        comprime["Principe actif"].forEach((pa, index) => {
          dictionnaireTypes[comprime["type"][0]].push({
            PrincipeActif: pa,
            Dosage: comprime["Dosage"][index],
            Quantite: comprime["Quantité"][0],
          });
        });
      }
    });
    return dictionnaireTypes;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}


export function getATCLabel(codeATC){   
  try {
    var codePere=codeATC
    const labels=[]
    while (codePere!="-") {
      const atc=ATC_label.find(item=>item.ATC_code===codePere)
      codePere=atc.ATC_codePere
      labels.push(atc.Label)
    }
    return labels.reverse()
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getAllMedsOfLab(labo){   
  try {
    return medicaments.filter(med => med.Titulaire===labo)
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}