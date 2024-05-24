from flask import jsonify

class NotificationHandler:
    def getNewNotifications(self, user, Notification):
        return Notification.query.filter(
            Notification.user_id == user.id,
            Notification.timestamp > user.last_login,
            Notification.is_read != True
        ).order_by(Notification.timestamp.desc()).all()

    def buildNotifications(self, notification_DATA, User, Comment, Review):
        notifications = []
        for notification in notification_DATA:
            notification_type = notification.type
            match notification_type:
                case 'follow':
                    follower = User.query.filter_by(id=notification.related_id).first()
                    notifications.append(f'<div class="notification"><div class="notification-user"><a href="../profile/{follower.id}"><img class="notification-profile-pic" src="{follower.profile_pic}" alt="User Profile Pic"><p>{follower.username}</p></div><p>Followed you.</p></a></div>')
                case 'comment':
                    comment = Comment.query.filter_by(id=notification.related_id).first()
                    commentor = User.query.filter_by(id=comment.user_id).first()
                    commentText = comment.comment
                    if len(commentText) > 50:
                        commentText = commentText[:47] + '... <u>See More</u>'
                    notifications.append(f'<div class="notification"><div class="notification-user"><a href="../profile/{commentor.id}"><img class="notification-profile-pic" src="{commentor.profile_pic}" alt="User Profile Pic"><p>{commentor.username}</p></a></div><p>Commented: <a href="../view_recipe/{comment.recipe_id}">{commentText}</a></p></div>')
                case 'review':
                    review = Review.query.filter_by(id=notification.related_id).first()
                    notifications.append(f'<div class="notification"><div class="notification-user"><a href="../profile/{review.user.id}"><img class="notification-profile-pic" src="{review.user.profile_pic}" alt="User Profile Pic"><p>{review.user.username}</p></a></div><p><a href="../view_recipe/{review.recipe_id}">Gave your recipe a {review.rating} rating... <u>See More</u></p></a></div>')
        return notifications
    
    def markRead(self, current_user, db, User, Notification):
        user = User.query.filter_by(id=current_user.id).first()
        try:
            for notification in self.getNewNotifications(user, Notification):
                notification.is_read = True
                db.session.commit()
            return jsonify({'success': True}), 200
        except Exception as e:
            return jsonify(error=str(e)), 400
        
    def createNotification(self, db, Notification, user_id, type, related_id):
        notification = Notification(
            user_id=user_id,
            type=type,
            related_id=related_id
        )
        db.session.add(notification)
        db.session.commit()
