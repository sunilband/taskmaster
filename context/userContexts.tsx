"use client";
import { createContext, useContext, useState } from "react";

import { IUserContext } from "@/types/index";

interface User {
  user: IUserContext;
  setUser: (user: IUserContext) => void;
}

const UserContext = createContext<User>({
  user: { name: null, email: null, token: null },
  setUser: () => {},
});

export const UserProvider = ({
  children,
  user: initialUser,
}: {
  children: React.ReactNode;
  user?: IUserContext | null;
}) => {
  const [user, setUser] = useState<IUserContext>(
    initialUser || {
      name: null,
      email: null,
      token: null,
    },
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
