import React, { useState } from "react";
import { useRouter } from "next/router";

function GetUserInput() {
    const router = useRouter();
    
    // States for meal type
    const [mealType, setMealType] = useState("");

    // States for ingredients lists
    const [includeIngredients, setIncludeIngredients] = useState([]);
    const [excludeIngredients, setExcludeIngredients] = useState([]);
    const [tempInclude, setTempInclude] = useState("");
    const [tempExclude, setTempExclude] = useState("");

    // Handle adding and removing ingredients
    const addIngredient = (type) => {
        if (type === "include" && tempInclude.trim()) {
            setIncludeIngredients([...includeIngredients, tempInclude.trim()]);
            setTempInclude("");
        } else if (type === "exclude" && tempExclude.trim()) {
            setExcludeIngredients([...excludeIngredients, tempExclude.trim()]);
            setTempExclude("");
        }
    };

    const removeIngredient = (type, index) => {
        if (type === "include") {
            setIncludeIngredients(includeIngredients.filter((_, i) => i !== index));
        } else if (type === "exclude") {
            setExcludeIngredients(excludeIngredients.filter((_, i) => i !== index));
        }
    };

    // Handle form submission
    const handleCustomOption = () => {
        if (!mealType|| includeIngredients.length === 0 ) {
            alert("Please fill out all fields.");
            return;
        }

        router.push(`/ResultPage?type=custom&mealType=${mealType}&includeIngredients=${includeIngredients.join(",")}&excludeIngredients=${excludeIngredients.join(",")}`);
    };

    return (
        <div>
            <nav >
               <button onClick={() => router.push("/")}>Home</button>
                <button onClick={() => router.push("/FavoriteDishesPage")}>Favorite Dishes</button>
            </nav>
            <h1>Customize Your Dish!</h1>
            {/* Meal Type Selection */}
            <div>
                <label>
                    Meal Type:
                    <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                        <option value="">Select Meal Type</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Drink">Drink</option>
                    </select>
                </label>
            </div><br />

            {/* Included Ingredients */}
            <div>
                <label>Included Ingredients:</label>
                <input
                    type="text"
                    value={tempInclude}
                    onChange={(e) => setTempInclude(e.target.value)}
                />
                <button onClick={() => addIngredient("include")}>Add</button>
                <ul>
                    {includeIngredients.map((item, index) => (
                        <li key={index}>
                            {item} <button onClick={() => removeIngredient("include", index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Excluded Ingredients */}
            <div>
                <label>Excluded Ingredients (optional):</label>
                <input
                    type="text"
                    value={tempExclude}
                    onChange={(e) => setTempExclude(e.target.value)}
                />
                <button onClick={() => addIngredient("exclude")}>Add</button>
                <ul>
                    {excludeIngredients.map((item, index) => (
                        <li key={index}>
                            {item} <button onClick={() => removeIngredient("exclude", index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Submit Button */}
            <button onClick={handleCustomOption}>Generate Dishes</button>
        </div>
    );
}

export default GetUserInput;