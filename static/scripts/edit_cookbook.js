const edit_button = document.querySelector('#edit_name');
const remove_buttons = document.querySelectorAll('.remove_btn');

edit_button.addEventListener("click", function() {
    const parentElement = edit_button.parentElement;

    const clone = parentElement.cloneNode(true);

    clone.querySelectorAll('.edit_btn').forEach(button => {
        button.remove();
    });

    const text = clone.textContent.trim();

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
        editButton.setAttribute('id', 'edit_name');

        
        parentElement.appendChild(editButton);
        editButton.addEventListener("click", editParentText);
    });

});

function editParentText() {
    const parentElement = this.parentElement;

    const clone = parentElement.cloneNode(true);

    clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
        button.remove();
    });

    const text = clone.textContent.trim();

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
        editButton.setAttribute('id', 'edit_name');

        parentElement.appendChild(editButton);
        editButton.addEventListener("click", editParentText);
    });
}
