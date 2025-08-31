import { useContext } from 'react';
import { UserContext } from '../contexts/user.context.tsx';

import type { Meal as MealData } from '../contexts/user.context.tsx'

type MealType = {
    meal: MealData,
    onEdit: () => void
}

const Meal: React.FC<MealType> = ({ meal, onEdit }) =>
{
    const { deleteMealFromDatabase } = useContext(UserContext)!;

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col h-full text-gray-300">
            <h2 className="text-2xl font-bold text-white mb-4 overflow-auto">{meal.name}</h2>
            
            <div className="space-y-2 mb-6">
                <p><span className="font-semibold text-white">{`Calories: ${meal.calories}`}</span></p>
                <p><span className="font-semibold text-white">{`Protein: ${meal.protein}g`}</span></p>
                <p><span className="font-semibold text-white">{`Carbs: ${meal.carbs}g`}</span></p>
                <p><span className="font-semibold text-white">{`Fat: ${meal.fats}g`}</span></p>
            </div>

            <div className="mt-auto flex gap-x-4">
                <button onClick={onEdit} className="w-full text-center bg-slate-600 hover:bg-slate-700 transition-colors text-white font-bold py-2 px-4 rounded-md">Edit</button>
                <button onClick={() => deleteMealFromDatabase(meal)} className="w-full text-center bg-red-600 hover:bg-red-700 transition-colors text-white font-bold py-2 px-4 rounded-md">Delete</button>
            </div>
        </div>
    )
}

export default Meal;