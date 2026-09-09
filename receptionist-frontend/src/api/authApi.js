import axiosClient from "./axiosClient";

export async function login({ email, password }) {
  const data = await axiosClient.post("/auth/login", { email, password });
  return {
    token: data.token,
    business: {
      id: data.businessId,
      name: data.businessName,
      email: data.email,
      role: data.role,
    },
  };
}

export async function register({ businessName, email, password, phone = "" }) {
  const data = await axiosClient.post("/auth/register", {
    businessName,
    email,
    password,
    phone,
  });

  return {
    token: data.token,
    business: {
      id: data.businessId,
      name: data.businessName,
      email: data.email,
      role: data.role,
    },
  };
}

export async function loginWithGoogle({ email, name, googleId, picture }) {
  const data = await axiosClient.post("/auth/google", {
    email,
    name,
    googleId,
    picture,
  });

  return {
    token: data.token,
    business: {
      id: data.businessId,
      name: data.businessName,
      email: data.email,
      role: data.role,
    },
  };
}