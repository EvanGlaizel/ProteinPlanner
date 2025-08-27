import type { Meal } from '../contexts/user.context.tsx'

type MealType = {
    meal: Meal
}

const Meal: React.FC<MealType> = ({ meal }) =>
{
    return (
        <div>
            <h2>{meal.name}</h2>
            <p>{`Calories: ${meal.calories}`}</p>
            <p>{`Protein: ${meal.protein}g`}</p>
            <p>{`Carbs: ${meal.carbs}g`}</p>
            <p>{`Fat: ${meal.fats}g`}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    )
}

export default Meal;