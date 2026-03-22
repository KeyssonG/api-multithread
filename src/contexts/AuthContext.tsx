import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export interface Module {
    nome: string;
    chave: string;
    rota: string;
    icone: string;
}

interface CustomJwtPayload {
    id: number;
    companyId: number;
    role?: string;
    department?: string;
    modules?: Module[];
    exp?: number;
}

type AuthContextType = {
    token: string | null;
    name: string | null;
    role: string | null;
    department: string | null;
    modules: Module[];
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
    const [role, setRole] = useState<string | null>(null);
    const [department, setDepartment] = useState<string | null>(null);
    const [modules, setModules] = useState<Module[]>([]);

    const decodeAndSetUser = (token: string) => {
        try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            setRole(decoded.role || null);
            setDepartment(decoded.department || null);
            setModules(decoded.modules || []);
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            setRole(null);
            setDepartment(null);
            setModules([]);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedName = localStorage.getItem('userName');
        if (storedToken) {
            setToken(storedToken);
            decodeAndSetUser(storedToken);
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
        decodeAndSetUser(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setToken(null);
        setName(null);
        setRole(null);
        setDepartment(null);
        setModules([]);
    };

    const value = {
        token,
        name,
        role,
        department,
        modules,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
