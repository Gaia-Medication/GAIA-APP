type User = {
  id: number,
  firstname: string;
  lastname: string;
  age: number;
  weight: number;
  gender: string;
  preference: string;
};

type Treatment = {
  name: string,
  description: string,
  userId: number,
  startDate: Date,
  instructions: Instruction[] | undefined,
};

type Instruction = {
  CIS: string,
  name: string,
  regularFrequency: boolean, // CE MÉDICAMENT EST-IL À PRENDRE RÉGULIÈREMENT ?

  // REGULIER
  regularFrequencyMode: string, // COMMENT ? (X FOIS PAR JOUR/SEMAINE/MOIS OU TOUS LES X JOURS)
  regularFrequencyNumber: number, // X ?
  regularFrequencyPeriods: string, // SI X FOIS PAR (JOUR/SEMAINE/MOIS), PÉRIODICITÉ
  regularFrequencyContinuity: string, // EST-CE QUOTIDIEN OU SEULEMENT CERTAINS JOURS ? (DAILY/CUSTOM) 
  regularFrequencyDays: string[], // SI CERTAINS JOURS, LESQUELS ?

  // PERSONNALISÉ

  endModality: string, // COMMENT S'ARRÊTE LE TRAITEMENT ? (NOMBRE DE PRIS OU DATE DE FIN)
  endDate: Date, // DATE DE FIN SI FIN À UNE DATE PRÉCISE
  endQuantity: number, // NOMBRE DE PRIS SI FIN AU BOUT D'UN CERTAIN NOMBRE DE PRIS
  quantity: number, // QUANTITÉ À PRENDRE À CHAQUE PRISE SI QUANTITÉ RÉGULIÈRE
  takes: Take[],
}

type Take = {
  userId: number,
  treatmentName: string,
  CIS: number,
  date: Date,
  quantity: number,
  taken: boolean
};

type Stock = {
  idUser: number,
  CIS: number;
  CIP: number;
  qte: number
};

type Med = {
  CIS: number,
  name: string,
  infos: string,
  Marketed: string,
  administration_way: string,
  authorization: string,
};

type Journal = {
  id: number,
  idSuivis: number,
  text: string
};