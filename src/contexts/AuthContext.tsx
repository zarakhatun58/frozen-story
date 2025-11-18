import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Permission {
  view: boolean;
  edit: boolean;
  delete: boolean;
  admin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  permissions: Permission;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
  'admin@perceive.now': { id: '1', email: 'admin@perceive.now', role: 'admin', name: 'Admin User' },
  'analyst@perceive.now': { id: '2', email: 'analyst@perceive.now', role: 'analyst', name: 'Analyst User' },
  'viewer@perceive.now': { id: '3', email: 'viewer@perceive.now', role: 'viewer', name: 'Viewer User' },
};

const getPermissions = (role: UserRole): Permission => {
  switch (role) {
    case 'admin':
      return { view: true, edit: true, delete: true, admin: true };
    case 'analyst':
      return { view: true, edit: true, delete: false, admin: false };
    case 'viewer':
      return { view: true, edit: false, delete: false, admin: false };
    default:
      return { view: false, edit: false, delete: false, admin: false };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('perceive_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS[email];
    if (!user) {
      throw new Error('Invalid credentials');
    }

    setUser(user);
    localStorage.setItem('perceive_user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('perceive_user');
  };

  const permissions = user ? getPermissions(user.role) : { view: false, edit: false, delete: false, admin: false };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        permissions,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
