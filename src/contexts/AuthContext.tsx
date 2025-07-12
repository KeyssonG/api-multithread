import { createContext, useState, useEffect, useContext, type ReactNode } from "react";

type AuthContextType = {
    token: string | null;
    name: string | null;
    isAuthenticated: boolean;
    login: (token: string, name: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};


type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedName = localStorage.getItem('userName');
        if (storedToken) {
            setToken(storedToken);
        }

        if (storedName) {
            setName(storedName);
        }
    }, []);

    const login = (newToken: string, newName: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userName', newName);
        setToken(newToken);
        setName(newName);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setToken(null);
        setName(null);
    };

    const value = {
        token,
        name,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};