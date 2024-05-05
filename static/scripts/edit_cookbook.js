const editName_button = document.querySelector('#edit_name');
const remove_buttons = document.querySelectorAll('.remove_btn');
const editStatus_button = document.querySelector('.edit_status');
const editImage_button = document.querySelector('.edit_image');
const save_button = document.querySelector('.save_btn');

const cookbook_img = document.querySelector('.cookbook-img');

let removedIDs = [];

editStatus_button.addEventListener('click', function() {
    const parentElement = editStatus_button.parentElement;
    editStatus_button.remove();
    const text = parentElement.textContent.trim();
    addPrivacyDropdown(parentElement, text);
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", function() {
        saveStatus(parentElement);
    });
    parentElement.appendChild(saveButton);
});

function editStatus(element) {
    const parentElement = element.parentElement;
    element.remove();
    const text = parentElement.textContent.trim();
    addPrivacyDropdown(parentElement, text);
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", function() {
        saveStatus(parentElement);
    });
    parentElement.appendChild(saveButton);
}

function addPrivacyDropdown(parentElement, currentPrivacy) {
    var privacyDropdown = document.createElement("select");
    privacyDropdown.name = "status";
    privacyDropdown.id = "status";

    var optionPublic = document.createElement("option");
    optionPublic.value = "Public";
    optionPublic.text = "Public";
    if (currentPrivacy === "Public") {
        optionPublic.selected = true;
    }
    privacyDropdown.appendChild(optionPublic);
    
    var optionPrivate = document.createElement("option");
    optionPrivate.value = "Private";
    optionPrivate.text = "Private";
    if (currentPrivacy === "Private") {
        optionPrivate.selected = true;
    }
    privacyDropdown.appendChild(optionPrivate);

    parentElement.innerHTML = "";
    parentElement.appendChild(privacyDropdown);
}


function saveStatus(parentElement) {
    const selectedOption = document.getElementById("status").value;
    
    // Convert selected status back to <p> element
    const statusParagraph = document.createElement("p");
    statusParagraph.textContent = selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1); // Capitalize first letter
    statusParagraph.classList.add("cookbook_status");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit_btn", "edit_status");
    editButton.addEventListener("click", function() {
        editStatus(editButton);
    });
    statusParagraph.appendChild(editButton);

    parentElement.innerHTML = ""; // Clear existing content
    parentElement.appendChild(statusParagraph);
}

editName_button.addEventListener("click", function() {
    const parentElement = editName_button.parentElement;

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
        editButton.setAttribute('id', 'edit_name');
        
        parentElement.appendChild(editButton);
        editButton.addEventListener("click", editParentText);
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
        editButton.setAttribute('id', 'edit_name');

        parentElement.appendChild(editButton);
        editButton.addEventListener("click", editParentText);
    });
}

remove_buttons.forEach(button => {
    button.addEventListener('click', function() {
        removedIDs.push(button.parentElement.querySelector('.recipe-id').textContent)
        button.parentElement.remove();
    });
});

editImage_button.addEventListener('click', function() {
    const fileInput = document.createElement("input");
    fileInput.setAttribute('id', 'file_input');
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                cookbook_img.src = reader.result;
            };
        }
    });
    editImage_button.style.display = "none";
    editImage_button.insertAdjacentElement("afterend", fileInput);
});


save_button.addEventListener('click', function() {
    const name_element = document.querySelector('.cookbook_name');
    const status_element = document.querySelector('.cookbook_status');
    const recipe_id_elements = document.querySelectorAll('.recipe-id');
    const cookbook_id = document.querySelector('.cookbook_id').textContent;
    const input = document.querySelector('#file_input');
    var file = '';
    if (input) {
        file = input.files[0];
    } else {
        file = null;
    }
    const name = getText(name_element);
    const status = getText(status_element);
    const formData = new FormData(); 
    formData.append('id', cookbook_id);
    formData.append('name', name);
    formData.append('status', status);
    formData.append('removedRecipes', JSON.stringify(removedIDs));
    formData.append('cover_img', file);
    
    recipe_id_elements.forEach(id => {
        formData.append('recipes[]', id.textContent);
    });
    
    fetch(`/edit_cookbook/${cookbook_id}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            removedIDs = [];
            throw new Error('Failed to update cookbook');
        }
    })
    .then(data => {
        window.location.href = `/cookbook/${cookbook_id}`;
    })
});

function getText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('.edit_btn, .remove_btn').forEach(button => {
        button.remove();
    });
    const text = clone.textContent.trim();
    return text;
}