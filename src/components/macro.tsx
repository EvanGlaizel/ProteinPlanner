type MacroSummaryType = {
    title: string,
    icon: React.ReactNode
    macro: number
}

const Macro: React.FC<MacroSummaryType> = ({ title, icon, macro }) => 
{
    
    return (
        <div className="flex items-center gap-x-3">

            <div className="text-sky-400 text-6xl">
                {icon}
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-200">{title}</h3>
                <p className="text-xl font-semibold text-white">{`${macro}g`}</p>
            </div>
        </div>
    )
}

export default Macro;