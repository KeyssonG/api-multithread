import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import axios from "axios";

const decodeJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
        return null;
    }
};

const isTokenValid = (token: string) => {
    const payload = decodeJwt(token);
    if (!payload) return false;
    if (!payload.exp) return true;
    return payload.exp * 1000 > Date.now();
};

type AuthContextType = {
    token: string | null;
    name: string | null;
    modules: string[];
    isAuthenticated: boolean;
    login: (token: string, name: string) => void;
    logout: () => void;
    hasAccess: (module: string) => boolean;
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
    const [modules, setModules] = useState<string[]>([]);

    const hasAccess = (moduleName: string) => {
        return modules.includes(moduleName);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setToken(null);
        setName(null);
        setModules([]);
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedName = localStorage.getItem('userName');
        
        if (storedToken) {
            if (isTokenValid(storedToken)) {
                setToken(storedToken);
                if (storedName) {
                    setName(storedName);
                }
                const payload = decodeJwt(storedToken);
                if (payload?.modules) {
                    setModules(payload.modules);
                }
            } else {
                logout();
            }
        }

        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (newToken: string, newName: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userName', newName);
        setToken(newToken);
        setName(newName);
        const payload = decodeJwt(newToken);
        if (payload?.modules) {
            setModules(payload.modules);
        } else {
            setModules([]);
        }
    };

    // logout function moved above useEffect

    const value = {
        token,
        name,
        modules,
        isAuthenticated: !!token,
        login,
        logout,
        hasAccess,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};