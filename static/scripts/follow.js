const follow_btn = document.querySelector('.follow');
const unFollow_btn = document.querySelector('.un-follow');
const userID = document.querySelector('#userID').value;
const currentUserID = document.querySelector('#currentUserID').value

if (follow_btn) {
    follow_btn.addEventListener('click', function() {
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
            window.location.href = `/profile/${userID}`
        })
        .catch(error => {
            console.error('Error following user:', error);
        });
    });
}
if (unFollow_btn) {
    unFollow_btn.addEventListener('click', function() {
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
            window.location.href = `/profile/${userID}`
        })
        .catch(error => {
            console.error('Error unfollowing user:', error);
        });
    });
}
