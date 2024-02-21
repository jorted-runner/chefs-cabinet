const recipeTypeElmnt = document.querySelector("#recipeType");
const formElmnt = document.querySelector(".form");
const loaderContainer = document.querySelector('.loader-container');
var ingredientsInclude = [];
var ingredientsExclude = [];
var instructions = [];

const displayLoading = () => {
  loaderContainer.style.display = 'block';
};

const hideLoading = () => {
  loaderContainer.style.display = 'none';
};

recipeTypeElmnt.addEventListener("change", function(event) {
    const selectedValue = event.target.value;
    if (selectedValue == "aiAssisted") {
      recipeTypeElmnt.disabled = true;
      aiRecipe();
    } else if (selectedValue == "blankRecipe") {
      recipeTypeElmnt.disabled = true;
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
      deleteButton.addEventListener("click", (event) => {
        const ingredientText = event.target.parentNode.firstChild.textContent.trim();
        ingredientsUL.removeChild(ingredient);
        const indexToRemove = ingredientsInclude.indexOf(ingredientText);
        if (indexToRemove !== -1) {
            ingredientsInclude.splice(indexToRemove, 1);
        }
      });
      inputElmnt.value = '';
      inputElmnt.focus();
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
        deleteButton.addEventListener("click", (event) => {
          const ingredientText = event.target.parentNode.firstChild.textContent.trim();
          ingredientsUL.removeChild(newIngredient);
          const indexToRemove = ingredientsInclude.indexOf(ingredientText);
          if (indexToRemove !== -1) {
              ingredientsInclude.splice(indexToRemove, 1);
          }
        });
        inputElmnt.focus();
        inputElmnt.value = '';
    } // else if (keyPressed == "Enter" && inputElmnt.value == "") {
    //     alert("Cannot add a blank ingredient. Add an ingredient and try again.");
    //     inputElmnt.focus();
    // }
  });

  formElmnt.appendChild(ingredients_H1);
  formElmnt.appendChild(labelElmnt);
  formElmnt.appendChild(inputElmnt);
  formElmnt.appendChild(buttonElmnt);
  formElmnt.appendChild(ingredientsUL);

  const hrElmnt = document.createElement('hr');
  formElmnt.appendChild(hrElmnt);

  const ingredients_exclude_H1 = document.createElement('h1');
  ingredients_exclude_H1.textContent = "Ingredients to Exclude";
  
  const labelElmnt_2 = document.createElement('label');
  labelElmnt_2.setAttribute('for', 'newIngredient');
  labelElmnt_2.textContent = 'New Ingredient: ';

  const inputElmnt_2 = document.createElement('input');
  inputElmnt_2.setAttribute('type', 'text');
  inputElmnt_2.setAttribute('id', 'newIngredient');
  inputElmnt_2.setAttribute('placeholder', 'Gluten');

  const buttonElmnt_2 = document.createElement('button');
  buttonElmnt_2.setAttribute('type', 'submit');
  buttonElmnt_2.textContent = 'Add';

  const ingredientsUL_2 = document.createElement('ul');
  ingredientsUL_2.setAttribute('id', 'ingredientsExclude');

  buttonElmnt_2.addEventListener('click', () => {
    if (inputElmnt_2.value != '') {
      const ingredient = document.createElement('li');
      const deleteButton = document.createElement('button');
      ingredient.textContent = inputElmnt_2.value;
      ingredientsExclude.push(inputElmnt_2.value);
      deleteButton.textContent = "❌";
      ingredient.append(deleteButton);
      ingredientsUL_2.appendChild(ingredient);
      deleteButton.addEventListener("click", (event) => {
        const ingredientText = event.target.parentNode.firstChild.textContent.trim();
        ingredientsUL_2.removeChild(ingredient);
        const indexToRemove = ingredientsExclude.indexOf(ingredientText);
        if (indexToRemove !== -1) {
            ingredientsExclude.splice(indexToRemove, 1);
        }
      });
      inputElmnt_2.value = '';
      inputElmnt_2.focus();
    } else {
      alert("Cannot add a blank ingredient. Add an ingredient and try again.");
      inputElmnt_2.focus();
    }
  });
  // I also need to refactor this function. It shouldn't have different names for elements than the one above.
  document.addEventListener('keypress', function(event) {
    let keyPressed = event.key;
    if (keyPressed == "Enter" && inputElmnt_2.value != "") {
        const newIngredient = document.createElement('li');
        const deleteButton = document.createElement('button')
        newIngredient.textContent = inputElmnt_2.value;
        ingredientsExclude.push(inputElmnt_2.value);
        deleteButton.textContent = "❌";
        newIngredient.append(deleteButton);
        ingredientsUL_2.appendChild(newIngredient);
        deleteButton.addEventListener("click", (event) => {
          const ingredientText = event.target.parentNode.firstChild.textContent.trim();
          ingredientsUL_2.removeChild(newIngredient);
          const indexToRemove = ingredientsExclude.indexOf(ingredientText);
          if (indexToRemove !== -1) {
              ingredientsExclude.splice(indexToRemove, 1);
        }
        });
        inputElmnt_2.focus();
        inputElmnt_2.value = '';
    } // else if (keyPressed == "Enter" && inputElmnt_2.value == "") {
      // alert("Cannot add a blank ingredient. Add an ingredient and try again.");
      // inputElmnt_2.focus();
    //}
});

  const generateButton = document.createElement('button');
  generateButton.textContent = 'Generate Recipe';
  generateButton.addEventListener('click', () => {
    if (ingredientsInclude != [], ingredientsExclude != []) {
      displayLoading();
      recipeGeneration();
    }
  });
  
  formElmnt.appendChild(ingredients_exclude_H1);
  formElmnt.appendChild(labelElmnt_2);
  formElmnt.appendChild(inputElmnt_2);
  formElmnt.appendChild(buttonElmnt_2);
  formElmnt.appendChild(ingredientsUL_2);
  formElmnt.appendChild(generateButton);
}

