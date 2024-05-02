const recipeTypeElmnt = document.querySelector("#recipeType");
const loaderContainer = document.querySelector('.loader-container');
const displayRecipe = document.querySelector('.display-recipe');

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
        ai_recipe();
    } else if (selectedValue == "blankRecipe") {
        blank_form.classList.remove('hidden');
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

function createLI (parentElmnt, value, type) {
    const li = document.createElement('li');
    const deleteButton = document.createElement('button');
    li.textContent = value;
    if (type == 'include') {
        ingredientsInclude.push(value);
    } else if (type == 'exclude') {
        ingredientsExclude.push(value);
    } else if (type == 'step') {
        INSTRUCTIONS.push(value);
    }
    deleteButton.textContent = "❌";
    li.append(deleteButton);
    parentElmnt.appendChild(li);
    deleteButton.addEventListener("click", (event) => {
        if (type == 'include') {
            deleteEvent(event, parentElmnt, li, ingredientsInclude);
        } else if (type == 'exclude') {
            deleteEvent(event, parentElmnt, li, ingredientsExclude);
        } else if (type == 'step') {
            deleteEvent(event, parentElmnt, li, INSTRUCTIONS);
        }
    });
}
function display_recipe (recipe) {
    const _title = recipe.Title;
    const _desc = recipe.Description;
    const _ingredients = recipe.Ingredients;
    const _instructions = recipe.Instructions;
    const recipeDiv = document.createElement('div');
    recipeDiv.setAttribute('id', 'recipe');

    const _titleElmnt = document.createElement('h1');
    _titleElmnt.setAttribute('id', 'recipeTitle');
    _titleElmnt.textContent = _title;
    TITLE = _title;

    const _descElmnt = document.createElement('p');
    _descElmnt.setAttribute('id', 'recipeDesc');
    _descElmnt.textContent = _desc;
    DESC = _desc;

    const ingredientsH1 = document.createElement('h4');
    ingredientsH1.textContent = "Ingredients";
    
    const ingredientsElmnt = document.createElement('ul');
    ingredientsInclude = [];
    _ingredients.forEach(ingredient => {
        const ingredientLi = document.createElement('li');
        ingredientLi.textContent = ingredient;
        ingredientsElmnt.appendChild(ingredientLi);
            INGREDIENTS.push(ingredient);
        createLI(parentElmnt = document.querySelector('#include'), value=ingredient, type='include');
    });
    const instructionsH1 = document.createElement('h4');
    instructionsH1.textContent = "Instructions";
    
    const instructionsElmnt = document.createElement('ol');
    _instructions.forEach(step => {
        const instructionLi = document.createElement('li');
        instructionLi.textContent = step;
        instructionsElmnt.appendChild(instructionLi);
            INSTRUCTIONS.push(step);
    });
    recipeDiv.appendChild(_titleElmnt);
    recipeDiv.appendChild(_descElmnt);
    recipeDiv.appendChild(ingredientsH1);
    recipeDiv.appendChild(ingredientsElmnt);
    recipeDiv.appendChild(instructionsH1);
    recipeDiv.appendChild(instructionsElmnt);
    displayRecipe.classList.remove('hidden');
    displayRecipe.appendChild(recipeDiv);
}

function createImageContainer(container) {
    const imageContainer = document.createElement('div');
    imageContainer.setAttribute('id', 'imageContainer');
    container.appendChild(imageContainer);
}

function imageGeneration(_title, _description) {
    fetch('/generate_images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: _title,
            description: _description,
            ingredients: INGREDIENTS
        })
        })
        .then(response => {
            if (response.ok) {
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
            const hiddenForm = document.createElement('form');
            hiddenForm.classList.add('form');
            hiddenForm.setAttribute('id', 'hiddenForm');
            hiddenForm.setAttribute('method', 'POST');
            hiddenForm.setAttribute('action', saveRecipeURL);

            const hiddenTitle = document.createElement('input');
            hiddenTitle.setAttribute('type', 'hidden');
            hiddenTitle.setAttribute('name', 'title');
            hiddenTitle.setAttribute('value', TITLE);

            const hiddenDesc = document.createElement('input');
            hiddenDesc.setAttribute('type', 'hidden');
            hiddenDesc.setAttribute('name', 'desc');
            hiddenDesc.setAttribute('value', DESC);

            const hiddenIngredients = document.createElement('input');
            hiddenIngredients.setAttribute('type', 'hidden');
            hiddenIngredients.setAttribute('name', 'ingredients');
            hiddenIngredients.setAttribute('value', JSON.stringify(INGREDIENTS));

            const hiddenInstructions = document.createElement('input');
            hiddenInstructions.setAttribute('type', 'hidden');
            hiddenInstructions.setAttribute('name', 'instructions');
            hiddenInstructions.setAttribute('value', JSON.stringify(INSTRUCTIONS));

            hiddenForm.appendChild(hiddenTitle);
            hiddenForm.appendChild(hiddenDesc);
            hiddenForm.appendChild(hiddenIngredients);
            hiddenForm.appendChild(hiddenInstructions);

            const submitButton = document.createElement('input');
            submitButton.setAttribute('type', 'submit');
            submitButton.setAttribute('value', 'Save Recipe');
            const hiddenIMG = document.createElement('input');
            hiddenIMG.setAttribute('type', 'hidden');
            hiddenIMG.setAttribute('name', 'image_url');
            imageContainer.innerHTML = '';
            data.images.forEach(imageUrl => {
                IMAGE_URL = imageUrl;
                const imgElement = document.createElement('img');
                imgElement.classList.add('formImg');
                imgElement.src = imageUrl;
                imgElement.alt = 'Recipe Image';
                imgElement.setAttribute('width', 400);
                imgElement.setAttribute('height', 400);
                imageContainer.appendChild(imgElement);
                
                hiddenIMG.setAttribute('value', imageUrl);
                
            });
            hiddenForm.appendChild(hiddenIMG);
            submitButton.addEventListener("click", () => {
                displayLoading();
                hiddenForm.submit()
            });
            hiddenForm.appendChild(submitButton);
            displayRecipe.appendChild(hiddenForm);
        })
        .catch(error => console.error(error));
}

