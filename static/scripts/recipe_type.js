const recipeTypeElmnt = document.querySelector("#recipeType");
const loaderContainer = document.querySelector('.loader-container');
const ai_form = document.querySelector('.ai-recipe');
const blank_form = document.querySelector('.blank-recipe');

var ingredientsInclude = [];
var ingredientsExclude = [];
var TITLE = '';
var DESC = '';
var INSTRUCTIONS = [];
var INGREDIENTS = [];
var IMAGE_URL = '';
const saveRecipeURL = "/save_recipe";

const displayLoading = () => {
    loaderContainer.style.display = 'block';
};
const hideLoading = () => {
    loaderContainer.style.display = 'none';
};


recipeTypeElmnt.addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    if (selectedValue == "aiAssisted") {
        ai_form.classList.remove('hidden');
        recipeTypeElmnt.disabled = true;
    } else if (selectedValue == "blankRecipe") {
        blank_form.classList.remove('hidden');
        recipeTypeElmnt.disabled = true;
    }
});

function deleteEvent (event, ul, li, list) {
    const eventText = event.target.parentNode.firstChild.textContent.trim();
    ul.removeChild(li);
    const indexToRemove = list.indexOf(eventText);
    if (indexToRemove !== -1) {
        list.splice(indexToRemove, 1);
    }
  }