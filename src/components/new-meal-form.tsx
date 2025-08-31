import type { Meal } from '../contexts/user.context.tsx'
import { useState, useContext } from "react";
import { UserContext } from '../contexts/user.context.tsx'

import { supabase } from '../lib/supabaseClient.ts'

type NewMealFormProps = {
    onClose: () => void,
    mealInfo: Meal | null
}

const NewMealForm: React.FC<NewMealFormProps> = ({ onClose, mealInfo }) => 
{
    const { currentUser, addMealToDatabase, editMealInDatabase, currentDate } = useContext(UserContext)!;

    const [ mealInput, setMealInput ] = useState<Meal>(mealInfo ? mealInfo : {
        id: '',
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    });

    const [aiInput, setAiInput] = useState<string>('');
    const [ isLoading, setIsLoading ] = useState<boolean>(false);


    const onSubmit = async (e: React.FormEvent): Promise<void> =>
    {
        if (!currentUser) 
        {
            console.error("No user logged in");
            return;
        }

        e.preventDefault();

        const result = mealInfo ? await editMealInDatabase(mealInfo, mealInput) : await addMealToDatabase(mealInput, currentDate);

        if (result === true)
        {
            onClose();
        }
        else
        {
            console.error(mealInfo ? "Error editing meal" : "Error adding meal");
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

    const onAISubmit = async (e: React.FormEvent): Promise<void> =>
    {
        if (!currentUser) 
        {
            console.error("No user logged in");
            return;
        }

        e.preventDefault();

        setIsLoading(true);

        const prompt = `Provide a JSON object with the estimated calories, protein (in grams), carbs (in grams), and fats (in grams) for the following meal description. If you cannot estimate a value, return 0 for that field. Also give the meal a fitting name.  Respond only with the JSON object and nothing else. The json object should have the following format: { "meal_name": string, "calories": number, "protein": number, "carbs": number, "fats": number }. Meal description: ${aiInput}`

        try 
        {

            const { data, error } = await supabase.functions.invoke('ai-calorie-estimation', { body: { prompt } } );

            if (error)
            {
                throw new Error(error.message);
            }

            console.log("AI Response: ", data);

            setMealInput( { 
                id: '',
                name: data?.reply.meal_name || 'Meal',
                calories: data?.reply.calories || 0,
                protein: data?.reply.protein || 0,
                carbs: data?.reply.carbs || 0,
                fats: data?.reply.fats || 0
            } );
            setAiInput('AI successfully responded! Edit the meal info if needed, then click "Add Meal"');
            
        } catch (err: any) 
        {
            console.error("Error fetching AI data: ", err?.message || "Error");
        }

        setIsLoading(false);
        return;    
    }

    const updateAIFormInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => 
    {
        const { value } = e.target;

        setAiInput(value);
    }

    return (
        <div className="fixed inset-0 z-50 flex md:flex-row sm:flex-col items-center md:justify-center  backdrop-blur-3xl p-4 sm:overflow-auto sm:items-start md:items-center">
            <div className="bg-slate-800 text-white p-8 rounded-lg shadow-2xl w-full max-w-md m-10 border-gray-600 border-2">
                <h2 className="text-3xl font-bold mb-6">{mealInfo ? 'Edit Meal' : 'Add New Meal'}</h2>
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
                        <button type="submit" className="flex-1 px-5 py-2 bg-slate-600 rounded-md hover:bg-slate-700 transition-colors font-semibold">{mealInfo ? 'Confirm Edit' : 'Add Meal'}</button>
                        <button type="button" onClick={onClose} className="flex-1 px-5 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors font-semibold">Cancel</button>
                    </div>
                    
                </form>
            </div>

            <div className="bg-slate-800 text-white p-8 rounded-lg shadow-2xl w-full max-w-md m-10 border-gray-600 border-2">
                <h2 className="text-3xl font-bold mb-6">Estimate Macros With AI</h2>
                <form onSubmit={onAISubmit} className="flex flex-col gap-y-4">
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>Describe your meal. The more descriptive you are, the more accurate the calories</label>
                        <textarea name="prompt" placeholder="ex: McDonalds Big Mac with 2 mandarin oranges, and a medium-sized banana" value={aiInput} onChange={updateAIFormInput} rows={10} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                    </div>

                    <div className="flex gap-x-4 mt-6">
                        <button type="submit" className="flex-1 px-5 py-2 bg-slate-600 rounded-md hover:bg-slate-700 transition-colors font-semibold">{isLoading ? "Loading..." : "Ask AI"}</button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default NewMealForm;
