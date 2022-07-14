import React, { useState } from "react";

const UserContext = React.createContext({ email: "", auth: false });

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ email: "", auth: false });
  const loginContext = (email, token) => {
    setUser((user) => ({ email: email, auth: true }));
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  };

  const logoutContext = () => {
    setUser((user) => ({ email: "", auth: false }));
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
