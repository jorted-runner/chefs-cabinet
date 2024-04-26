document.getElementById('image_up').addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var img = new Image();
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

document.querySelector('.add_image_btn').addEventListener('click', function() {
    const input = document.querySelector('#image_up');
    const file = input.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
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

