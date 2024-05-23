class constants:
    def __init__(self):
        self.prod_googleRedirectUri = 'https://www.chefs-cabinet.com/callback'
        self.dev_googleRedirectUri = 'http://127.0.0.1:5000/callback'
        self.googleScopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid']
        self.userDefaultProfilePic = 'https://chefs-cabinet.s3.amazonaws.com/profile-placeholder.png'
        self.cookbookDefaultCover = 'https://chefs-cabinet.s3.amazonaws.com/book_image.webp'