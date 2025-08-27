import { useState, useContext } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { UserContext } from "../contexts/user.context.tsx";

import Meal from './meal.tsx'
import NewMealButton from './new-meal-button.tsx'
import NewMealForm from './new-meal-form.tsx'

const MealSummary = () => 
{
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showNewMealForm, setShowNewMealForm] = useState<boolean>(false);

    const { dailyMeals, fetchDailyMeals, currentUser, currentDate, setCurrentDate } = useContext(UserContext);

    const onClose = () => setShowNewMealForm(false);

    return (
        <div className="flex flex-col justify-center items-center gap-y-4 p-4 bg-gray-800 rounded-lg">
            
                <button className="text-white hover:text-sky-200" onClick={() => setShowDatePicker(!showDatePicker)}>
                    {currentDate.toLocaleDateString()} 
                </button> 
            
            { showDatePicker &&  <DayPicker
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => {
                        setCurrentDate(date)
                        currentUser && fetchDailyMeals(date, currentUser.id);
                        setShowDatePicker(false);
                    }}
                    required
                  /> 
            }

            <div>
                {dailyMeals && dailyMeals.map((meal, key) => (
                    <Meal key={key} meal={meal}/>
                ))}

                <NewMealButton onClick={() => setShowNewMealForm(true)}/>

                { showNewMealForm && <NewMealForm onClose={onClose}/> }

            </div>

        </div>
    )
}

export default MealSummary;