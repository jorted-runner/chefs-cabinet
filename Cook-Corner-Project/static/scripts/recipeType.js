const recipeTypeElmnt = document.querySelector("#recipeType");
const formElmnt = document.querySelector(".form");
let ingredientsInclude = [];
let ingredientsExclude = [];

recipeTypeElmnt.addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    if (selectedValue == "aiAssisted") {
      aiRecipe();
    } else if (selectedValue == "blankRecipe") {
      blankRecipe();
    }
});

function aiRecipe() {
  const ingredients_H1 = document.createElement('h1');
  ingredients_H1.textContent = "Ingredients to Include";
  
  const labelElmnt = document.createElement('label');
  labelElmnt.setAttribute('for', 'newIngredient');
  labelElmnt.textContent = 'New Ingredient: ';

  const inputElmnt = document.createElement('input');
  inputElmnt.setAttribute('type', 'text');
  inputElmnt.setAttribute('id', 'newIngredient');
  inputElmnt.setAttribute('placeholder', 'Seedless Grapes');

  const buttonElmnt = document.createElement('button');
  buttonElmnt.setAttribute('type', 'submit');
  buttonElmnt.textContent = 'Add';

  const ingredientsUL = document.createElement('ul');
  ingredientsUL.setAttribute('id', 'ingredients');

  buttonElmnt.addEventListener('click', () => {
    if (inputElmnt.value != '') {
      const ingredient = document.createElement('li');
      const deleteButton = document.createElement('button');
      ingredient.textContent = inputElmnt.value;
      ingredientsInclude.push(inputElmnt.value);
      deleteButton.textContent = "❌";
      ingredient.append(deleteButton);
      ingredientsUL.appendChild(ingredient);
      deleteButton.addEventListener("click", () => {
        ingredientsUL.removeChild(ingredient);
        // I need to work on removing the element from the list
        ingredientsInclude = ingredientsInclude.filter(item => item != ingredient.textContent);
        console.log(ingredientsInclude);
      });
      inputElmnt.value = '';
      inputElmnt.focus();
      console.log(ingredientsInclude);
    } else {
      alert("Cannot add a blank ingredient. Add an ingredient and try again.");
      inputElmnt.focus();
    }
  });
  // I also need to refactor this function. It shouldn't have different names for elements than the one above.
  document.addEventListener('keypress', function(event) {
    let keyPressed = event.key;
    if (keyPressed == "Enter" && inputElmnt.value != "") {
        const newIngredient = document.createElement('li');
        const deleteButton = document.createElement('button')
        newIngredient.textContent = inputElmnt.value;
        ingredientsInclude.push(inputElmnt.value);
        deleteButton.textContent = "❌";
        newIngredient.append(deleteButton);
        ingredientsUL.appendChild(newIngredient);
        deleteButton.addEventListener("click", () => {
            ingredientsUL.removeChild(newIngredient);
            // I need to work on removing the element from the list
            ingredientsInclude = ingredientsInclude.filter(item => item != newIngredient.textContent);
            console.log(ingredientsInclude);
        });
        inputElmnt.focus();
        inputElmnt.value = '';
        console.log(ingredientsInclude);
    } else if (keyPressed == "Enter" && inputElmnt.value == "") {
        alert("Cannot add a blank ingredient. Add an ingredient and try again.");
        inputElmnt.focus();
    }
});

  formElmnt.appendChild(ingredients_H1);
  formElmnt.appendChild(labelElmnt);
  formElmnt.appendChild(inputElmnt);
  formElmnt.appendChild(buttonElmnt);
  formElmnt.appendChild(ingredientsUL);
}

function blankRecipe() {
  
}