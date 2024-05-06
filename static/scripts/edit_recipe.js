import { getText } from "./utils.js";

const edit_buttons = document.querySelectorAll('.edit_btn');
const delete_buttons = document.querySelectorAll('.delete_btn');
const add_step = document.querySelector('.add_step_btn');
const add_ingredient = document.querySelector('.add_ingredient_btn');
const instructions = document.querySelectorAll('.step');
const add_image = document.querySelector('.add_image_btn');

const saveButton = document.querySelector('.save_btn');

var INSTRUCTIONS = [];
var INGREDIENTS = [];
var IMAGES = [];
var USER_FILES = [];
var REMOVED_IMAGES = [];

saveButton.addEventListener('click', function() {
    const recipe_id = document.querySelector('.recipe_id').textContent;
    const recipe_title = document.querySelector('.title');
    const title = getText(recipe_title);
    const recipe_desc = document.querySelector('.desc');
    const desc = getText(recipe_desc);

    const instructions = document.querySelectorAll('.step');
    instructions.forEach(step => {
        const text = getText(step);
        INSTRUCTIONS.push(text);
    });
    const ingredients = document.querySelectorAll('.item');
    ingredients.forEach(item => {
        const text = getText(item);
        INGREDIENTS.push(text);
    });
    
    const formData = new FormData();
    formData.append('id', recipe_id);
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('instructions', JSON.stringify(INSTRUCTIONS));
    formData.append('ingredients', JSON.stringify(INGREDIENTS));
    const userUploads = document.querySelectorAll('.user-uploads');
    if (userUploads) {
        Array.from(userUploads).forEach(image => {
            if (image.files.length > 0) {
                const file = image.files[0];
                USER_FILES.push(file);
            }
        });
        USER_FILES.forEach(file => {
            formData.append('userUploads', file);
        });
    }
    formData.append('removed_images', JSON.stringify(REMOVED_IMAGES));
    fetch('/update_recipe', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            IMAGES = [];
            INGREDIENTS = [];
            INSTRUCTIONS = [];
            USER_FILES = [];
            throw new Error('Failed to save recipe');
        }
    })
    .then(data => {
        console.log('Recipe saved successfully');
        window.location.href = `/view_recipe/${recipe_id}`;
    })
    .catch(error => {
        console.error('Error saving recipe:', error);
    });
});

function check_num_images() {
    const delete_image_buttons = document.querySelectorAll('.delete_image_btn');
    const num_images = document.querySelectorAll('.recipe-image').length;
    const userUploads = document.querySelectorAll('.user-uploads');
    const USER_FILES = [];
    userUploads.forEach(image => {
        if (image.files.length > 0) {
            const file = image.files[0];
            USER_FILES.push(file);
        }
    });
    if ((num_images > 1 && USER_FILES.length > 0) || num_images >=2 ) {
        delete_image_buttons.forEach(button => {
            button.classList.remove('hidden');
            button.addEventListener('click', function() {
                const parent = button.parentElement;
                REMOVED_IMAGES.push(parent.querySelector('.recipe-image').src);
                parent.remove();
                check_num_images();
            })
        });
    } else {
        delete_image_buttons.forEach(button => {
            button.classList.add('hidden');
        });
    }
}


edit_buttons.forEach((button) => {
    button.addEventListener("click", function() {
        const parentElement = button.parentElement;
        const text = getText(parentElement);
        const textarea = document.createElement("textarea");
        textarea.classList.add('edit_input');
        textarea.value = text;
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";

        parentElement.innerHTML = "";
        parentElement.appendChild(textarea);
        parentElement.appendChild(saveButton);

        textarea.focus();

        saveButton.addEventListener("click", function() {
            const newValue = textarea.value;
            parentElement.textContent = newValue;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit_btn");

           
            parentElement.appendChild(editButton);
            if (parentElement.className !== 'title' && parentElement.className !== 'desc') {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete_btn");
                deleteButton.addEventListener('click', function() {
                    deleteButton.parentElement.remove();
                });
                parentElement.appendChild(deleteButton);
            }
            editButton.addEventListener("click", editParentText);
        });

    });
});

