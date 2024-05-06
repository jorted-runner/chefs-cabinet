const editImage_button = document.querySelector('.edit_image');
const userProfilePicture = document.querySelector('.user-profile');
var profilePictureInput = document.querySelector('#profile_pic');

editImage_button.addEventListener('click', function() {
    const fileInput = document.createElement("input");
    fileInput.setAttribute('id', 'file_input');
    fileInput.setAttribute('name', 'file_input')
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                userProfilePicture.src = reader.result;
            };
        }
    });
    editImage_button.style.display = "none";
    editImage_button.insertAdjacentElement("afterend", fileInput);
});