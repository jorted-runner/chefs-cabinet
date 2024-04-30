const cookBook_DropDown = document.querySelector("#cookbook");

cookBook_DropDown.addEventListener("change", function(event) {
    if (event.target.value == 'new') {
        replaceWithTextInput(event.target);
    }
});

function replaceWithTextInput(selectElement) {
    var inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.name = selectElement.name;
    inputElement.id = selectElement.id;
    inputElement.placeholder = "Enter Cook Book Name";

    // Replace select element with input element
    selectElement.parentNode.replaceChild(inputElement, selectElement);
    inputElement.focus();
}