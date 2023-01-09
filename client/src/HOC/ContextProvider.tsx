import React, { createContext, useState } from "react";

export type UserContextType = {
  user: User | null;
  addUser: (user: User) => void;
  clearUser: () => void;
};

interface Props {
  children: React.ReactNode;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const addUser = (user: User) => {
    setUser(user);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, addUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
