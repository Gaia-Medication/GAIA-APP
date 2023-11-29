import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";

const tableName = "users";

enablePromise(true);
export const getDBConnection = async () => {
  const db = openDatabase(
    {
      name: "mydb",
      location: "default",
    },
    () => {
      console.log("Database connected!");
    }, //on success
    (error) => console.log("Database error", error) //on error
  );
  return db
};

export const createUser = async (user: User) => {
  const db = await openDatabase(
    {
      name: "mydb",
      location: "default",
    },
    () => {
      console.log("Database connected!");
    }, //on success
    (error) => console.log("Database error", error) //on error
  );
  const query = `INSERT INTO ${tableName} (firstname, lastname, birthdate, gender, preference) VALUES (?, ?, ?, ?, ?)`;
  console.log(query);
  await db.executeSql(query, [
    user.firstname,
    user.lastname,
    user.birthdate,
    user.gender,
    user.preference,
  ]);
};

export const getUsers = async (db: SQLiteDatabase) => {
  try {
    const users = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);
    results.forEach((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        users.push(result.rows.item(i));
      }
    });
    return users;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get users from the database");
  }
};

export const getUser = async (db: SQLiteDatabase, userId: number) => {
  try {
    const query = `SELECT * FROM ${tableName} WHERE id = ?`;
    const results = await db.executeSql(query, [userId]);
    if (results.length > 0) {
      return results[0].rows.item(0);
    }
    return null; // ou vous pouvez lancer une erreur si l'utilisateur n'est pas trouvé
  } catch (error) {
    console.error(error);
    throw Error("Failed to get user from the database");
  }
};

export const updateUser = async (db: SQLiteDatabase, user: User) => {
  const { id, firstname, lastname, birthdate, gender, preference } = user;
  const query = `UPDATE ${tableName} SET firstname = ?, lastname = ?, birthdate = ?, gender = ?, preference = ? WHERE id = ?`;
  await db.executeSql(query, [
    firstname,
    lastname,
    birthdate,
    gender,
    preference,
    id,
  ]);
};

export const deleteUser = async (db: SQLiteDatabase, userId: number) => {
  const query = `DELETE FROM ${tableName} WHERE id = ?`;
  await db.executeSql(query, [userId]);
};
