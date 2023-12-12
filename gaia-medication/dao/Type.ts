type User = {
    id:number,
    firstname: string;
    lastname: string;
    age: number;
    weight: number;
    gender: string;
    preference: string;
  };

type Stock = {
  idUser:number,
  CIS: number;
  CIP: number;
  qte: number
};

type Journal = {
  id:number,
  idSuivis:number,
  text: string
};

type Suivis = {
  id:number,
  CIS: number;
};