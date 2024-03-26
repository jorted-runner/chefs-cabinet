// Global Variables
const recipeTypeElmnt = document.querySelector("#recipeType");
const formElmnt = document.querySelector(".form");
const loaderContainer = document.querySelector('.loader-container');
var ingredientsInclude = [];
var ingredientsExclude = [];
var instructions = [];

// Loading display-hide
const displayLoading = () => {
  loaderContainer.style.display = 'block';
};
const hideLoading = () => {
  loaderContainer.style.display = 'none';
};

// Recipe Type Drop Down Listener - Trigger Form Building
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

function deleteEvent (event, ul, li, list) {
  const eventText = event.target.parentNode.firstChild.textContent.trim();
  ul.removeChild(li);
  const indexToRemove = list.indexOf(eventText);
  if (indexToRemove !== -1) {
      list.splice(indexToRemove, 1);
  }
}

// Build Form for AI Recipe Generation
function aiRecipe() {
  // Ingredients to Include Element Creation
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
  // Add button event listener
  buttonElmnt.addEventListener('click', () => {
    if (inputElmnt.value != '') {
      const ingredient = document.createElement('li');
      const deleteButton = document.createElement('button');
      ingredient.textContent = inputElmnt.value;
      ingredientsInclude.push(inputElmnt.value);
      deleteButton.textContent = "❌";
      ingredient.append(deleteButton);
      ingredientsUL.appendChild(ingredient);
      // Delete button event listener
      deleteButton.addEventListener("click", (event) => {
        deleteEvent(event, ingredientsUL, ingredient, ingredientsInclude);
      });
      inputElmnt.value = '';
      inputElmnt.focus();
    } else {
      alert("Cannot add a blank ingredient. Add an ingredient and try again.");
      inputElmnt.focus();
    }
  });
  // Key press event listener
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
        // Delete Button event listener
        deleteButton.addEventListener("click", (event) => {
          deleteEvent(event, ingredientsUL, newIngredient, ingredientsInclude);
        });
        inputElmnt.focus();
        inputElmnt.value = '';
    }
  });
  // Add Include Ingredients elements to the form
  formElmnt.appendChild(ingredients_H1);
  formElmnt.appendChild(labelElmnt);
  formElmnt.appendChild(inputElmnt);
  formElmnt.appendChild(buttonElmnt);
  formElmnt.appendChild(ingredientsUL);

  const hrElmnt = document.createElement('hr');
  formElmnt.appendChild(hrElmnt);

  // Exclude Ingredients Element Creation
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
  // Exclude Button Event Listener
  buttonElmnt_2.addEventListener('click', () => {
    if (inputElmnt_2.value != '') {
      const ingredient = document.createElement('li');
      const deleteButton = document.createElement('button');
      ingredient.textContent = inputElmnt_2.value;
      ingredientsExclude.push(inputElmnt_2.value);
      deleteButton.textContent = "❌";
      ingredient.append(deleteButton);
      ingredientsUL_2.appendChild(ingredient);
      // Delete Button Event Listener
      deleteButton.addEventListener("click", (event) => {
        deleteEvent(event, ingredientsUL_2, ingredient, ingredientsExclude);
      });
      inputElmnt_2.value = '';
      inputElmnt_2.focus();
    } else {
      alert("Cannot add a blank ingredient. Add an ingredient and try again.");
      inputElmnt_2.focus();
    }
  });
  // Exclude Key Press Event Listener
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
      // Delete Button Event Listener
        deleteButton.addEventListener("click", (event) => {
          deleteEvent(event, ingredientsUL_2, newIngredient, ingredientsExclude);
        });
        inputElmnt_2.focus();
        inputElmnt_2.value = '';
      }
});
  // Recipe Generation Button Creation
  const generateButton = document.createElement('button');
  generateButton.textContent = 'Generate Recipe';
  generateButton.addEventListener('click', () => {
    if (ingredientsInclude != [], ingredientsExclude != []) {
      displayLoading();
      recipeGeneration();
    }
  });
  // Add Exclude Elements and Generate Recipe Button to Form 
  formElmnt.appendChild(ingredients_exclude_H1);
  formElmnt.appendChild(labelElmnt_2);
  formElmnt.appendChild(inputElmnt_2);
  formElmnt.appendChild(buttonElmnt_2);
  formElmnt.appendChild(ingredientsUL_2);
  formElmnt.appendChild(generateButton);
}

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
  imageGenButton.setAttribute('id', 'imageGenBTN');
  imageGenButton.textContent = 'Generate Image';
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
            ingredientLi.textContent = ingredient;
            ingredientsElmnt.appendChild(ingredientLi);
          });
          const instructionsH1 = document.createElement('h4');
          instructionsH1.textContent = "Instructions";
          
          const instructionsElmnt = document.createElement('ol');
          _instructions.forEach(step => {
            const instructionLi = document.createElement('li');
            instructionLi.textContent = step;
            instructionsElmnt.appendChild(instructionLi);
          });
          formElmnt.innerHTML = '';
          recipeDiv.appendChild(_titleElmnt);
          recipeDiv.appendChild(_descElmnt);
          recipeDiv.appendChild(ingredientsH1);
          recipeDiv.appendChild(ingredientsElmnt);
          recipeDiv.appendChild(instructionsH1);
          recipeDiv.appendChild(instructionsElmnt);
          formElmnt.appendChild(recipeDiv);

          const regenRecipe = document.createElement('button');
          regenRecipe.textContent = 'Regenerate Recipe';
          regenRecipe.addEventListener('click', () => {
            displayLoading();
            recipeDiv.innerHTML = '';
            recipeGeneration();
          });
          formElmnt.appendChild(regenRecipe);

          const imageGenButton = document.createElement('button');
          imageGenButton.setAttribute('id', 'imageGenBTN');
          imageGenButton.textContent = 'Generate Image';
          imageGenButton.addEventListener('click', () => {
            const title = _title;
            const description = _desc;
            displayLoading();
            imageGeneration(title, description);
          });
          formElmnt.appendChild(imageGenButton);
          createImageContainer();
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
          const imageGenBTN = document.querySelector('#imageGenBTN');
          const saveButton = document.createElement('button');
          saveButton.textContent = 'Save Recipe';
          formElmnt.appendChild(saveButton);
          imageGenBTN.textContent = 'Regenerate Image';
          imageContainer.innerHTML = '';
          data.images.forEach(imageUrl => {
              const imgElement = document.createElement('img');
              imgElement.src = imageUrl;
              imgElement.alt = 'Recipe Image';
              imgElement.setAttribute('width', 300);
              imgElement.setAttribute('height', 300);
              imageContainer.appendChild(imgElement);
          });
      })
      .catch(error => console.error(error));
}
