import type { Meal } from '../contexts/user.context.tsx'
import { useState, useContext } from "react";
import { UserContext } from '../contexts/user.context.tsx'

type NewMealFormProps = {
    onClose: () => void,
    mealInfo?: Meal
}

const NewMealForm: React.FC<NewMealFormProps> = ({ onClose, mealInfo }) => 
{
    const { currentUser, addMealToDatabase, currentDate } = useContext(UserContext);

    const [ mealInput, setMealInput ] = useState<Meal>(mealInfo ? mealInfo : {
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    });

    const onSubmit = async (e: React.FormEvent): void =>
    {
        if (!currentUser) 
        {
            console.error("No user logged in");
            return;
        }

        e.preventDefault();

        const result = addMealToDatabase(mealInput, currentDate, currentUser.id);

        if (result)
        {
            onClose();
        }
        else
        {
            console.error("Error adding meal to database");
        }
        
        return;
    }

    const updateFormInput = (e: React.ChangeEvent<HTMLInputElement>): void => 
    {
        const { name, value } = e.target;

        if (name === "name")
        {
            setMealInput((prev) => 
            ({
                ...prev,
                [name]: value
            }))
        }
        else
        {
            setMealInput((prev) => 
            ({
                ...prev,
                [name]: Number(value)
            }))
        }

        
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5 backdrop-blur-sm p-4">
            <div className="bg-slate-800 text-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6">Add New Meal</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>Meal Name</label>
                        <input name="name" type="text" placeholder="ex: Dinner" value={mealInput.name} onChange={updateFormInput} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className='block text-sm font-medium text-gray-300 mb-2'>Calories</label>
                            <input name="calories" min="0" type="number" value={mealInput.calories} onChange={updateFormInput}required className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-300 mb-2'>Protein (g)</label>
                            <input name="protein" min="0" type="number" value={mealInput.protein} onChange={updateFormInput} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-300 mb-2'>Carbs (g)</label>
                            <input name="carbs" min="0" type="number" value={mealInput.carbs} onChange={updateFormInput} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-300 mb-2'>Fats (g)</label>
                            <input name="fats" min="0" type="number" value={mealInput.fats} onChange={updateFormInput} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                        </div>
                    </div>

                    <div className="flex gap-x-4 mt-6">
                        <button type="submit" className="flex-1 px-5 py-2 bg-slate-600 rounded-md hover:bg-slate-700 transition-colors font-semibold">Add Meal</button>
                        <button type="button" onClick={onClose} className="flex-1 px-5 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors font-semibold">Cancel</button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default NewMealForm;
