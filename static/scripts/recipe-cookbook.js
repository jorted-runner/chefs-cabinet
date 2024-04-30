const recipe_btn = document.querySelector('#recipes');
const cookbooks_btn = document.querySelector('#cookbooks');

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


