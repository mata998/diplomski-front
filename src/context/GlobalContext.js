import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        loggedIn,
        setLoggedIn,
        registered,
        setRegistered,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
