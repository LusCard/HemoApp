import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMyProfile, loginUser, logoutUser } from "../services/apiService";

// 1. Crear el Contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyProfile();
      if (response.ok && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error al notificar logout al servidor:", error);
    }

    setUser(null);
    setIsAuthenticated(false);
  };

  const handleUpdateUser = (updatedData) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      return { ...prevUser, ...updatedData };
    });
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout,
    handleUpdateUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
