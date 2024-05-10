const recipe_btn = document.querySelector('#recipes');
const cookbooks_btn = document.querySelector('#cookbooks');
const shopping_list = document.querySelector('#shopping_list');
const edit_button = document.querySelector('#edit_list');

if (cookbooks_btn) {
    cookbooks_btn.addEventListener('click', function() {
        document.querySelector('.cookbook_feed').classList.remove('hidden');
        document.querySelector('.recipe_feed').classList.add('hidden');
    });
}

if (recipe_btn) {
    recipe_btn.addEventListener('click', function() {
        document.querySelector('.cookbook_feed').classList.add('hidden');
        document.querySelector('.recipe_feed').classList.remove('hidden');
    });
}

if (shopping_list) {
    shopping_list.addEventListener('click', function() {
        window.location.href = '/shopping_list';
    });
}

if (edit_button) {
    edit_button.addEventListener('click', function() {
        window.location.href = '/edit_list';
    });
}

