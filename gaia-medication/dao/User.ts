import * as SQLite from "expo-sqlite";

export const createUser = (db:SQLite.SQLiteDatabase,user: User) => {
  
  db.transaction(
    (tx) => {
      tx.executeSql(
        "INSERT INTO users (firstname, lastname, birthdate, gender, preference) values (?, ?, ?, ?, ?);",
        [
          user.firstname,
          user.lastname,
          user.birthdate,
          user.gender,
          user.preference,
        ]
      );
    },
    (error) => console.log("Error inserting", error)
  );
  console.log("user created :",user)
};

export function getUser(db:SQLite.SQLiteDatabase,userId: number, setUser: (user: User | null) => void) {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE id = ?;",
        [userId],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            setUser(_array[0]);
          } else {
            setUser(null); // or handle the user not found case
          }
        }
      );
    },
    (error) => {
      console.log("Error fetching user", error);
      setUser(null); // handle error case
    }
  );
}

export function getAllUsers(db:SQLite.SQLiteDatabase,setUsers) {
  db.transaction(
    (tx) => {
      tx.executeSql("SELECT * FROM users;", [], (_, { rows: { _array } }) => {
        setUsers(_array);
      });
    },
    (error) => console.log("Error fetching", error)
  );
}

export function updateUser(db:SQLite.SQLiteDatabase,user: User, userId: number) {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "UPDATE users SET firstname = ?, lastname = ?, birthdate = ?, gender = ?, preference = ? WHERE id = ?;",
        [
          user.firstname,
          user.lastname,
          user.birthdate,
          user.gender,
          user.preference,
          userId,
        ]
      );
    },
    (error) => console.log("Error updating", error)
  );
}

export function deleteUser(db:SQLite.SQLiteDatabase,userId: number) {
  db.transaction(
    (tx) => {
      tx.executeSql("DELETE FROM users WHERE id = ?;", [userId]);
    },
    (error) => console.log("Error deleting", error)
  );
}

export function deleteAllUsers(db:SQLite.SQLiteDatabase) {
  db.transaction(tx => {
    tx.executeSql(
      "DELETE FROM users;",
      [],
      (_, result) => {
        console.log("All users deleted", result);
      },
      (_, error) => {
        console.log("Error deleting all users", error);
        return false; // Return false to rollback the transaction
      }
    );
  });
}