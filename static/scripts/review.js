const reviewBtn = document.querySelector('#reviewBtn');
const reviewForm = document.querySelector('#reviewForm');
const commentBtn = document.querySelector('#commentBtn');
const commentForm = document.querySelector('#commentForm')

reviewBtn.addEventListener("click", function() {
    reviewForm.classList.remove('hiddenForm');
    reviewBtn.classList.add('hiddenForm');
});

commentBtn.addEventListener('click', function() {
    commentForm.classList.remove('hiddenForm');
    commentBtn.classList.add('hiddenForm');
});