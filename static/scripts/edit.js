const edit_buttons = document.querySelectorAll('.edit_btn');
const delete_buttons = document.querySelectorAll('.delete_btn');
const add_step = document.querySelector('.add_step_btn');
const add_ingredient = document.querySelector('.add_ingredient_btn');
const instructions = document.querySelectorAll('.step');
const add_image = document.querySelector('.add_image_btn');

edit_buttons.forEach((button) => {
    button.addEventListener("click", function() {
        const parentElement = button.parentElement;

        const clone = parentElement.cloneNode(true);

        clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
            button.remove();
        });

        const text = clone.textContent.trim();

        const input = document.createElement("input");
        input.type = "text";
        input.value = text;

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";

        parentElement.innerHTML = "";
        parentElement.appendChild(input);
        parentElement.appendChild(saveButton);

        input.focus();

        saveButton.addEventListener("click", function() {
            const newValue = input.value;
            parentElement.textContent = newValue;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit_btn");

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete_btn");
            deleteButton.addEventListener('click', function() {
                button.parentElement.remove();
            });

            parentElement.appendChild(editButton);
            parentElement.appendChild(deleteButton);

            editButton.addEventListener("click", editParentText);
        });

    });
});

function editParentText() {
    const parentElement = this.parentElement;

    const clone = parentElement.cloneNode(true);

    clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
        button.remove();
    });

    const text = clone.textContent.trim();

    const input = document.createElement("input");
    input.type = "text";
    input.value = text;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";

    parentElement.innerHTML = "";
    parentElement.appendChild(input);
    parentElement.appendChild(saveButton);

    input.focus();

    saveButton.addEventListener("click", function() {
        const newValue = input.value;
        parentElement.textContent = newValue;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit_btn");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete_btn");
        deleteButton.addEventListener('click', function() {
            deleteButton.parentElement.remove();
        });
        parentElement.appendChild(editButton);
        parentElement.appendChild(deleteButton);
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
    newIngredientInput.type = "text";
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
    const stepInput = document.createElement("input");
    stepInput.type = "text";
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
        targetElement.appendChild(newItem);
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit_btn");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete_btn");
        deleteButton.addEventListener('click', function() {
            deleteButton.parentElement.remove();
        });
        newItem.appendChild(editButton);
        newItem.appendChild(deleteButton);
        editButton.addEventListener("click", editParentText);
    });
    targetElement.appendChild(saveButton);
});
add_step.addEventListener("click", function() {
    const newStepInput = createStepInput(instructions.length);
    const targetElement = document.querySelector('.instructions ol');
    targetElement.appendChild(newStepInput);
});

add_image.addEventListener("click", function() {
    const input = document.querySelector('#image_up');
    const file = input.files[0]; // Access the file from the input element
    if (file) {
        const formData = new FormData(); // Create FormData object to send files
        formData.append('image', file);
        fetch('/upload_image', {
            method: 'POST',
            body: formData // Send FormData instead of JSON
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert('Error uploading Image');
            }
        })
        .then(data => {
            const new_div = document.createElement('div');
            const image_url = data.image_url;
            const newImage = document.createElement('img');
            newImage.src = image_url;
            newImage.classList.add('recipe-image');
            newImage.setAttribute('alt', 'Recipe Image');
            newImage.setAttribute('loading', 'lazy');
            new_div.appendChild(newImage);
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete_btn");
            deleteButton.addEventListener('click', function() {
                deleteButton.parentElement.remove();
            });
            new_div.appendChild(deleteButton);
            document.querySelector('.images').appendChild(new_div);
            input.value = '';
        })
        .catch(error => console.error(error));
    }
});