// In Blank Recipe I need to update the delete button to actually work
function blankRecipe() {
  const recipeTitleLabel = document.createElement('label');
  recipeTitleLabel.setAttribute('for', 'recipeTitle');
  recipeTitleLabel.textContent = 'Recipe Title: ';

  const recipeTitleInput = document.createElement('input');
  recipeTitleInput.setAttribute('type', 'text');
  recipeTitleInput.setAttribute('placeholder', 'Creamy Chicken Noodle Soup');
  recipeTitleInput.setAttribute('id', 'recipeTitle');

  const recipeDescLabel = document.createElement('label');
  recipeDescLabel.setAttribute('for', 'recipeDesc');
  recipeDescLabel.textContent = 'Recipe Description: ';
  
  const recipeDescInput = document.createElement('input');
  recipeDescInput.setAttribute('type', 'text');
  recipeDescInput.setAttribute('placeholder', 'Creamy Chicken Noodle Soup that will heal all your sicknesses');
  recipeDescInput.setAttribute('id', 'recipeDesc');

  formElmnt.appendChild(recipeTitleLabel);
  formElmnt.appendChild(recipeTitleInput);
  formElmnt.appendChild(recipeDescLabel);
  formElmnt.appendChild(recipeDescInput);

  const ingredients_H1 = document.createElement('h1');
  ingredients_H1.textContent = "Ingredients";
  
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
        ingredientsInclude = ingredientsInclude.filter(item => item != ingredient.textContent);
      });
      inputElmnt.value = '';
      inputElmnt.focus();
    } else {
      alert("Cannot add a blank ingredient. Add an ingredient and try again.");
      inputElmnt.focus();
    }
  });
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
          const ingredientText = event.target.parentNode.firstChild.textContent.trim();
          ingredientsUL.removeChild(newIngredient);
          const indexToRemove = ingredientsInclude.indexOf(ingredientText);
          if (indexToRemove !== -1) {
              ingredientsInclude.splice(indexToRemove, 1);
          }
        });
        inputElmnt.focus();
        inputElmnt.value = '';
    }
  });

  formElmnt.appendChild(ingredients_H1);
  formElmnt.appendChild(labelElmnt);
  formElmnt.appendChild(inputElmnt);
  formElmnt.appendChild(buttonElmnt);
  formElmnt.appendChild(ingredientsUL);

  const hrElmnt = document.createElement('hr');
  formElmnt.appendChild(hrElmnt);

  const instructionsH1 = document.createElement('h1');
  instructionsH1.textContent = "Instructions";
  
  const instructionsLabelElmnt = document.createElement('label');
  instructionsLabelElmnt.setAttribute('for', 'newStep');
  instructionsLabelElmnt.textContent = 'Next Step: ';

  const instructionsInputElmnt = document.createElement('input');
  instructionsInputElmnt.setAttribute('type', 'text');
  instructionsInputElmnt.setAttribute('id', 'newStep');
  instructionsInputElmnt.setAttribute('placeholder', 'Mix Dry Ingredients in a Bowl');

  const instructionsButtonElmnt = document.createElement('button');
  instructionsButtonElmnt.setAttribute('type', 'submit');
  instructionsButtonElmnt.textContent = 'Add';

  const instructionsOL = document.createElement('ol');
  instructionsOL.setAttribute('id', 'instructions');

  instructionsButtonElmnt.addEventListener('click', () => {
    if (instructionsInputElmnt.value != '') {
      const step = document.createElement('li');
      const deleteButton = document.createElement('button');
      step.textContent = instructionsInputElmnt.value;
      deleteButton.textContent = "❌";
      step.append(deleteButton);
      instructionsOL.appendChild(step);
      instructions.push(instructionsInputElmnt.value);
      deleteButton.addEventListener("click", (event) => {
        const instructionText = event.target.parentNode.firstChild.textContent.trim();
        instructionsOL.removeChild(step);
        const indexToRemove = instructions.indexOf(instructionText);
        if (indexToRemove !== -1) {
            instructions.splice(indexToRemove, 1);
        }
        console.log(instructions);
      });
      instructionsInputElmnt.value = '';
      instructionsInputElmnt.focus();
      console.log(instructions);
    } else {
      alert("Cannot add a blank step. Add a step and try again.");
      instructionsInputElmnt.focus();
    }
  });
  document.addEventListener('keypress', function(event) {
    let keyPressed = event.key;
    if (keyPressed == "Enter" && instructionsInputElmnt.value != "") {
        const step = document.createElement('li');
        const deleteButton = document.createElement('button')
        step.textContent = instructionsInputElmnt.value;
        deleteButton.textContent = "❌";
        step.append(deleteButton);
        instructionsOL.appendChild(step);
        instructions.push(instructionsInputElmnt.value);
        deleteButton.addEventListener("click", (event) => {
          const instructionsText = event.target.parentNode.firstChild.textContent.trim();
          instructionsOL.removeChild(step);
          const indexToRemove = instructions.indexOf(instructionsText);
          if (indexToRemove !== -1) {
              instructions.splice(indexToRemove, 1);
          }
          console.log(instructions);
        });
        instructionsInputElmnt.focus();
        instructionsInputElmnt.value = '';
        console.log(instructions);
    }
  });

  formElmnt.appendChild(instructionsH1);
  formElmnt.appendChild(instructionsLabelElmnt);
  formElmnt.appendChild(instructionsInputElmnt);
  formElmnt.appendChild(instructionsButtonElmnt);
  formElmnt.appendChild(instructionsOL);

  const imageGenButton = document.createElement('button');
  imageGenButton.textContent = 'Generate Images';
  imageGenButton.addEventListener('click', () => {
    if (recipeTitleInput.value != '' && recipeDescInput.value != '' && ingredientsInclude != [] && instructions != []) {
      const title = recipeTitleInput.value;
      const description = recipeDescInput.value;
      displayLoading();
      imageGeneration(title, description);
    } 
  });
  formElmnt.appendChild(imageGenButton);
  createImageContainer();
}

