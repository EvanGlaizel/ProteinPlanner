import { createContext, useState } from 'react';
import { supabase } from '../lib/supabaseClient.ts'
import  validator from "validator";

type userContextType = {
    currentUser: User | null;
    signup: (name: string, email: string, password: string) => void;
    login: (name: string, password: string) => void;
    logout: () => void;
    dailyMacros: DailyMacros;
    setDailyMacros: React.Dispatch<React.SetStateAction<DailyMacros>>;
    calorieGoal: number | null;
    setCalorieGoal: React.Dispatch<React.SetStateAction<number | null>>;
    dailyMeals: Meal[];
    fetchDailyMeals: (date: Date, id: string) => Promise<void>;
}

type EdgeFunctionResponse = {
    email?: string;
    error?: string;
}

type User = {
    id: string,
    name: string,
    email: string
};

export type Meal = {
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fats: number
}

type DailyMacros = {
    calories: number,
    protein: number,
    carbs: number,
    fats: number
}

type UserProps = { children: React.ReactNode };

export const UserContext = createContext<userContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProps> = ( {children}) => 
{
    const [currentUser, setCurrentUser] = useState<null | User>(null)
    const [dailyMacros, setDailyMacros] = useState<DailyMacros>({calories: 0, protein: 0, carbs: 0, fats: 0})
    const [calorieGoal, setCalorieGoal] = useState<number | null>(2500);

    const signup = async (name: string, email: string, password: string): Promise<boolean> => 
    {

        const { data, error } = await supabase.auth.signUp({email: email, password: password});
        const newUserId = data?.user?.id;

        if (error || !newUserId)
        {
            console.error("Sign up error: ", error.message)
            return false;
        }

        const { nameError } = await supabase.from("Usernames").insert({id: newUserId, username: name})

        if (nameError)
        {
            console.error("Error adding username to the database: ", nameError.message)
            return false;
        }

        setCurrentUser({ id:newUserId, name, email });
        return true;
    }

    const login = async (name: string, password: string): Promise<string> => 
    {
        let email = "";
        let username = "";
        let id = "";

        if (validator.isEmail(name))
        {
            //The user entered an email - Log them in with an email
            const { data, error } = await supabase.auth.signInWithPassword({ email: name, password});

            if (error || !data?.user)
            {
                console.error("Login error: ", error?.message || "No user returned")

                return error?.message || "Could not login. Please try again later";
            }

            email = data.user.email;

            //User has successfuly logged into their account with their email. Fetch their username from the database
            id = data?.user?.id;
            const { data: usernameObj, error: usernameError } = await supabase.from("Usernames").select("username").eq("id", id).single();

            if (usernameError || !usernameObj)
            {
                console.error("Email login error: ", usernameError?.message);
                return 'false';
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

                if (response.status === 404)
                {
                    return "Invalid Login Credentials";
                }

                return String(JSON.parse(errorText).error);
            }

            //Log them in with the found email
            const { email: resolvedEmail }: EdgeFunctionResponse = await response.json();

            if (!resolvedEmail || !validator.isEmail(resolvedEmail))
            {
                console.error("Invalid email received from edge function");
                return 'false';
            }

            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password});
 
            //Check if the login was successful
            if (loginError || !loginData?.user)
            {
                console.error("Login error: ", loginError?.message || "No user returned");
                return 'false';
            }

            //User has successfully logged into their account with their username
            id = loginData.user.id;
            email = loginData.user.email;
        }

        if (!username || !email)
        {
            console.error("Login failed: missing username or email");
            return 'Invalid Login Credentials';
        }

        setCurrentUser({ username, email, id });
        fetchDailyMacros(id);
        fetchDailyMeals(new Date(), id);
        return 'true';
    }

    const fetchDailyMacros = async (id: string): void =>
    {
        let macros = { calories: 0, protein: 0, carbs: 0, fats: 0 };

        const { data, error } = await supabase.from("total_daily_macros").select("total_calories, total_protein, total_fat, total_carbs").eq("user_id", id).single();

        if (error || !data)
        {
            console.error("Error fetching daily macros: ", error?.message || "No data returned");
            return;
        }

        macros.calories = data.total_calories || 0;
        macros.protein = data.total_protein || 0;
        macros.carbs = data.total_carbs || 0;
        macros.fats = data.total_fat || 0;

        setDailyMacros(macros);
    }

    //Query the database for the user's daily meals
    const fetchDailyMeals = async (date: Date, id:string) => 
    {
        const { data, error } = await supabase.from("macros").select("*").eq("user_id", id).eq("day", date.toISOString().split('T')[0]);

        if (error || !data)
        {
            console.error("Error fetching daily meals: ", error?.message || "No data returned");
            return null;
        }

        setDailyMeals(data.map((meal: any) => ({
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats
        })));
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
        logout,
        dailyMacros,
        setDailyMacros,
        calorieGoal,
        setCalorieGoal,
        dailyMeals: [],
        fetchDailyMeals
    }

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    )
}