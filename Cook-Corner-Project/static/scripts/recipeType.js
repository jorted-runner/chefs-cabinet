const recipeTypeElmnt = document.querySelector("#recipeType");

recipeTypeElmnt.addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    if (selectedValue != "") {
      console.log("User selected:", selectedValue);
    }
  });

function aiRecipe() {

}

function blankRecipe() {
  
}