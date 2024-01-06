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
  instruction: Instruction[],
};

type Instruction = {
  CIS: number,
  CIP: number,
  qty: number,
  frequency: string, // seleciton par rapport à une liste ex: tous les jours ...
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