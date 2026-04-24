import { useCallback, useEffect, useState } from "react";

const AUTH_KEY = "eduvisitas:auth";

interface AuthUser {
  username: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setLoaded(true);
  }, []);

  const login = useCallback((username: string, password: string) => {
    // Demo credentials
    if (username === "admin" && password === "admin123") {
      const u = { username, name: "Recepción Central" };
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
      setUser(u);
      return { ok: true as const };
    }
    return { ok: false as const, error: "Usuario o contraseña incorrectos" };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, login, logout, loaded };
}
