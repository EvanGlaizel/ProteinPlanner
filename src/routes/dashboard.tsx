import DailyMacroSummary from '../components/daily-macro-summary.tsx';
import MealSummary from '../components/meal-summary.tsx';
import QuickSettings from '../components/quick-settings.tsx'

const Dashboard = () => 
{
    return (
        <>
            <DailyMacroSummary/>
            <MealSummary/>
            <QuickSettings/>
        </>
    )
}

export default Dashboard;