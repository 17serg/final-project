import { useContext } from "react";
import { UserContext, UserContextType } from "../provider/UserProvider";

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);


  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
