import { createContext, useState, useEffect, useCallback } from "react";
import { USE_MOCK } from "../api/axiosClient";
import * as businessApi from "../api/businessApi";
import * as authApi from "../api/authApi";
import { state as mockState, withDelay } from "../mock/seed";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshBusiness = useCallback(async () => {
    try {
      const data = await businessApi.getMyBusiness();
      if (data) {
        setBusiness(data);
        localStorage.setItem("business", JSON.stringify(data));
      }
      return data;
    } catch (e) {
      console.error("Failed to fetch fresh business profile:", e);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedBusiness = localStorage.getItem("business");
    const token =
      localStorage.getItem("howdy_token") || localStorage.getItem("token");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }

    if (savedBusiness) {
      try {
        setBusiness(JSON.parse(savedBusiness));
      } catch (e) {
        console.error("Failed to parse saved business:", e);
      }
    }

    if (token) {
      refreshBusiness().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshBusiness]);

  const register = async ({ businessName, email, password, phone = "" }) => {
    if (USE_MOCK) {
      const existing = mockState.users.find((u) => u.email === email);
      if (existing) throw new Error("Email already registered in mock state");

      const mockBusiness = {
        id: Date.now(),
        name: businessName,
        email,
        phone,
        role: "ROLE_BUSINESS_OWNER",
      };
      const mockToken = "mock-jwt-token";

      localStorage.setItem("howdy_token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockBusiness));
      localStorage.setItem("business", JSON.stringify(mockBusiness));
      setUser(mockBusiness);
      setBusiness(mockBusiness);
      return withDelay(mockBusiness);
    }

    const data = await authApi.register({ businessName, email, password, phone });

    const userData = {
      id: data.business.id,
      name: data.business.name,
      email: data.business.email,
      role: data.business.role,
    };

    localStorage.setItem("howdy_token", data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    await refreshBusiness();
    return userData;
  };

  const login = async ({ email, password }) => {
    if (USE_MOCK) {
      const found = mockState.users.find((u) => u.email === email);
      if (!found) throw new Error("Invalid email or password");

      localStorage.setItem("howdy_token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify(found));
      localStorage.setItem("business", JSON.stringify(found));
      setUser(found);
      setBusiness(found);
      return withDelay(found);
    }

    const data = await authApi.login({ email, password });

    const userData = {
      id: data.business.id,
      name: data.business.name,
      email: data.business.email,
      role: data.business.role,
    };

    localStorage.setItem("howdy_token", data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    await refreshBusiness();
    return userData;
  };

  const loginWithGoogle = async ({ email, name, googleId, picture }) => {
    if (USE_MOCK) {
      let found = mockState.users.find((u) => u.email === email);

      if (!found) {
        const defaultBizName = name ? `${name}'s Salon` : "My Salon";
        found = {
          id: Date.now(),
          name: defaultBizName,
          email,
          phone: "+971 50 000 0000",
          role: "ROLE_BUSINESS_OWNER",
          picture,
        };
        mockState.users.push(found);
      }

      localStorage.setItem("howdy_token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify(found));
      localStorage.setItem("business", JSON.stringify(found));
      setUser(found);
      setBusiness(found);
      return withDelay(found);
    }

    const data = await authApi.loginWithGoogle({
      email,
      name,
      googleId,
      picture,
    });

    const userData = {
      id: data.business.id,
      name: data.business.name,
      email: data.business.email,
      role: data.business.role,
      avatar: picture,
    };

    localStorage.setItem("howdy_token", data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    await refreshBusiness();
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("howdy_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("business");
    setUser(null);
    setBusiness(null);
  };

  const hasToken = Boolean(
    localStorage.getItem("howdy_token") || localStorage.getItem("token")
  );
  const isAuthenticated = Boolean(user || hasToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        business: business || user,
        refreshBusiness,
        loading,
        initializing: loading,
        isAuthenticated,
        usingMock: USE_MOCK,
        register,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}