function editParentText() {
    const parentElement = this.parentElement;
    const text = getText(parentElement);

    const textarea = document.createElement("textarea"); // Change input to textarea
    textarea.classList.add('edit_input');
    textarea.value = text;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";

    parentElement.innerHTML = "";
    parentElement.appendChild(textarea); // Append textarea instead of input
    parentElement.appendChild(saveButton);

    textarea.focus();

    saveButton.addEventListener("click", function() {
        const newValue = textarea.value;
        parentElement.textContent = newValue;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit_btn");

        parentElement.appendChild(editButton);
        if (parentElement.className !== 'title' && parentElement.className !== 'desc') {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete_btn");
            deleteButton.addEventListener('click', function() {
                deleteButton.parentElement.remove();
            });
            parentElement.appendChild(deleteButton);
        }
        editButton.addEventListener("click", editParentText);
    });
}

delete_buttons.forEach((button) => {
    button.addEventListener('click', function() {
        button.parentElement.remove();
    });
});

function createIngredientInput() {
    const newIngredientInput = document.createElement("input");
    newIngredientInput.type = "textarea";
    newIngredientInput.placeholder = "Enter ingredient";
    newIngredientInput.classList.add("ingredient_input");
    return newIngredientInput;
}

function createStepInput(currentSteps) {
    const inputArea = document.createElement("div");
    
    const select = document.createElement("select");
    for (let i = 1; i <= currentSteps + 1; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
    
    // Create text input
    const stepInput = document.createElement("textarea");
    stepInput.placeholder = "Enter step";
    stepInput.classList.add("step_input");
    
    // Create save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", function() {
        const step = stepInput.value.trim();
        if (step) {
            const stepNumber = select.value;
            const newListItem = document.createElement("li");
            newListItem.textContent = `Step ${stepNumber}: ${step}`;
            if (stepNumber && !isNaN(stepNumber)) {
                const stepLi = document.createElement("li");
                stepLi.textContent = step;
                stepLi.classList.add('step');
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("edit_btn");

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete_btn");
                deleteButton.addEventListener('click', function() {
                    deleteButton.parentElement.remove();
                });
                stepLi.appendChild(editButton);
                stepLi.appendChild(deleteButton);
                editButton.addEventListener("click", editParentText);
                const ol = document.querySelector('.instructions ol');
                const existingStep = ol.children[stepNumber - 1];
                if (existingStep) {
                    ol.insertBefore(stepLi, existingStep);
                } else {
                    ol.appendChild(stepLi);
                }
            }
        }
        
        stepInput.remove();
        saveButton.remove();
        select.remove();

    });
    
    inputArea.appendChild(select);
    inputArea.appendChild(stepInput);
    inputArea.appendChild(saveButton);
    
    return inputArea;
}

add_ingredient.addEventListener("click", function() {
    const newIngredientInput = createIngredientInput();
    const targetElement = document.querySelector('.ingredients ul');
    targetElement.appendChild(newIngredientInput);
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener('click', function() {
        const newValue = newIngredientInput.value;
        newIngredientInput.remove();
        saveButton.remove();
        const newItem = document.createElement('li');
        newItem.textContent = newValue;
        newItem.classList.add('item');
        targetElement.appendChild(newItem);
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit_btn");
        newItem.appendChild(editButton);

        if (newItem.className !== 'title' && newItem.className !== 'desc') {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete_btn");
            deleteButton.addEventListener('click', function() {
                deleteButton.parentElement.remove();
            });
            newItem.appendChild(deleteButton);
        }
        editButton.addEventListener("click", editParentText);
    });
    targetElement.appendChild(saveButton);
});
add_step.addEventListener("click", function() {
    const newStepInput = createStepInput(instructions.length);
    const targetElement = document.querySelector('.instructions ol');
    targetElement.appendChild(newStepInput);
});

add_image.addEventListener('click', function() {
    check_num_images();
    var container = document.querySelector('.images');
    var label = document.createElement('label');
    label.textContent = 'New Image: ';
    var input = document.createElement('input');
    input.addEventListener('change', function() {
        check_num_images();
    });
    input.classList.add('recipe-image');
    input.classList.add('user-uploads');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'image');
    label.appendChild(input);
    container.appendChild(label);
    if (document.querySelectorAll('.recipe-image').length >= 10) {
        add_image.classList.add('hidden');
    }
});

check_num_images();
