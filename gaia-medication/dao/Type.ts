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
  startDate: Date,
  medic: [],
  instructions: instruction[],
};

type instruction = {
  CIS: number,
  CIP: number,
  qty: number,
  description: string,
  recurrence: number, // seleciton par rapport à une liste ex: tous les jours ...
  duration: Date,
  endDate: Date,
}

type Stock = {
  idUser: number,
  CIS: number;
  CIP: number;
  qte: number
};

type Journal = {
  id: number,
  idSuivis: number,
  text: string
};