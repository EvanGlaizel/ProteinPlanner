import { createContext, useState } from 'react';

type userContextType = {
    currentUser: User | null;
    login: (id: number, name: string, email: string) => void;
    logout: () => void;
}

type User = {
    id: number,
    name: string,
    email: string
};

type UserProps = { children: React.ReactNode };

export const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProps> = ( {children}) => 
{
    const [currentUser, setCurrentUser] = useState<null | User>(null)

    const login = (id: number, name: string, email: string) => 
    {
        setCurrentUser({ id, name, email});
    }

    const logout = () => 
    {
        setCurrentUser(null);
    }

    const contextValue: userContextType = 
    {
        currentUser,
        login,
        logout
    }

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    )
}