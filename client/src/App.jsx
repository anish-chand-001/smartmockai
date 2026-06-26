import React, { useEffect } from "react"; // Fixed: Added useEffect to the import statement
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

export const ServerUrl = "http://localhost:8000";

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const getUser = async () => {
      dfd
      try {
        const result = await axios.get(`${ServerUrl}/api/user/current-user`, {
          withCredentials: true,
        });
        
       
        if (result.data?.success) {
          dispatch(setUserData(result.data.user));
        }
      } catch (error) {
        console.error("Failed to fetch persistent user context:", error);
        dispatch(setUserData(null));
      }
    };

    
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default App;