from flask import jsonify

class NotificationHandler:
    def __init__(self):
        pass
        
    def buildNotifications(self, notification_DATA, User, Comment, Review):
        notifications = []
        for notification in notification_DATA:
            if notification.type == 'follow':
                follower = User.query.filter_by(id=notification.related_id).first()
                if follower:
                    notifications.append(f'<div class="notification"><div class="notification-user"><a href="../profile/{follower.id}"><img class="notification-profile-pic" src="{follower.profile_pic}" alt="User Profile Pic"><p>{follower.username}</p></div><p>Followed you.</p></a></div>')
                else:
                    notifications.append('<div><p>Error with displaying new follower</p></div>')
            elif notification.type == 'comment':
                comment = Comment.query.filter_by(id=notification.related_id).first()
                if comment:
                    commentor = User.query.filter_by(id=comment.user_id).first()
                    commentText = comment.comment
                    if len(commentText) > 50:
                        commentText = commentText[:47] + '... <u>See More</u>'
                    notifications.append(f'<div class="notification"><div class="notification-user"><a href="../profile/{commentor.id}"><img class="notification-profile-pic" src="{commentor.profile_pic}" alt="User Profile Pic"><p>{commentor.username}</p></a></div><p>Commented: <a href="../view_recipe/{comment.recipe_id}">{commentText}</a></p></div>')
            elif notification.type == 'review':
                review = Review.query.filter_by(id=notification.related_id).first()
                if review:
                    notifications.append(f'<div class="notification"><div class="notification-user"><a href="../profile/{review.user.id}"><img class="notification-profile-pic" src="{review.user.profile_pic}" alt="User Profile Pic"><p>{review.user.username}</p></a></div><p><a href="../view_recipe/{review.recipe_id}">Gave your recipe a {review.rating} rating... <u>See More</u></p></a></div>')
        return notifications
    
    def markRead(self, current_user, db, User, Notification):
        user = User.query.filter_by(id=current_user.id).first()
        try:
            for notification in Notification.query.filter(
                    Notification.user_id == user.id,
                    Notification.timestamp > user.last_login,
                    Notification.is_read != True
                ).order_by(Notification.timestamp.desc()).all():
                notification.is_read = True
                db.session.commit()
            return jsonify({'success': True}), 200
        except Exception as e:
            return jsonify(error=str(e)), 400
