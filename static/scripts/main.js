let cardArray = document.querySelectorAll('.card__inner');

cardArray.forEach(function(card) {
    let image = card.querySelector('.recipe-img');
    let closeIcon = card.querySelector('.close-icon'); // Select close icon
    image.addEventListener('click', function(event) {
        card.classList.toggle('is-flipped');
        event.stopPropagation();
    });
    closeIcon.addEventListener('click', function(event) {
        card.classList.remove('is-flipped'); // Flip back the card
        event.stopPropagation();
    });
});
