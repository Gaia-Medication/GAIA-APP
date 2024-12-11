type User = {
  id: number,
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  weight: number;
  gender: string;
  allergies: string[];
  avatar:string
  bgcolor:string
};

type Treatment = {
  name: string,
  description: string,
  doctor: string,
  userId: number,
  startDate: Date,
  instructions: Instruction[],
};

type Instruction = {
  CIS: number,
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
  taken: boolean,
  review: string,
  pain: number ,
};

type Notif = {
  notifId: string,
  userId: number,
  date: Date,
  type: string,
  datas: NotifData[],
};

type NotifData = {
  take: Take,
  medName: string,
};

type Stock = {
  idUser: number,
  CIS: number;
  CIP: number;
  qte: number
};