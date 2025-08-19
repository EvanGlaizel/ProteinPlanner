import Macro from './macro.tsx'

import { useEffect, useContext } from 'react';
import { UserContext } from '../contexts/user.context.tsx';

const DailyMacroSummary = () => 
{
    const { dailyMacros } = useContext(UserContext);

    return (
        <div>
            <h1>Protein Planner</h1>

            <div>
                <Macro title="Protein" icon={<h1>TEST ICON</h1>} macro={dailyMacros.protein} />
                <Macro title="Fat" icon={<h1>TEST ICON</h1>} macro={dailyMacros.fetchDailyMacros} />
                <Macro title="Carbs" icon={<h1>TEST ICON</h1>} macro={dailyMacros.carbs} />
            </div>

            <div>
                <h2>Calories</h2>
                <p>{dailyMacros.calories}</p>
            </div>
        </div>
    )
}

export default DailyMacroSummary;