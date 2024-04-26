document.querySelectorAll('.card__inner, .recipe').forEach(function(card) {
  card.setAttribute('data-slide-index', 1);
  showSlides(card, 1);
});

function plusSlides(card, n) {
  let slideIndex = parseInt(card.getAttribute('data-slide-index'));
  slideIndex += n;
  showSlides(card, slideIndex);
}

function currentSlide(card, n) {
  showSlides(card, n);
}

function showSlides(card, n) {
  let slides = card.querySelectorAll(".mySlides");
  let dots = card.querySelectorAll(".dot");

  if (slides.length === 0 || dots.length === 0) {
      return;
  }

  if (n > slides.length) {
      n = 1;
  }
  if (n < 1) {
      n = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("activeSlide");
  }

  if (slides.length === 1) {
    for (let i = 0; i < dots.length; i++) {
      dots[i].style.display = "none";
    }
    card.querySelector('.prev').style.display = 'none';
    card.querySelector('.next').style.display = 'none';
    card.querySelector('.numbertext').style.display = 'none';
  }

  slides[n - 1].style.display = "block";
  dots[n - 1].classList.add("activeSlide");

  card.setAttribute('data-slide-index', n);
}
