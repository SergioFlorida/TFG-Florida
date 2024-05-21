import { useState, createContext } from "react";

const UserContext = createContext({
  userId: "",
  setUserId: () => {},
});

const UserContextProvider = ({ children }) => {
  const [userId, setUserId] = useState("");

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
