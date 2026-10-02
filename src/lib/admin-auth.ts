import { useEffect, useState } from "react";
import { rtdb } from "./firebase";
import { ref, onValue, set } from "firebase/database";

export interface AdminCredentials {
  email: string;
  passwordHash: string; // Stored securely
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: "admin@ishoots.com",
  passwordHash: "Admin@123", // Matches user requirement: admin@ishoots.com / Admin@123
};

const AUTH_STORAGE_KEY = "ishoots_admin_credentials_v1";
const SESSION_STORAGE_KEY = "ishoots_admin_session_active";

export function useAdminAuth() {
  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          // ignore error
        }
      }
    }
    return DEFAULT_ADMIN_CREDENTIALS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    }
    return false;
  });

  useEffect(() => {
    const handleAuthChange = (e: any) => {
      setIsAuthenticated(Boolean(e.detail));
    };
    if (typeof window !== "undefined") {
      window.addEventListener("admin_auth_change", handleAuthChange);
    }

    try {
      const credsRef = ref(rtdb, "admin_credentials");
      const unsubscribe = onValue(credsRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          setCredentials(val);
          if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(val));
          }
        } else {
          set(credsRef, DEFAULT_ADMIN_CREDENTIALS).catch(() => {});
        }
      });
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("admin_auth_change", handleAuthChange);
        }
        unsubscribe();
      };
    } catch (err) {
      if (typeof window !== "undefined") {
        window.removeEventListener("admin_auth_change", handleAuthChange);
      }
    }
  }, []);

  const login = (emailInput: string, passwordInput: string): boolean => {
    if (
      emailInput.trim().toLowerCase() === credentials.email.toLowerCase() &&
      passwordInput === credentials.passwordHash
    ) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
        localStorage.setItem(SESSION_STORAGE_KEY, "true");
        window.dispatchEvent(new CustomEvent("admin_auth_change", { detail: true }));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("admin_auth_change", { detail: false }));
      window.location.replace("/admin");
    }
  };

  const updateCredentials = async (newEmail: string, newPassword: string): Promise<void> => {
    const updated: AdminCredentials = {
      email: newEmail.trim(),
      passwordHash: newPassword,
    };
    setCredentials(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
    try {
      const credsRef = ref(rtdb, "admin_credentials");
      await set(credsRef, updated);
    } catch (err) {
      console.warn("RTDB credentials update fallback:", err);
    }
  };

  return {
    credentials,
    isAuthenticated,
    login,
    logout,
    updateCredentials,
  };
}
