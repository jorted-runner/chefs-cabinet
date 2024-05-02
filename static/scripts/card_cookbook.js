let recipeCards = document.querySelectorAll('.card');

if (recipeCards) {
    recipeCards.forEach(card => {
        if (card.querySelector("#cookbook")) {
            card.querySelector("#cookbook").addEventListener("change", function(event) {
                const errorsContainer = card.querySelector('.errors');
                errorsContainer.classList.add('hidden');
                errorsContainer.innerHTML = '';
                if (event.target.value == 'new') {
                    replaceWithTextInput(event.target);
                    addPrivacyDropdown(card);
                }
            });    
        }
        card.querySelector('#add_to_cookbook').addEventListener('click', function() {
            const userID = card.querySelector('#userID').value;
            const recipeID = card.querySelector('#recipeID').value;
            var statusElement = card.querySelector('#status');
            var status = '';
            if (statusElement) {
                status = statusElement.value;
            }
            const cookbook = card.querySelector('#cookbook').value;
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
                        alert('Successfully added to Cookbook');
                        let cookBookInfo = card.querySelector('.cookBook-Info');
                        cookBookInfo.classList.add('hidden');
                        document.body.classList.remove('no-scroll');
                        return response.json();
                    } else {
                        return response.json().then(errorData => {
                            const errorMessage = errorData.error;
                            const p = document.createElement('p');
                            p.textContent = errorMessage;
                            card.querySelector('.errors').appendChild(p);
                            card.querySelector('.errors').classList.remove('hidden');
                        });
                    }
                })
            }
        });
    });    

    document.addEventListener("click", function(event) {
        let target = event.target;
        recipeCards.forEach(card => {
            let cookBookInfo = card.querySelector('.cookBook-Info');
            if (target === card.querySelector('.addRecipe-btn')) {
                cookBookInfo.classList.remove('hidden');
            }
        });
    });

    document.addEventListener("click", function(event) {
        let target = event.target;
        if (target.classList.contains('close-icon')) {
            let card = target.closest('.card');
            let cookBookInfo = card.querySelector('.cookBook-Info');
            cookBookInfo.classList.add('hidden');
        }
    });

    document.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    function addPrivacyDropdown(card) {
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

        var submitButton = card.querySelector('button[type="button"]');
        
        submitButton.parentNode.insertBefore(privacyLabel, submitButton);
        submitButton.parentNode.insertBefore(privacyDropdown, submitButton);
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
}
