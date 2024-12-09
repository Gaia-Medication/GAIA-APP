import { getAllDoctors } from "./Doctor";
import { getAllMed, getAllPA } from "./Meds";

//Tous les médicaments
const medicaments = getAllMed();

//Tri les medicaments avec un score selon la recherche
export type SearchDrug = {
  Name: string;
  CIS: string;
  type: string;
  score: number;
}

function findMostAccurateMed(meds: any[], search: string): SearchDrug[] {
  const scores = meds.map((med) => {
    const name = med.Name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const s = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const index = name.indexOf(s);
    if (index === -1) {
      return 0;
    } else if (index === 0) {
      return s.length / name.length;
    } else {
      return s.length / (name.length + index);
    }
  });
  const medScores = meds.map((med, index: string | number) => {
    return {
      Name: med.Name,
      CIS: med.CIS,
      type: med.Shape,
      score: scores[index],
    };
  });
  const sortedMeds = medScores.sort(
    (a: { score: number }, b: { score: number }) => b.score - a.score
  );
  return sortedMeds.filter((med) => med.score > 0);
}

//Tous les principes actifs
const pa = Array.from(getAllPA())

//Recherche d'allergie avec score
function findMostAccurateAllergy(allergies: any[], search: string) {
  const scores = allergies.map((allergy) => {
    const name = allergy.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const s = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const index = name.indexOf(s);
    if (index === -1) {
      return 0;
    } else if (index === 0) {
      return s.length / name.length;
    } else {
      return s.length / (name.length + index);
    }
  });
  const allergyScores = allergies.map((allergy, index: string | number) => {
    return {
      Name: allergy,
      score: scores[index],
    };
  });
  const sortedAllergies = allergyScores.sort(
    (a: { score: number }, b: { score: number }) => b.score - a.score
  );
  return sortedAllergies.filter((allergy) => allergy.score > 0);
}

//Recherche de medicaments
export function searchMed(inputText: string, maxResults = 50) {
  // Calcul de la distance pour chaque médicament et tri par proximité
  return findMostAccurateMed(medicaments, inputText).slice(0, maxResults);
}

//Recherche d'allergie
export function SearchAllergy(inputText: string, maxResults = 50) {
  return findMostAccurateAllergy(pa, inputText).slice(0, maxResults);
}

//Recherche de médicaments avec le Scan
export function trouverNomMedicament(texte: string) {
  console.log(texte)
  var Filter = [];
  var ordonnanceBool = false
  if (texte.toLowerCase().includes("ordo") || texte.toLowerCase().includes("doct") || texte.toLowerCase().includes("presc") || texte.toLowerCase().includes("medec")) ordonnanceBool = true
  for (const medicament of medicaments) {
    if (medicament.Name.split(" ")[0].length < 4) {
      if (texte.toLowerCase().includes(medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(',', '').split(" ")[0].toLowerCase() + " " + medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(',', '').split(" ")[1].toLowerCase())) {
        Filter.push({ Name: medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), CIS: medicament.CIS });
      }
    }
    else if (texte.toLowerCase().includes(medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(',', '').split(" ")[0].toLowerCase()) && texte.toLowerCase().includes(medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(',', '').split(" ")[1].toLowerCase())) {
      Filter.push({ Name: medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), CIS: medicament.CIS });
    }
  }
  Filter = Filter.map((medicament) => {
    return {
      med: medicament,
      score: calculateScore(texte, medicament.Name).toFixed(2)
    }
  })
  Filter = Filter.sort(
    (a: { score: number }, b: { score: number }) => b.score - a.score
  );
  Filter = Filter.filter(medicament => medicament.score > 50)
  console.log(ordonnanceBool)
  console.log(Filter)
  const doctor = ordonnanceBool && Filter.length > 0 ? getAllDoctors().find(
    (doctor) =>
      texte.toLowerCase().includes(
        doctor.Prenom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() +
        " " +
        doctor.Nom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      ) ||
      texte.toLowerCase().includes(
        doctor.Nom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() +
        " " +
        doctor.Prenom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      )
  ) : null;
  console.log(doctor)
  if (ordonnanceBool) return { ordonnanceBool: ordonnanceBool, meds: Filter.slice(0, 10), doctor: doctor }
  const highScoreMeds = Filter.filter(medicament => medicament.score > 99);
  if (highScoreMeds.length > 0) return { ordonnanceBool: ordonnanceBool, meds: highScoreMeds, doctor: null }
  return { ordonnanceBool: ordonnanceBool, meds: Filter.slice(0, 3), doctor: null }
}

//Score de recherche pour le Scan
function calculateScore(text: string, searchText: string): number {
  const textLowerCase = text.toLowerCase();
  const searchTextLowerCase = searchText.toLowerCase();

  // Split the text into words
  const words = searchTextLowerCase.replace(',', '').replace('-', '').split(" ");

  // Initialize a score
  let score = 0;

  // Loop through the words and calculate the score
  words.forEach((word) => {
    if (textLowerCase.includes(word)) {
      // You can adjust the scoring logic based on your requirements
      score += 1;
    }
  });

  return (score / words.length * 100);
}

