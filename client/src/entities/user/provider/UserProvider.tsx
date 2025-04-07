import { createContext, ReactNode, useState } from "react";
import { IUser } from "../model";

export type UserContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element => {
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
