const loaderContainer = document.querySelector('.loader-container');

const displayLoading = () => {
    loaderContainer.style.display = 'block';
};
const hideLoading = () => {
    loaderContainer.style.display = 'none';
};

document.querySelector('#generate_shopping').addEventListener('click', function() {
    displayLoading();
});