const recipeTypeElmnt = document.querySelector("#recipeType");
const loaderContainer = document.querySelector('.loader-container');
const ai_form = document.querySelector('.ai-recipe');
const blank_form = document.querySelector('.blank-recipe');

const displayLoading = () => {
    loaderContainer.style.display = 'block';
};
const hideLoading = () => {
    loaderContainer.style.display = 'none';
};

var ingredientsInclude = [];
var ingredientsExclude = [];
var TITLE = '';
var DESC = '';
var INSTRUCTIONS = [];
var INGREDIENTS = [];
var IMAGE_URL = '';
const saveRecipeURL = "/save_recipe";

recipeTypeElmnt.addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    if (selectedValue == "aiAssisted") {
        ai_form.classList.remove('hidden');
    } else if (selectedValue == "blankRecipe") {
        blank_form.classList.remove('hidden');
    }
});