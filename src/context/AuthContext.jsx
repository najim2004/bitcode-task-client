import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email)
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          withCredentials: true,
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
  }, [user]);

  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data);
  };

  const signup = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data);
  };

  const logout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
