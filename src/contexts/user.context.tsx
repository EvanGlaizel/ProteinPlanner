import { createContext, useState } from 'react';
import { supabase } from '../lib/supabaseClient.ts'
import  validator from "validator";

type userContextType = {
    currentUser: User | null;
    signup: (name: string, email: string, password: string) => void;
    login: (name: string, password: string) => void;
    logout: () => void;
}

type EdgeFunctionResponse = {
    email?: string;
    error?: string;
}

type User = {
    name: string,
    email: string
};

type UserProps = { children: React.ReactNode };

export const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProps> = ( {children}) => 
{
    const [currentUser, setCurrentUser] = useState<null | User>(null)

    const signup = async (name: string, email: string, password: string): Promise<void> => 
    {
        const { data, error } = await supabase.auth.signUp({email, password})
        const newUserId = data?.user?.id;

        if (error || !newUserId)
        {
            console.error("Sign up error: ", error.message)
            return;
        }

        const { nameError } = await supabase.from("Usernames").insert({id: newUserId, username: name})

        if (nameError)
        {
            console.error("Error adding username to the database: ", nameError.message)
            return;
        }

        setCurrentUser({ name, email });
    }

    const login = async (name: string, password: string): Promise<void> => 
    {
        let email = "";
        let username = "";

        if (validator.isEmail(name))
        {
            //The user entered an email - Log them in with an email
            const { data, error } = await supabase.auth.signInWithPassword({ email: name, password});
            
            if (error || !data?.user)
            {
                console.error("Login error: ", error?.message || "No user returned")
                return;
            }

            email = data.user.email;

            //User has successfuly logged into their account with their email. Fetch their username from the database
            const id = data?.user?.id;
            const { data: usernameObj, error: usernameError } = await supabase.from("Usernames").select("username").eq("id", id).single();

            if (usernameError || !usernameObj)
            {
                console.error("Email login error: ", usernameError?.message);
                return;
            }

            username = usernameObj.username || ""
        }
        else
        {
            username = name;

            //Find the cooresponding email with their username to log them in
            const response = await fetch(import.meta.env.VITE_SUPABASE_FUNCTION_URL!, 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { username: name } )
                }
            );

            //Determine if there was an error
            if (!response.ok)
            {
                const errorText = await response.text();
                console.error("Login error: ", errorText);

                return;
            }

            //Log them in with the found email
            const { email: resolvedEmail }: EdgeFunctionResponse = await response.json();

            if (!resolvedEmail || !validator.isEmail(resolvedEmail))
            {
                console.error("Invalid email received from edge function");
                return;
            }

            const { loginData, loginError } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password});

            if (loginError || !loginData?.user)
            {
                console.error("Login error: ", loginError?.message || "No user returned");
                return;
            }

            //User has successfully logged into their account with their username
            email = loginData.user.email;
        }

        if (!username || !email)
        {
            console.error("Login failed: missing username or email");
            return;
        }

        setCurrentUser({ username, email });
    }

    const logout = () => 
    {
        setCurrentUser(null);
    }

    const contextValue: userContextType = 
    {
        currentUser,
        signup,
        login,
        logout
    }

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    )
}