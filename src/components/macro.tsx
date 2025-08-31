type MacroSummaryType = {
    title: string,
    icon: React.ReactNode
    macro: number
}

const Macro: React.FC<MacroSummaryType> = ({ title, icon, macro }) => 
{
    
    return (
        <div className="flex items-center gap-x-3">

            <div className="text-sky-300 text-3xl sm:text-6xl">
                {icon}
            </div>

            <div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-200">{title}</h3>
                <p className="text-md sm:text-xl font-semibold text-white">{`${macro}g`}</p>
            </div>
        </div>
    )
}

export default Macro;