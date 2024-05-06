let recipeCards = document.querySelectorAll('.card');
const delete_button = document.querySelector('.delete_btn');


if (delete_button) {
    const current_userID = document.querySelector('.current_user_id').textContent;
    const cookbook_id = document.querySelector('.cookbook_id').textContent;
    delete_button.addEventListener('click', function() {
        const formData = new FormData(); 
        formData.append('id', cookbook_id);
        fetch('/delete_cookbook', {
            method: 'POST', 
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to delete cookbook');
            }
        })
        .then(data => {
            window.location.href = `/profile/${current_userID}`;
        })
        .catch(error => {
            console.error('There was an error deleting the cookbook:', error);
        });
    });
}

if (recipeCards) {
    recipeCards.forEach(card => {
        if (card.querySelector("#cookbook")) {
            card.querySelector("#cookbook").addEventListener("change", function(event) {
                const errorsContainer = card.querySelector('.messages');
                if (errorsContainer) {
                    errorsContainer.classList.add('hidden');
                    errorsContainer.innerHTML = '';
                }
                if (event.target.value == 'new') {
                    replaceWithTextInput(event.target);
                    addPrivacyDropdown(card);
                }
            });    
        }
        card.querySelector('#add_to_cookbook').addEventListener('click', function(event) {
            const userID = card.querySelector('#userID').value;
            const recipeID = card.querySelector('#recipeID').value;
            var statusElement = card.querySelector('#status');
            var status = '';
            if (statusElement) {
                status = statusElement.value;
            }
            const cookbook = card.querySelector('#cookbook').value;
            const data = {
                userID: userID,
                recipeID: recipeID,
                status: status,
                cookbook: cookbook
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
                            const p = document.createElement('p');
                            p.textContent = "Recipe Successfully added to Cookbook.";
                            card.querySelector('.messages').appendChild(p);
                            card.querySelector('.messages').classList.remove('hidden');
                            return response.json();
                        } else {
                            return response.json().then(errorData => {
                                const errorMessage = errorData.error;
                                const p = document.createElement('p');
                                p.textContent = errorMessage;
                                card.querySelector('.messages').appendChild(p);
                                card.querySelector('.messages').classList.remove('hidden');
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
        if (target.classList.contains('card-close')) {
            let card = target.closest('.card');
            let cookBookInfo = card.querySelector('.cookBook-Info');
            cookBookInfo.classList.add('hidden');
            const scrollPosition = window.scrollY || window.pageYOffset;
            window.location.reload();
            window.onload = function() {
                window.scrollTo(0, scrollPosition);
            };
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
