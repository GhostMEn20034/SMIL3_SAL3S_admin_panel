import { createContext, useState } from "react";

// Create a UserContext with an empty object as the default value
export const UserContext = createContext({});

// Create a UserProvider component that wraps the children components and provides the user info and update function
export function UserProvider({ children }) {
  // Use a state to store the user info
  const [userInfo, setUserInfo] = useState(null);

  // Define a function that updates the user info with new data
  const updateUserInfo = (newData) => {
    // Use the spread operator to merge the new data with the existing user info
    setUserInfo({ ...userInfo, ...newData });
  };

  // Return a UserContext.Provider component that passes the user info and update function as value
  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}