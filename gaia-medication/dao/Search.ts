import { getAllMed } from "./Meds";

const medicaments = getAllMed();
function findMostAccurateMed(meds: any[], search: string) {
  const scores = meds.map((med) => {
    const name = med.Name.toLowerCase();
    const s = search.toLowerCase();
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
  var firstFilter = [];
  for (const medicament of medicaments) {
    if (texte.toLowerCase().includes(medicament.Name.split(" ")[0].toLowerCase())||texte.toLowerCase().includes(medicament.Name.split(",")[0].toLowerCase())) {
      firstFilter.push(medicament.Name);
    }
  }
  firstFilter=firstFilter.map((medicament)=>{
    return {
      med:medicament,
      score:calculateScore(texte, medicament)
    }
  })
  firstFilter=firstFilter.sort(
    (a: { score: number }, b: { score: number }) => b.score - a.score
  );
  console.log(firstFilter)
  return firstFilter.slice(0,10)
}

function calculateScore(text: string, searchText: string): number {
  const textLowerCase = text.toLowerCase();
  const searchTextLowerCase = searchText.toLowerCase();

  // Split the text into words
  const words = searchTextLowerCase.split(" ");

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

