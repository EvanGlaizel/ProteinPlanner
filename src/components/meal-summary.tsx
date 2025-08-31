import { useState, useContext } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import "react-day-picker/dist/style.css";

import { FaCalendarAlt } from "react-icons/fa";

import { UserContext } from "../contexts/user.context.tsx";

import Meal from './meal.tsx'
import type { Meal as MealType } from '../contexts/user.context.tsx'
import NewMealButton from './new-meal-button.tsx'
import NewMealForm from './new-meal-form.tsx'

const MealSummary = () => 
{
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showNewMealForm, setShowNewMealForm] = useState<boolean>(false);
    const [mealFormInfo, setMealFormInfo] = useState<MealType | null>(null);

    const { dailyMeals, fetchDailyMeals, currentUser, currentDate, setCurrentDate } = useContext(UserContext)!;

    const onClose = () => setShowNewMealForm(false);

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-auto bg-slate-700 m-5 rounded-xl min-h-[calc(100vh-420px)] ">
            
            <div className="relative mb-8 flex justify-between">

                <h2 className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-md text-5xl">{currentUser ? 'Meals' : 'Login to track meals'}</h2>

                <div className="relative">
                    <button className="flex items-center gap-x-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors" onClick={() => setShowDatePicker(!showDatePicker)}>
                        <FaCalendarAlt className="text-sky-400" />
                        {currentDate.toLocaleDateString()} 
                    </button> 
                
                    { showDatePicker &&  (
                        <div className="absolute top-full mt-2 right-0 z-20">
                            <DayPicker
                            mode="single"
                            selected={currentDate}
                            onSelect={(date) => {
                                setCurrentDate(date)
                                currentUser && fetchDailyMeals(date, currentUser.id);
                                setShowDatePicker(false);
                            }}
                            required
                            classNames={{
                                    months: "bg-[#1c1f26] p-4 rounded-lg shadow-lg text-white",
                                    caption: "text-center text-lg font-semibold text-white mb-2",
                                    caption_label: "w-full text-center",
                                    nav: "flex justify-between mb-2",
                                    head_row: "grid grid-cols-7 text-gray-400",
                                    head_cell: "flex items-center justify-center text-sm font-medium",
                                    row: "grid grid-cols-7",
                                    cell: "w-10 h-10 flex items-center justify-center",
                                    day_button: "w-10 h-10 flex items-center justify-center rounded-md cursor-pointer hover:bg-[#2d2f36]",
                                    day_selected: "bg-[#3bbef7] text-black font-bold",
                                    day_today: "border border-[#3bbef7]",
                                    day_outside: "text-gray-600 opacity-50",
                                }}
                            /> 
                        </div>
                    )}
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-6">

                {dailyMeals && dailyMeals.map((meal: MealType) => (
                    <Meal key={meal.id} meal={meal} onEdit={() => {
                        setMealFormInfo(meal);
                        setShowNewMealForm(true);
                    }}/>
                ))}

                {currentUser && <NewMealButton onClick={() => {
                    setMealFormInfo(null);
                    setShowNewMealForm(true);
                }}/>}

                { showNewMealForm && <NewMealForm onClose={onClose} mealInfo={mealFormInfo}/> }

            </div>

        </div>
    )
}

export default MealSummary;