import { createContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient.ts'
import  validator from "validator";
import { useNavigate } from "react-router-dom";

import type { Session } from '@supabase/supabase-js';

type userContextType = {
    session: Session | null;
    currentUser: User | null;
    signup: (name: string, email: string, password: string) => void;
    login: (name: string, password: string) => void;
    logout: () => void;
    dailyMacros: DailyMacros;
    calorieGoal: number | null;
    setCalorieGoal: React.Dispatch<React.SetStateAction<number | null>>;
    dailyMeals: Meal[];
    fetchDailyMeals: (date: Date, id: string) => Promise<void>;
    addMealToDatabase: (meal: Meal, date: Date, userId: string) => Promise<boolean>;
    deleteMealFromDatabase: (meal: Meal) => Promise<boolean>;
    editMealInDatabase: (oldMeal: Meal, updatedMeal: Meal) => Promise<boolean>;
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
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
    id: string,
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
    const [session, setSession] = useState<Session | null>(null);
    const [currentUser, setCurrentUser] = useState<null | User>(null);
    const [calorieGoal, setCalorieGoal] = useState<number | null>(2500);
    const [dailyMeals, setDailyMeals] = useState<Meal[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    
    const navigate = useNavigate();

    //Ensure session is persisted on page reload
    useEffect(() => 
        {
            const currentSession = supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);

                if (session?.user)
                {
                    fetchUserProfile(session.user.id, session.user.email).then((user) => {
                        if (user) 
                        {
                            setCurrentUser(user);
                        }
                    });
                }
            });
    
            const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);

                if (session?.user)
                {
                    fetchUserProfile(session.user.id, session.user.email).then((user) => {
                        if (user)
                        {
                            setCurrentUser(user);
                        }
                    })
                }
                else
                {
                    setCurrentUser(null);
                }
            });
    
            return () => {
                listener?.subscription.unsubscribe();
            }
        }, [])

    //When the user or selected date changes, fetch their data
    useEffect(() =>
    {
        if (currentUser && currentUser.id)
        {
            //fetchDailyMacros(currentDate, currentUser.id);
            fetchDailyMeals(currentDate, currentUser.id);
        }
    }, [currentUser, currentDate]);

    
    const dailyMacros: DailyMacros = useMemo(() => ({
        calories: dailyMeals.reduce((acc, m) => acc + m.calories, 0),
        protein:  dailyMeals.reduce((acc, m) => acc + m.protein, 0),
        carbs:    dailyMeals.reduce((acc, m) => acc + m.carbs, 0),
        fats:     dailyMeals.reduce((acc, m) => acc + m.fats, 0),
    }), [dailyMeals]);

    const fetchUserProfile = async (id: string, email: string): Promise<User | null> =>
    {
        const { data, error } = await supabase.from("Usernames").select("username").eq("id", id).single();

        if (error || !data)
        {
            console.error("Error fetching user profile: ", error?.message || "No data returned");
            return null;
        }

        return { id: id, name: data.username, email: email };
    }

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
        navigate('/dashboard');
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
        navigate('/dashboard');
        return 'true';
    }

    // const fetchDailyMacros = async (date: Date, id: string): void =>
    // {
    //     if (!currentUser || !currentUser.id)
    //     {
    //         console.log("Error: User must be logged in to fetch daily macros")
    //         return;
    //     }

    //     let macros = { calories: 0, protein: 0, carbs: 0, fats: 0 };

    //     const { data, error } = await supabase.from("total_daily_macros").select("total_calories, total_protein, total_fat, total_carbs").eq("user_id", id).eq("day", date.toISOString().split('T')[0]).maybeSingle();

    //     if (error)
    //     {
    //         console.error("Error fetching daily macros: ", error.message);
    //         return;
    //     }

    //     if (data)
    //     {
    //         console.log("Fetched daily macros: ", data);
    //         macros.calories = data.total_calories;
    //         macros.protein = data.total_protein;
    //         macros.carbs = data.total_carbs;
    //         macros.fats = data.total_fat;
    //     }

    //     setDailyMacros(macros);
    // }

    //Query the database for the user's daily meals
    const fetchDailyMeals = async (date: Date, id:string) => 
    {
        if (!currentUser || !currentUser.id)
        {
            console.log("Error: User must be logged in to fetch meals")
            return;
        }

        const { data, error } = await supabase.from("macros").select("*").eq("user_id", id).eq("day", date.toISOString().split('T')[0]);

        if (error)
        {
            console.error("Error fetching daily meals: ", error.message);
            return null;
        }

        if (data)
        {
            setDailyMeals(data.map((meal: Meal) => ({
            id: meal.meal_id,
            name: meal.meal_name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fat
            })));
        }
        else
        {
            console.log("No meals found for the selected date");
            setDailyMeals([]);
        }
    }

    const addMealToDatabase = async(meal: Meal, date: Date, userId: string): Promise<boolean> =>
    {
        
        if (!currentUser || !currentUser.id)
        {
            console.log("Error: User must be logged in to add a meal")
            return false;
        }

        if (!date || !meal || !meal.name || meal.calories < 0 || meal.protein < 0 || meal.carbs < 0 || meal.fats < 0)
        {
            console.error("Error: Invalid meal or date");
            return false;
        }

        const { data, error } = await supabase.from("macros").insert( [{
            user_id: currentUser.id,
            meal_name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fats,
            day: date.toISOString().split('T')[0]
        }] ).select();
        console.log(data);

        if (error || !data)
        {
            console.error("Error adding meal to database: ", error?.message || "No data returned");
            return false;
        }

        //Also add the meal to the local state
        setDailyMeals((prevMeals) => [...prevMeals, { ...meal, id: data[0].meal_id }]);

        // setDailyMacros((prevMacros) => ({
        //     calories: prevMacros.calories + meal.calories,
        //     protein: prevMacros.protein + meal.protein,
        //     carbs: prevMacros.carbs + meal.carbs,
        //     fats: prevMacros.fats + meal.fats })
        // );

        return true;
    }

    const deleteMealFromDatabase = async(meal: Meal): Promise<boolean> => 
    {
        const { error } = await supabase.from("macros").delete().eq("meal_id", meal.id);

        if (error)
        {
            console.error("Error deleting meal from database: ", error.message)
            return false;
        }

        setDailyMeals( dailyMeals.filter(curMeal => curMeal.id !== meal.id) );

        // setDailyMacros((prevMacros) => ({
        //     calories: prevMacros.calories - meal.calories,
        //     protein: prevMacros.protein - meal.protein,
        //     carbs: prevMacros.carbs - meal.carbs,
        //     fats: prevMacros.fats - meal.fats })
        // );

        return true;
    }

    const editMealInDatabase = async(oldMeal: Meal, updatedMeal: Meal): Promise<boolean> =>
    {
        const { error } = await supabase.from("macros").update( { 
            meal_name: updatedMeal.name, 
            calories: updatedMeal.calories,
            protein: updatedMeal.protein,
            carbs: updatedMeal.carbs,
            fat: updatedMeal.fats })
            .eq("meal_id", oldMeal.id);

        if (error)
        {
            console.error("Error editing meal: ", error.message);
            return false;
        }

        setDailyMeals( prevMeals => 
            prevMeals.map(meal => meal.id === oldMeal.id ? {...updatedMeal, id: oldMeal.id} : meal)
        );

        return true;

        // setDailyMacros((prevMacros) => ({
        //     calories: prevMacros.calories + updatedMeal.calories - oldMeal.calories,
        //     protein: prevMacros.protein + updatedMeal.protein - oldMeal.protein,
        //     carbs: prevMacros.carbs  + updatedMeal.carbs - oldMeal.carbs,
        //     fats: prevMacros.fats  + updatedMeal.fats - oldMeal.fats,  })
        // );
    }

    const logout = async () => 
    {
        await supabase.auth.signOut();
        navigate('/login');
        setCurrentUser(null);
        setDailyMeals([]);
    }

    const contextValue: userContextType = 
    {
        currentUser,
        signup,
        login,
        logout,
        dailyMacros,
        calorieGoal,
        setCalorieGoal,
        dailyMeals,
        fetchDailyMeals,
        addMealToDatabase,
        deleteMealFromDatabase,
        editMealInDatabase,
        currentDate,
        setCurrentDate
    }

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    )
}