type MacroSummaryType = {
    title: string,
    icon: React.ReactNode
    macro: number
}

const Macro: React.FC<MacroSummaryType> = ({ title, icon, macro }) => 
{
    
    return (
        <div>
            <h3>{title}</h3>
            {icon}
            <p>{`${macro}g`}</p>
        </div>
    )
}

export default Macro;