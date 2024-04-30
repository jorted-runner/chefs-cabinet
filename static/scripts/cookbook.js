const cookBook_DropDown = document.querySelector("#cookbook");
const addCookBook_btn = document.querySelector('.addRecipe-btn');
const cookBookInfo = document.querySelector('.cookBook-Info');
const overlay = document.querySelector('.overlay');
let recipeCards = document.querySelectorAll('.card__inner');

if (recipeCards) {
    recipeCards.forEach(card => {
        card.querySelector('.addRecipe-btn').addEventListener("click", function() {
            card.querySelector('.cookBook-Info').classList.remove('hidden');
            card.querySelector('.overlay').style.display = 'block';
            document.body.classList.add('no-scroll');
        });
        
        card.querySelector('.overlay').addEventListener("click", function() {
            card.querySelector('.cookBook-Info').classList.add('hidden');
            card.querySelector('.overlay').style.display = 'none';
            document.body.classList.remove('no-scroll');
        });
        
        card.querySelector('.cookBook-Info').addEventListener("click", function(event) {
            event.stopPropagation();
        });
    })
    
}

if (cookBook_DropDown) {
    cookBook_DropDown.addEventListener("change", function(event) {
        if (event.target.value == 'new') {
            replaceWithTextInput(event.target);
            addPrivacyDropdown();
        }
    });    
}

addCookBook_btn.addEventListener("click", function() {
    cookBookInfo.classList.remove('hidden');
    overlay.style.display = 'block';
    document.body.classList.add('no-scroll');
});

overlay.addEventListener("click", function() {
    cookBookInfo.classList.add('hidden');
    overlay.style.display = 'none';
    document.body.classList.remove('no-scroll');
});

cookBookInfo.addEventListener("click", function(event) {
    event.stopPropagation();
});


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

    var submitButton = document.querySelector('input[type="submit"]');
    
    submitButton.parentNode.insertBefore(privacyLabel, submitButton);
    submitButton.parentNode.insertBefore(privacyDropdown, submitButton);
}