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
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-gray-600 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Add New Meal</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
                    <div>
                        <label className='block text-white font-medium mb-2'>Meal Name</label>
                        <input name="name" type="text" placeholder="ex: Dinner" value={mealInput.name} onChange={updateFormInput} className="p-2 border border-gray-800 rounded"/>
                    </div>
                    
                    <div>
                        <label className='block text-white font-medium mb-2'>Calories</label>
                        <input name="calories" min="0" type="number" value={mealInput.calories} onChange={updateFormInput}required className="p-2 border border-gray-800 rounded"/>
                    </div>
                    <div>
                        <label className='block text-white font-medium mb-2'>Protein (g)</label>
                        <input name="protein" min="0" type="number" value={mealInput.protein} onChange={updateFormInput} className="p-2 border border-gray-800 rounded"/>
                    </div>
                    <div>
                        <label className='block text-white font-medium mb-2'>Carbs (g)</label>
                        <input name="carbs" min="0" type="number" value={mealInput.carbs} onChange={updateFormInput} className="p-2 border border-gray-800 rounded"/>
                    </div>
                    <div>
                        <label className='block text-white font-medium mb-2'>Fats (g)</label>
                        <input name="fats" min="0" type="number" value={mealInput.fats} onChange={updateFormInput} className="p-2 border border-gray-800 rounded"/>
                    </div>

                    <div className="flex justify-around gap-x-4">
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Meal</button>
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewMealForm;
