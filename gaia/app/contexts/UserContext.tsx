import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserByID } from "./../../data/Storage";
import { User } from "react-native-feather";

export interface User {
    id: number,
    firstname: string;
    lastname: string;
    dateOfBirth: Date;
    weight: number;
    gender: string;
    allergies: string[];
    avatar:string
    bgcolor:string
}

interface IUserContext {
    user: User | undefined;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider:React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // APP INIT
  useEffect(() => {
    const getUserAtStart = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      
      getUserByID(Number(storedUser)).then((user) => {
        setUser(user);

        console.log("User fetched from AsyncStorage: ", user);
      });
    };

    getUserAtStart();
  }, []);

  // Update both context and AsyncStorage when user changes
  const updateUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser === null) {
      await AsyncStorage.setItem("user", "");
      return
    }
    await AsyncStorage.setItem("user", newUser.id.toString());
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
