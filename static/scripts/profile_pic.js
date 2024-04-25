document.getElementById('image_up').addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            // Display the original image and selection box after the image is loaded
            document.getElementById('image_preview').src = img.src;
            document.getElementById('image_preview').style.display = 'block';
            document.getElementById('selection_box').style.display = 'block';

            // Adjust selection box position to center it in the image
            var imagePreview = document.getElementById('image_preview');
            var selectionBox = document.getElementById('selection_box');
            var container = document.getElementById('image_preview_container');

            var initialLeft = (imagePreview.offsetWidth - selectionBox.offsetWidth) / 2;
            var initialTop = (imagePreview.offsetHeight - selectionBox.offsetHeight) / 2;

            selectionBox.style.left = initialLeft + 'px';
            selectionBox.style.top = initialTop + 'px';

            // Add overlay to cover area outside the selection box
            var text_warning = document.createElement('p');
            text_warning.textContent = 'Your profile picture will be whatever is inside the red square. Position it where ever you would like on the image.';
            text_warning.style.textDecoration = 'underline';
            container.insertBefore(text_warning, container.firstChild);

            // Handle selection box movement
            var isDragging = false;
            var offsetX, offsetY;

            selectionBox.addEventListener('mousedown', function(e) {
                isDragging = true;
                offsetX = e.clientX - selectionBox.offsetLeft;
                offsetY = e.clientY - selectionBox.offsetTop;
            });

            container.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    var newX = e.clientX - offsetX;
                    var newY = e.clientY - offsetY;

                    newX = Math.max(0, Math.min(imagePreview.width - selectionBox.offsetWidth, newX));
                    newY = Math.max(0, Math.min(imagePreview.height - selectionBox.offsetHeight, newY));

                    selectionBox.style.left = newX + 'px';
                    selectionBox.style.top = newY + 'px';
                }
            });

            container.addEventListener('mouseup', function() {
                isDragging = false;
            });
        };
    };

    reader.readAsDataURL(file);
});

document.querySelector('.add_image_btn').addEventListener('click', function() {
    const input = document.querySelector('#image_up');
    const file = input.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        // Get coordinates of the selection box
        var selectionBox = document.getElementById('selection_box');
        var x = parseInt(selectionBox.style.left);
        var y = parseInt(selectionBox.style.top);
        var width = selectionBox.offsetWidth;
        var height = selectionBox.offsetHeight;

        // Append coordinates to FormData
        formData.append('x', x);
        formData.append('y', y);
        formData.append('width', width);
        formData.append('height', height);

        fetch('/upload_profile_pic', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert('Error uploading Image');
            }
        })
        .then(data => {
            document.querySelector('.user-profile').src = data.image_url;
            const form = document.querySelector('.form');
            const hiddenIMG = document.createElement('input');
            hiddenIMG.setAttribute('type', 'hidden');
            hiddenIMG.setAttribute('name', 'image_url');
            hiddenIMG.setAttribute('value', data.image_url);
            form.appendChild(hiddenIMG);
        })
        .catch(error => console.error(error));
    }
});

