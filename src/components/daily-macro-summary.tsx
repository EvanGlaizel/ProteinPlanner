import Macro from './macro.tsx'

import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../contexts/user.context.tsx';

import { GiButter } from "react-icons/gi";
import { TbMeat } from "react-icons/tb";
import { CiWheat } from "react-icons/ci";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DailyMacroSummary = () => 
{
    const { dailyMacros, calorieGoal } = useContext(UserContext)!;
    const [caloriePercentage, setCaloriePercentage] = useState<number>(0);

    useEffect(() => {

        if (calorieGoal != null && dailyMacros.calories != null && calorieGoal > 0) 
        {
            setCaloriePercentage(Math.round((dailyMacros.calories / calorieGoal) * 100));
        }
        

    }, [dailyMacros.calories, calorieGoal]);

    return (
        <div className="w-full bg-slate-800 text-gray-200 pl-0 lg:p-5 rounded-lg shadow-xl flex items-center justify-start lg:justify-between py-8">

            <h1 className="!text-6xl lg:!text-8xl font-bold text-white mx-5 lg:mx-20">Protein Planner</h1>

            <div className="flex flex-row items-center justify-between">
                <div className="flex items-start xl:items-center xl:gap-x-10 md:gap-4 flex-col  xl:flex-row">
                    <Macro title="Protein" icon={<TbMeat/>} macro={dailyMacros.protein} />
                    <Macro title="Fat" icon={<GiButter/>} macro={dailyMacros.fats} />
                    <Macro title="Carbs" icon={<CiWheat/>} macro={dailyMacros.carbs} />
                </div>

                <div className="h-30 w-30 md:w-50 md:h-50 mx-5 md:mx-10 mb-5 relative">
                        <CircularProgressbar value={caloriePercentage} text={`${dailyMacros.calories}`} styles={buildStyles({ strokeLinecap: 'round', textSize: '28px', textColor: '#FFFFFF', pathColor: '#38bdf8', trailColor: '#e5e7eb', pathTransitionDuration: 1.5})} />

                        <h2 className="absolute text-xl text-white right-[65px] top-[124px] invisible md:visible">Calories</h2>
                    
                    <p className="text-center text-m text-gray-300 tracking-wider uppercase mt-3">{`Goal: ${calorieGoal} kcals`}</p>
                </div>
            </div>
            
        </div>
    )
}

export default DailyMacroSummary;