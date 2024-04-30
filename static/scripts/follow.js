const follow_btns = document.querySelectorAll('.follow');
const unFollow_btns = document.querySelectorAll('.un-follow');


if (follow_btns) {
    follow_btns.forEach(follow_btn => {
        follow_btn.addEventListener('click', function() {
            const card = follow_btn.closest('.card__inner');
            const scrollPosition = window.scrollY || window.pageYOffset;
            const parentForm = follow_btn.closest('.front-title-div, .user-intro').querySelector('form');
            const userID = parentForm.querySelector('#userID').value;
            const currentUserID = parentForm.querySelector('#currentUserID').value;            
            const data = {
                userID: userID,
                currentUserID: currentUserID,
            };
            fetch('/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to follow user');
                }
            })
            .then(data => {
                console.log('User followed successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error following user:', error);
            });
            
            window.onload = function() {
                window.scrollTo(0, scrollPosition);
            };
        });
    });
    
}
if (unFollow_btns) {
    unFollow_btns.forEach(unFollow_btn => {
        unFollow_btn.addEventListener('click', function() {
            const scrollPosition = window.scrollY || window.pageYOffset;
            const parentForm = unFollow_btn.closest('.front-title-div, .user-intro').querySelector('form');
            const userID = parentForm.querySelector('#userID').value;
            const currentUserID = parentForm.querySelector('#currentUserID').value;             
            const data = {
                userID: userID,
                currentUserID: currentUserID,
            };
            fetch('/unfollow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to unfollow user');
                }
            })
            .then(data => {
                console.log('User unfollowed successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error unfollowing user:', error);
            });
            window.onload = function() {
                window.scrollTo(0, scrollPosition);
            };
        });
    });    
}
