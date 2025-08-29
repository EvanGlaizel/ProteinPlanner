import { IoIosAdd } from "react-icons/io";

const NewMealButton = ({...otherProps}) => 
{
    return (
        <button {...otherProps} className="group bg-slate-800 rounded-lg shadow-lg p-6 flex items-center justify-center min-h-[280px] h-full border-2 border-dashed border-slate-600 hover:border-sky-500 hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500">
            <IoIosAdd className="text-7xl text-slate-500 group-hover:text-sky-500 transition-colors" />
        </button>
    )
}

export default NewMealButton;