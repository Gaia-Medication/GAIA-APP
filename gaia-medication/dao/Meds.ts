import data from './medication.json';

const medicaments=JSON.parse(JSON.stringify(data))
export function getAllMed(){   
  try {
    return medicaments
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getMedbyCIS(CIS){   
  try {
    const medicament = medicaments.find(med => med.CIS === CIS);
    return medicament || null;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

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

