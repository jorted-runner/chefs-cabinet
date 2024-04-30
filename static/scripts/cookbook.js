const cookBook_DropDown = document.querySelector("#cookbook");
const addCookBook_btn = document.querySelector('.addRecipe-btn');
const cookBookInfo = document.querySelector('.cookBook-Info');
const overlay = document.querySelector('.overlay');

addCookBook_btn.addEventListener('click', function() {
    cookBookInfo.classList.remove('hidden');
    overlay.style.display = 'block';
    document.body.classList.add('no-scroll');
})

if (cookBook_DropDown) {
    cookBook_DropDown.addEventListener("change", function(event) {
        if (event.target.value == 'new') {
            replaceWithTextInput(event.target);
        }
    });    
}

function replaceWithTextInput(selectElement) {
    var inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.name = selectElement.name;
    inputElement.id = selectElement.id;
    inputElement.placeholder = "Enter Cook Book Name";
    selectElement.parentNode.replaceChild(inputElement, selectElement);
    inputElement.focus();
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