function createImageContainer() {
  const imageContainer = document.createElement('div');
  imageContainer.setAttribute('id', 'imageContainer');
  formElmnt.appendChild(imageContainer);
}

function recipeGeneration() {
  var toInclude = ingredientsInclude.join(", ");
  var toExclude = ingredientsExclude.join(", ");
  fetch('/generate_recipe', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          includeIngredients: toInclude,
          excludeIngredients: toExclude
      })
  })
      .then(response => {
          if (response.ok) {
              console.log('Recipe generation started.');
              return response.json();
          } else {
              hideLoading();
              alert('Error with Generation');
              throw new Error('Error triggering recipe regeneration.');
          }
      })
      .then(data => {
          hideLoading();
          const recipe = JSON.parse(data.recipe);
          const _title = recipe.Title;
          const _desc = recipe.Description;
          const _ingredients = recipe.Ingredients;
          const _instructions = recipe.Instructions;

          const recipeDiv = document.createElement('div');
          recipeDiv.setAttribute('id', 'recipe');

          const _titleElmnt = document.createElement('h1');
          _titleElmnt.setAttribute('id', 'recipeTitle');
          _titleElmnt.textContent = _title;

          const _descElmnt = document.createElement('p');
          _descElmnt.setAttribute('id', 'recipeDesc');
          _descElmnt.textContent = _desc;

          const ingredientsH1 = document.createElement('h4');
          ingredientsH1.textContent = "Ingredients";

          const ingredientsElmnt = document.createElement('ul');
          _ingredients.forEach(ingredient => {
            const ingredientLi = document.createElement('li');
            ingredientLi.textContent(ingredient);
            ingredientsElmnt.appendChild(ingredientLi);
          });
          const instructionsH1 = document.createElement('h4');
          instructionsH1.textContent = "Instructions";
          
          const instructionsElmnt = document.createElement('ol');
          // _instructions.forEach(step => {
          //   const instructionLi = document.createElement('li');
          //   instructionLi.textContent(step);
          //   instructionsElmnt.appendChild(instructionLi);
          // });
          recipeDiv.appendChild(_titleElmnt);
          recipeDiv.appendChild(_descElmnt);
          recipeDiv.appendChild(ingredientsElmnt);
          recipeDiv.appendChild(instructionsElmnt);
          formElmnt.appendChild(recipeDiv);

      })
      .catch(error => console.error(error));
}

function imageGeneration(_title, _description) {
  fetch('/generate_images', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          title: _title,
          description: _description
      })
  })
      .then(response => {
          if (response.ok) {
              console.log('Image generation started.');
              return response.json();
          } else {
              hideLoading();
              console.log(response);
              alert('Error with Generation');
              throw new Error('Error triggering image regeneration.');
          }
      })
      .then(data => {
          hideLoading();
          const imageContainer = document.getElementById('imageContainer');
          imageContainer.innerHTML = '';
          data.images.forEach(imageUrl => {
              const buttonElement = document.createElement('button');
              const imgElement = document.createElement('img');
              imgElement.src = imageUrl;
              imgElement.alt = 'Recipe Image';
              buttonElement.appendChild(imgElement);
              imageContainer.appendChild(buttonElement);
          });
      })
      .catch(error => console.error(error));
}