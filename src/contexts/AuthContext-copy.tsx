// import { createContext, useContext, useState, ReactNode } from "react";

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoggedIn: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   signup: (name: string, email: string, password: string) => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // Simulate API call
//     if (email && password) {
//       setUser({
//         id: "1",
//         name: "User Name",
//         email: email
//       });
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const signup = async (name: string, email: string, password: string): Promise<boolean> => {
//     // Simulate API call
//     if (name && email && password) {
//       setUser({
//         id: "1",
//         name: name,
//         email: email
//       });
//       return true;
//     }
//     return false;
//   };

//   const value: AuthContextType = {
//     user,
//     isLoggedIn: !!user,
//     login,
//     logout,
//     signup
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;