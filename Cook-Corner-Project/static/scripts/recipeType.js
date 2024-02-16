const recipeTypeElmnt = document.querySelector("#recipeType");
const formElmnt = document.querySelector(".form");

recipeTypeElmnt.addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    if (selectedValue == "aiAssisted") {
      aiRecipe();
    } else if (selectedValue == "blankRecipe") {
      blankRecipe();
  });

function aiRecipe() {


}

function blankRecipe() {
  
}

function createH1() {
  const ingredients_H1 = document.createElement('h1');
  ingredients_H1.textContent = "Ingredients";
  formElmnt.appendChild(ingredients_H1);
}