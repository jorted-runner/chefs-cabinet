let cardContainer = document.querySelector('.recipe_feed');

cardContainer.addEventListener('click', function(event) {
   if (event.target.classList.contains('recipe-img')) {
        let card = event.target.closest('.card__inner');
        card.classList.toggle('is-flipped');
    }

    if (event.target.classList.contains('close-icon')) {
        let card = event.target.closest('.card__inner');
        card.classList.remove('is-flipped');
    }
});