function recipeGeneration() {
    var toInclude = ingredientsInclude.join(', ');
    var toExclude = ingredientsExclude.join(', ');
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
            document.querySelector('#include').innerHTML = '';
            display_recipe(recipe);
            ai_form.classList.add('hidden');
            
            const regenRecipe = document.createElement('button');
            regenRecipe.setAttribute('type', 'button');
            regenRecipe.textContent = 'Edit and Regenerate Recipe';
            regenRecipe.addEventListener('click', () => {
                ai_form.classList.remove('hidden');
                displayRecipe.classList.add('hidden');
                displayRecipe.innerHTML = '';
                INGREDIENTS = [];
                INSTRUCTIONS = [];
            });
            displayRecipe.appendChild(regenRecipe);

            const imageGenButton = document.createElement('button');
            imageGenButton.setAttribute('id', 'imageGenBTN');
            imageGenButton.textContent = 'Generate Image';
            imageGenButton.addEventListener('click', () => {
                const title = TITLE;
                const description = DESC;
                displayLoading();
                const existingForm = document.querySelector('#hiddenForm');
                if (existingForm) {
                    existingForm.remove();
                }
                imageGenButton.textContent = 'Regenerate Image';
                imageGeneration(title, description);
            });
            displayRecipe.appendChild(imageGenButton);
            createImageContainer(displayRecipe);
        })
        .catch(error => console.error(error));
}

