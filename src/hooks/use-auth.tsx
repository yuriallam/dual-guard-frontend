import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  toggleAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: undefined,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = () => setUser(mockUser);
  const signOut = () => setUser(null);
  const toggleAuth = () => setUser(user ? null : mockUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        signIn,
        signOut,
        toggleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
