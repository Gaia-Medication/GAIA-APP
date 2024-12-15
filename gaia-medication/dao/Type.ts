interface User {
  id: number;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  weight: number;
  gender: string;
  allergies: string[];
  avatar: string;
  bgcolor: string;
}

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