function ai_recipe() {
    const addIncludeBTN = document.querySelector('#addInclude');
    const includeInputElmnt = document.querySelector('#newInclude');
    const includeUL = document.querySelector('#include');

    const addExcludeBTN = document.querySelector('#addExclude');
    const excludeInputElmnt = document.querySelector('#newExclude');
    const excludeUL = document.querySelector('#exclude');

    const generateButton = document.querySelector('#generateRecipeBTN');

    addIncludeBTN.addEventListener('click', () => {
        if (includeInputElmnt.value != '') {
            const value = includeInputElmnt.value;
            createLI(includeUL, value, 'include');
            includeInputElmnt.value = '';
            includeInputElmnt.focus();
          } else {
            alert("Cannot add a blank ingredient. Add an ingredient and try again.");
            includeInputElmnt.focus();
          }
    });
    document.addEventListener('keypress', function(event) {
        let keyPressed = event.key;
        const value = includeInputElmnt.value;
        if (keyPressed == 'Enter' && value != '') {
            event.preventDefault();
            createLI(includeUL, value, 'include');
            includeInputElmnt.value = '';
            includeInputElmnt.focus();
        }
    });

    addExcludeBTN.addEventListener('click', () => {
        if (excludeInputElmnt.value != '') {
            const value = excludeInputElmnt.value;
            createLI(excludeUL, value, 'exclude');
            excludeInputElmnt.value = '';
            excludeInputElmnt.focus();
          } else {
            alert("Cannot add a blank ingredient. Add an ingredient and try again.");
            excludeInputElmnt.focus();
          }
    });
    document.addEventListener('keypress', function(event) {
        let keyPressed = event.key;
        const value = excludeInputElmnt.value;
        if (keyPressed == 'Enter' && value != '') {
            event.preventDefault();
            createLI(excludeUL, value, 'exclude');
            excludeInputElmnt.value = '';
            excludeInputElmnt.focus();
        }
    });
    generateButton.addEventListener('click', () => {
        if (ingredientsInclude != [], ingredientsExclude != []) {
            displayLoading();
            recipeGeneration();
        }
    });
}

function blankRecipe() {
    const addIngredientBTN = document.querySelector('#addIngredient');
    const ingredientsUl = document.querySelector('#ingredients');
    const ingredientInput = document.querySelector('#newIngredient');

    const addStepBTN = document.querySelector('#addStep');
    const instructionsOl = document.querySelector('#instructions');
    const instructionInput = document.querySelector('#newStep');

    const generateButton = document.querySelector('#imageGenBTN');

    const recipeTitle = document.querySelector('#recipeTitle');
    const recipeDesc = document.querySelector('#recipeDesc');

    addIngredientBTN.addEventListener('click', () => {
        const value = ingredientInput.value;
        if (value != '') {
            createLI(ingredientsUl, value, 'include');
            ingredientInput.value = '';
            ingredientInput.focus();
        } else {
            alert("Cannot add a blank ingredient. Add an ingredient and try again.");
            ingredientInput.focus();
        }
    });
    addStepBTN.addEventListener('click', () => {
        const value = instructionInput.value;
        if (value != '') {
            createLI(instructionsOl, value, 'step');
            instructionInput.value = '';
            instructionInput.focus();
        } else {
            alert("Cannot add a blank step. Add a step and try again.");
            instructionInput.focus();
        }
    });
    document.addEventListener('keypress', function(event) {
        let keyPressed = event.key;
        const value = instructionInput.value;
        if (keyPressed == 'Enter' && value != '') {
            event.preventDefault();
            createLI(instructionsOl, value, 'step');
            instructionInput.value = '';
            instructionInput.focus();
        }
    });
    document.addEventListener('keypress', function(event) {
        let keyPressed = event.key;
        const value = ingredientInput.value;
        if (keyPressed == 'Enter' && value != '') {
            event.preventDefault();
            createLI(ingredientsUl, value, 'include');
            ingredientInput.value = '';
            ingredientInput.focus();
        }
    });
    generateButton.addEventListener('click', () => {
        if (recipeTitle.value != '' && recipeDesc.value != '' && ingredientsInclude != [] && INSTRUCTIONS != []) {
          TITLE = recipeTitle.value;
          DESC = recipeDesc.value;
          displayLoading();
          displayRecipe.classList.remove('hidden');
          createImageContainer(displayRecipe);
          imageGeneration(TITLE, DESC);
        } 
    });
}