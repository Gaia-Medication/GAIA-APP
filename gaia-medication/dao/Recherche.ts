import { getAllMed } from "./Medicaments";

export async function searchMed(inputText: string, maxResults = 10) {
  const medicaments = await getAllMed();
  // Fonction pour calculer la distance de Levenshtein
  function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1
            )
          ); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  }

  // Calcul de la distance pour chaque médicament et tri par proximité
  return medicaments
    .map((medicament) => ({
      name: medicament.Name,
      distance: levenshtein(inputText, medicament.Name),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults)
    .map((medicament) => medicament.name);
}
