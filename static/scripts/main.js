const notification_icon = document.querySelector('#notification-icon');
let subscriptSet = false;

function setSubscript() {
    const notifications = document.querySelectorAll('.notification');
    if (notifications.length >= 1 && !subscriptSet) {
        if (notification_icon.querySelector('sub')) {
            notification_icon.querySelector('sub').remove();
        }

        const numNotifications = notifications.length;
        const subElement = document.createElement('sub');
        subElement.classList.add('subscript');
        subElement.textContent = numNotifications;
        notification_icon.appendChild(subElement);

        subscriptSet = true; // Set the flag to true after the subscript is added
    }
}

if (notification_icon) {
    setSubscript();
    notification_icon.addEventListener('click', function() {
        const notifications = document.querySelector('.notifications');
        notifications.classList.toggle('hidden');
        const sub = notification_icon.querySelector('sub');
        if (sub) {
            sub.remove();
            fetch('/mark_read', {
                method: 'POST'
            })
        }
    });
    document.querySelector('.notification-close-icon').addEventListener('click', function() {
        const notifications = document.querySelector('.notifications');
        notifications.classList.toggle('hidden');
    });
}
