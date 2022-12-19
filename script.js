const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
let ingredients = '';
let globalData = '';

//Makes ingrdient list
function getIngrediends(meal){
    meal = meal[0];
    ingredients = '';
    for (let i = 9; i <= 28; i++)
      if (Object.values(meal)[i])
        ingredients += `Ingredient ${i - 8} : ${Object.values(meal)[i]} <br>`;
        console.log(ingredients)
  }

//to display random meal
function displayRandomMeal() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then(response => response.json())
      .then(data => {
        let html = '';
        if (data.meals) {
          globalData = data.meals;
          html = `<div class="meal-item" id="ourPick" data-id="${data.meals[0].idMeal}">
        <div class="meal-img">
        <img
        src="${data.meals[0].strMealThumb}" alt = "food";
        />
          </div>
          <div class="meal-name">
          <h3>${data.meals[0].strMeal}</h3>
          <a href="#" class="recipe-btn" id="ourButton" onclick="caller()">Ingredients</a>
          </div>
          </div>`;
        } else html = 'Sorry, server down';
        document.getElementById('randomDish').innerHTML = html;
        getIngrediends(data.meals);
      });
  }
  
//calls the funcion which makes ingredients list for random
function caller() {
    console.log('hi')
    mealRecipeModal(globalData, 1);
}

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Ingredient</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    getIngrediends(meal)
    console.log('k');
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Ingredients:</h3>
            <p>${ingredients}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

window.onload = () => displayRandomMeal();

