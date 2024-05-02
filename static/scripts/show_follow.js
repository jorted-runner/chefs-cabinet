const overlay_follow = document.querySelector('.overlay_follow');

const following_btn = document.querySelector('#following');
const following_div = document.querySelector('.following');

const follower_btn = document.querySelector('#followers');
const follower_div = document.querySelector('.followers');

follower_btn.addEventListener('click', function() {
    overlay_follow.style.display = 'block';
    follower_div.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    overlay_follow.addEventListener('click', function() {
        follower_div.classList.add('hidden');
        overlay_follow.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });
});

following_btn.addEventListener('click', function() {
    overlay_follow.style.display = 'block';
    following_div.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    overlay_follow.addEventListener('click', function() {
        following_div.classList.add('hidden');
        overlay_follow.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });
});

