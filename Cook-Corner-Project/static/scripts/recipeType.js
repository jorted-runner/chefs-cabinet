const recipeTypeElmnt = document.querySelector("#recipeType");

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