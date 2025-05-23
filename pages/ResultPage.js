import { useRouter } from "next/router";
import { fetchAPI } from "./components/fetchAPI";
import { useState, useEffect} from "react";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Reusable handler functions
const useDishActions = (router) => {
  const handleViewNutrition = (id, title, image) => {
    router.push(`/NutrientPage?id=${id}&title=${title}&image=${image}`);
  };

  const handleViewRecipe = (id, title, image) => {
    router.push(`/InstructionPage?id=${id}&title=${title}&image=${image}`);
  };

  const handleSaveDish = (dishId, dishTitle, dishImage) => {
    let savedDishes = JSON.parse(localStorage.getItem("favoriteDishes")) || [];
    const exists = savedDishes.some((dish) => dish.dish_id === dishId);
    if (!exists) {
      const newDish = {
        id: Date.now(),
        dish_id: dishId,
        dish_title: dishTitle,
        dish_image: dishImage
      };
      savedDishes.push(newDish);
      console.log(savedDishes);
      localStorage.setItem("favoriteDishes", JSON.stringify(savedDishes));
    }
  };

  return { handleViewNutrition, handleViewRecipe, handleSaveDish };
};

// Reusable DishCard component
const DishCard = ({ dish, onViewNutrition, onViewRecipe, onSaveDish }) => (
    <div key={dish.id}>
        <div>
            <img src={dish.image} alt={dish.title} style={{ width: "200px" }} />
        </div>
        <div>
            <h3>{dish.title}</h3>
        </div>
        <div>
            <button onClick={() => onViewNutrition(dish.id, dish.title, dish.image)}>View Nutrition</button>
            <button onClick={() => onViewRecipe(dish.id, dish.title, dish.image)}>View Instruction</button>
            <button onClick={() => onSaveDish(dish.id, dish.title, dish.image)}>Save Dish</button>
        </div><br /><br />
    </div>
);

function GetRandomDish() {
    const router = useRouter();
    const { time } = router.query;
    const { handleViewNutrition, handleViewRecipe, handleSaveDish } = useDishActions(router);
  
    // Store time param inside random url to bypass cached check when user clicks "Get Random Dish".
    const RANDOM_API_URL = time ? `${BASE_URL}/random?apiKey=${API_KEY}&number=1&time=${time}` : null;
   
    const { data, loading, error } = fetchAPI(RANDOM_API_URL);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  
    const dish = data?.recipes?.[0];

    if (dish.length === 0) {
        return <p>No dish found.</p>;
    }
  
    return (
        <DishCard
            dish={dish}
            onViewNutrition={handleViewNutrition}
            onViewRecipe={handleViewRecipe}
            onSaveDish={handleSaveDish}
        />
    );
  }
  
function GetCustomDish() {
    const router = useRouter();
    const { mealType, includeIngredients, excludeIngredients } = router.query;
    const { handleViewNutrition, handleViewRecipe, handleSaveDish } = useDishActions(router);

    const paramsReady = mealType && includeIngredients;

    // Check if input params are ready before forming URL
    const CUSTOMIZED_API_URL = paramsReady ? `${BASE_URL}/complexSearch?apiKey=${API_KEY}&type=${mealType}&includeIngredients=${includeIngredients}&excludeIngredients=${excludeIngredients}&number=5` : null;
    const { data, loading, error } = fetchAPI(CUSTOMIZED_API_URL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const dishes = data?.results || [];

    if (dishes.length === 0) {
        return <p>No dish found.</p>;
    }

    return (
        <div>
            {dishes.map((dish) => (
                <DishCard
                    key={dish.id}
                    dish={dish}
                    onViewNutrition={handleViewNutrition}
                    onViewRecipe={handleViewRecipe}
                    onSaveDish={handleSaveDish}
                />
            ))}
        </div>
    );
}

export default function ResultPage() {
  const router = useRouter();
  const { type } = router.query;
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (type === "random") {
      setContent(<GetRandomDish />);
    } else if (type === "custom") {
      setContent(<GetCustomDish />);
    }
  }, [type]);

  return (
    <div>
        <div>
            <button onClick={() => router.push("/HomePage")}>Home</button>
            <button onClick={() => router.push("/FavoriteDishesPage")}>Favorite Dishes</button>
        </div>
        <br /><br />
        <div>{content}</div>
    </div>
  );
}