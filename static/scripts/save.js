const saveButton = document.querySelector('.save_btn');
const instructions = document.querySelectorAll('.step');
const ingredients = document.querySelectorAll('.item');

var INSTRUCTIONS = [];
var INGREDIENTS = [];

saveButton.addEventListener('click', function() {
    ingredients.forEach(item => {
        const clone = item.cloneNode(true);
        clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
            button.remove();
        });
        const text = clone.textContent.trim();
        INGREDIENTS.push(text);
    });
    instructions.forEach(step => {
        const clone = step.cloneNode(true);
        clone.querySelectorAll('.edit_btn, .delete_btn').forEach(button => {
            button.remove();
        });
        const text = clone.textContent.trim();
        INSTRUCTIONS.push(text);
    });
    console.log(INGREDIENTS);
    console.log(INSTRUCTIONS);
});