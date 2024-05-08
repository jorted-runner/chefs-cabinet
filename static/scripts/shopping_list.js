import { getText } from "./utils.js";

const edit_buttons = document.querySelectorAll('.edit_btn');
const remove_buttons = document.querySelectorAll('.remove_btn');
const addItem_buttons = document.querySelectorAll('.addItem_btn');
const addCat_button = document.querySelector('.addCat_btn');

function createListItem(newQuantity, newItem) {
    const li = document.createElement("li");
    li.textContent = `${newQuantity} - ${newItem} `;
    const editBtn = document.createElement("button");
    editBtn.setAttribute("type", "button");
    editBtn.classList.add("edit_btn");
    editBtn.textContent = "Edit";
    editBtn.addEventListener('click', editParentText);
    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("type", "button");
    removeBtn.classList.add("remove_btn");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener('click', function() {
        removeBtn.parentElement.remove();
    });
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    return li;
}

addItem_buttons.forEach(button => {
    button.addEventListener('click', () => {
        const parentElement = button.parentElement;
        const newItem_input = parentElement.querySelector('.new_item');
        const newQuantity_input = parentElement.querySelector('.quantity');
        if (newItem_input.value && newQuantity_input.value) {
            const li = createListItem(newQuantity_input.value, newItem_input.value);
            parentElement.parentElement.querySelector('ul').appendChild(li);
            newItem_input.value = '';
            newQuantity_input.value = '';
        }
    });
});

addCat_button.addEventListener('click', function(event) {
    const newCatName = document.querySelector('.new_cat');
    if (newCatName.value) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('category');
        const h3 = document.createElement('h3');
        h3.textContent = newCatName.value;
        const ul = document.createElement('ul');
        const buttonDiv = document.createElement('div');

        const label_1 = document.createElement('label');
        label_1.setAttribute('for', 'quantity');
        label_1.textContent = 'Quantity: ';
        const input_1 = document.createElement('input');
        input_1.setAttribute('type', 'text');
        input_1.setAttribute('name', 'quantity');
        input_1.classList.add('quantity');
        label_1.appendChild(input_1);
        
        const label_2 = document.createElement('label');
        label_2.setAttribute('for', 'new_item');
        label_2.textContent = 'New Item: ';
        const input_2 = document.createElement('input');
        input_2.setAttribute('type', 'textarea');
        input_2.setAttribute('name', 'new_item');
        input_2.classList.add('new_item');
        label_2.appendChild(input_2);

        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('addItem_btn');
        button.textContent = 'Add Item';
        button.addEventListener('click', function() {
            const parentElement = button.parentElement;
            const newItem_input = parentElement.querySelector('.new_item');
            const newQuantity_input = parentElement.querySelector('.quantity');
            if (newItem_input.value && newQuantity_input.value) {
                const li = createListItem(newQuantity_input.value, newItem_input.value);
                parentElement.parentElement.querySelector('ul').appendChild(li);
                newItem_input.value = '';
                newQuantity_input.value = '';
            }
        });
        buttonDiv.appendChild(label_1);
        buttonDiv.appendChild(label_2);
        buttonDiv.appendChild(button);

        newDiv.appendChild(h3);
        newDiv.appendChild(ul);
        newDiv.appendChild(buttonDiv);
        document.querySelector('.categories').appendChild(newDiv);
        document.querySelector('.categories').appendChild(document.createElement('hr'));
        newCatName.value = '';
    }
});

edit_buttons.forEach((button) => {
    button.addEventListener("click", function() {
        const parentElement = button.parentElement;
        const text = getText(parentElement);
        const textarea = document.createElement("textarea");
        textarea.classList.add('edit_input');
        textarea.value = text;
        const saveButton = document.createElement("button");
        saveButton.textContent = "Done";

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
                deleteButton.textContent = "Remove";
                deleteButton.classList.add("remove_btn");
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
    saveButton.textContent = "Done";

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
            deleteButton.textContent = "Remove";
            deleteButton.classList.add("remove_btn");
            deleteButton.addEventListener('click', function() {
                deleteButton.parentElement.remove();
            });
            parentElement.appendChild(deleteButton);
        }
        editButton.addEventListener("click", editParentText);
    });
}

remove_buttons.forEach((button) => {
    button.addEventListener('click', function() {
        button.parentElement.remove();
    });
});

