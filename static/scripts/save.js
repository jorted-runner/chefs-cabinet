const saveButton = document.querySelector('.save_btn');

var INSTRUCTIONS = [];
var INGREDIENTS = [];
var IMAGES = [];

saveButton.addEventListener('click', function() {
    const recipe_id = document.querySelector('.recipe_id').textContent;
    const recipe_title = document.querySelector('.title');
    const title_clone = recipe_title.cloneNode(true);
    title_clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
        button.remove();
    });
    const title = title_clone.textContent.trim();
    const recipe_desc = document.querySelector('.desc');
    const desc_clone = recipe_desc.cloneNode(true);
    desc_clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
        button.remove();
    });
    const desc = desc_clone.textContent.trim();

    const instructions = document.querySelectorAll('.step');
    instructions.forEach(step => {
        const clone = step.cloneNode(true);

        clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
            button.remove();
        });
        const text = clone.textContent.trim();
        INSTRUCTIONS.push(text);
    });
    const ingredients = document.querySelectorAll('.item');
    ingredients.forEach(item => {
        const clone = item.cloneNode(true);

        clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
            button.remove();
        });
        const text = clone.textContent.trim();
        INGREDIENTS.push(text);
    });
    const images = document.querySelectorAll('.recipe-image');
    images.forEach(image => {
        IMAGES.push(image.src);
    });
    const recipeData = {
        id: recipe_id,
        title: title,
        desc: desc,
        instructions: JSON.stringify(INSTRUCTIONS),
        ingredients: JSON.stringify(INGREDIENTS),
        images: IMAGES
    };
    fetch('/update_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            IMAGES = [];
            INGREDIENTS = [];
            INSTRUCTIONS = [];
            throw new Error('Failed to save recipe');
        }
    })
    .then(data => {
        console.log('Recipe saved successfully');
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Error saving recipe:', error);
    });
});
