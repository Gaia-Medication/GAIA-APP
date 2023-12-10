import { getAllMed } from "./Meds";

const medicaments = getAllMed();
function findMostAccurateMed(meds: any[], search: string) {
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
  return sortedMeds.filter((med) => med.score > 0); //.map((med: { Name: any }) => med.Name);
}

export function searchMed(inputText: string, maxResults = 50) {
  // Calcul de la distance pour chaque médicament et tri par proximité
  return findMostAccurateMed(medicaments, inputText).slice(0, maxResults);
}

export function trouverNomMedicament(texte: string) {
  console.log(texte)
  var Filter = [];
  var ordonnanceBool=false
  if (texte.toLowerCase().includes("ordo")||texte.toLowerCase().includes("doct")||texte.toLowerCase().includes("presc")||texte.toLowerCase().includes("medec"))ordonnanceBool=true
  for (const medicament of medicaments) {
    if (texte.toLowerCase().includes(medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(',', '').split(" ")[0].toLowerCase())&&texte.toLowerCase().includes(medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(',', '').split(" ")[1].toLowerCase())) {
      Filter.push(medicament.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    }
  }
  Filter=Filter.map((medicament)=>{
    return {
      med:medicament,
      score:calculateScore(texte, medicament).toFixed(2)
    }
  })
  Filter=Filter.sort(
    (a: { score: number }, b: { score: number }) => b.score - a.score
  );
  console.log(ordonnanceBool)
  console.log(Filter)
  if(ordonnanceBool)Filter.slice(0,10)
  const highScoreMeds = Filter.filter(medicament => medicament.score > 99);
  if (highScoreMeds.length>0)return highScoreMeds
  return Filter.slice(0,3)
}

function calculateScore(text: string, searchText: string): number {
  const textLowerCase = text.toLowerCase();
  const searchTextLowerCase = searchText.toLowerCase();

  // Split the text into words
  const words = searchTextLowerCase.replace(',', '').replace('-','').split(" ");

  // Initialize a score
  let score = 0;

  // Loop through the words and calculate the score
  words.forEach((word) => {
    if (textLowerCase.includes(word)) {
      // You can adjust the scoring logic based on your requirements
      score += 1;
    }
  });

  return (score/words.length*100);
}

