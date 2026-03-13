"use client";

import { createContext, useContext, useEffect, useState, ReactNode, } from "react";
import { getToken, setToken as saveToken, clearToken } from "@/lib/authToken";

/* Type Definition */

type User = {
    sub: string;
    email: string;
    name: string;
};

type AuthContextType = {
    isLoggedIn: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    user: User | null;
};

/* Create Context */

const AuthContext = createContext<AuthContextType | null>(null);

/* Provider */

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = getToken();

        if (token) {
            const payload = token.split(".")[1];
            const decoded = JSON.parse(atob(payload));
            setUser(decoded);
        }

        setIsLoggedIn(!!token);
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const login = (token: string): void => {
        saveToken(token);

        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);

        setIsLoggedIn(true);
        setIsAuthenticated(true);
    };

    const logout = (): void => {
        clearToken();
        setIsLoggedIn(false);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoggedIn, login, logout, loading, user }}>
            {children}
        </AuthContext.Provider>
    );
}

/* Hook */

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
