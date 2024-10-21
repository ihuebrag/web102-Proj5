import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    diet: '',
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
              apiKey: '9ae4e0a2c72f4ef585b8ff9fa9bfc107',
              number: 50,
            }
          }
        );
        setRecipes(response.data.results);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // Log more details about the error
        if (error.response) {
          // The request was made, and the server responded with a status code outside the 2xx range
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made, but no response was received
          console.error('Request made but no response received:', error.request);
        } else {
          // Something else happened
          console.error('Error message:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, []);
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  const filteredRecipes = recipes
  .filter(recipe => (recipe.cuisine || '').includes(filters.cuisine))
  .filter(recipe => (recipe.diet || '').includes(filters.diet))
  .filter(recipe => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()));


  const totalRecipes = recipes.length;
  const averagePrepTime = recipes.reduce((sum, recipe) => sum + (recipe.readyInMinutes || 0), 0) / totalRecipes || 0;
  const uniqueCuisines = [...new Set(recipes.map(recipe => recipe.cuisine))].length;
    
  
  return (
    <div>
      <select name="cuisine" onChange={handleFilterChange}>
        <option value="">All Cuisines</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
        <option value="American">American</option>
        <option value="Chinese">Chinese</option>
        <option value="Japanese">Japanese</option>
        {/* Add more cuisines */}
      </select>
      <select name="diet" onChange={handleFilterChange}>
        <option value="">All Diets</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Vegan">Vegan</option>
        <option value="Gluten Free">Gluten Free</option>
        <option value="Pescaterian">Pe</option>
        {/* Add more diets */}
      </select>
      <input
        type="text"
        placeholder="Search Recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
    </div>
      <div>
        {loading ? <p>Loading...</p> : <p>{filteredRecipes.length} recipes found</p>}
      </div>
      <div>
        <p>Average Preparation Time: {averagePrepTime.toFixed(2)} minutes</p>
        <p>Number of Unique Cuisines: {uniqueCuisines}</p>
      </div>
      <ul>
        {filteredRecipes.map(recipe => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
  
};

export default RecipeList;
