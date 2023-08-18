import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import useAxios from "./useAxios";

// Define a custom hook that gets the user info from the UserContext or the API
export default function useUserInfo() {
  // Use the useContext hook to access the UserContext value
  const { userInfo, updateUserInfo } = useContext(UserContext);

  const api = useAxios();
  
  const fetchUserInfo = async () => {
    try {
      // Await the response from the API
      let response = await api.get(`/api/user/personal-info/`);
      let data = await response.data;
      updateUserInfo(data);
    } catch (error) {
      updateUserInfo({})
    }
  }

  // Use an effect to check if there is a token in the local storage and fetch the user info if so
  useEffect(() => {
    // If there is a token and no user info in the context
    if (!userInfo) {
      // Call the async function
      fetchUserInfo();
    }
      
  }, [userInfo]); // Run only when userInfo or updateUserInfo changes

  // Return the user info, loading and update function
  return { userInfo, updateUserInfo };
}