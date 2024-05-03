const cookBook_DropDown = document.querySelector("#cookbook");
const addCookBook_btn = document.querySelector('.addRecipe-btn');
const cookBookInfo = document.querySelector('.cookBook-Info');
const close_btn = document.querySelector('.close-icon');
const add_to_cookbook = document.querySelector('#add_to_cookbook');

if (cookBook_DropDown) {
    cookBook_DropDown.addEventListener("change", function(event) {
        const errorsContainer = document.querySelector('.messages');
        errorsContainer.classList.add('hidden');
        errorsContainer.innerHTML = '';
        if (event.target.value == 'new') {
            replaceWithTextInput(event.target);
            addPrivacyDropdown();
        }
    });    
}

if (addCookBook_btn) {
    addCookBook_btn.addEventListener("click", function() {
        cookBookInfo.classList.remove('hidden');
        cookBookInfo.style.zIndex = '995';
        document.body.classList.add('no-scroll');
    });
}

if (close_btn) {
    close_btn.addEventListener("click", function() {
        cookBookInfo.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        const scrollPosition = window.scrollY || window.pageYOffset;
        window.location.reload();
        window.onload = function() {
            window.scrollTo(0, scrollPosition);
        };
    });
}

if (cookBookInfo) {
    cookBookInfo.addEventListener("click", function(event) {
        event.stopPropagation();
    });
}

function replaceWithTextInput(selectElement) {
    var inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.name = selectElement.name;
    inputElement.id = selectElement.id;
    inputElement.placeholder = "Enter Cook Book Name";
    inputElement.required = true;
    selectElement.parentNode.replaceChild(inputElement, selectElement);
    inputElement.focus();
}

function addPrivacyDropdown() {
    var privacyLabel = document.createElement("label");
    privacyLabel.textContent = "Privacy Level";
    privacyLabel.setAttribute("for", "status");

    var privacyDropdown = document.createElement("select");
    privacyDropdown.name = "status";
    privacyDropdown.id = "status";

    var optionPublic = document.createElement("option");
    optionPublic.value = "public";
    optionPublic.text = "Public";
    privacyDropdown.appendChild(optionPublic);
    
    var optionPrivate = document.createElement("option");
    optionPrivate.value = "private";
    optionPrivate.text = "Private";
    privacyDropdown.appendChild(optionPrivate);

    var submitButton = document.querySelector('button[type="button"]');
    
    submitButton.parentNode.insertBefore(privacyLabel, submitButton);
    submitButton.parentNode.insertBefore(privacyDropdown, submitButton);
}

add_to_cookbook.addEventListener('click', function() {
    const userID = document.querySelector('#userID').value;
    const recipeID = document.querySelector('#recipeID').value;
    var statusElement = document.querySelector('#status');
    var status = '';
    if (statusElement) {
        status = statusElement.value;
    }
    const cookbook = document.querySelector('#cookbook').value;
    const data = {
        userID : userID,
        recipeID : recipeID, 
        status : status,
        cookbook : cookbook
    };
    if (cookbook) {
        fetch('/add_cookbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Replace this with a div that can be open and closed
                const p = document.createElement('p');
                p.textContent = "Recipe Successfully added to Cookbook.";
                document.querySelector('.messages').appendChild(p);
                document.querySelector('.messages').classList.remove('hidden');
                return response.json();
            } else {
                return response.json().then(errorData => {
                    const errorMessage = errorData.error;
                    const p = document.createElement('p');
                    p.textContent = errorMessage;
                    document.querySelector('.messages').appendChild(p);
                    document.querySelector('.messages').classList.remove('hidden');
                });
            }
        })
    }
});