from flask import Flask, render_template, redirect, url_for, request, jsonify, abort, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
from flask_bootstrap import Bootstrap

from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

from google_auth_oauthlib.flow import Flow

from dotenv import load_dotenv
from functools import wraps
from sqlalchemy import func
from datetime import datetime
from sqlalchemy import and_

import json
import os
import traceback
import requests

from ai_interface import AI_tool
from image_processing import Image_Processing
from data_validation import Data_Validation
from constants import constants
from notification import NotificationHandler

from config import Config
configCLASS = Config()

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chefs_db_3.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = '.\\static\\images'
db = SQLAlchemy(app)
Bootstrap(app)

RECIPE_AI = AI_tool()
IMAGE_PROCESSOR = Image_Processing()
VALIDATOR = Data_Validation()
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
CONSTANTS = constants()
NOTIFICATION = NotificationHandler()

client_secrets_file = os.environ.get('SECRET_FILE_PATH')
if os.environ.get('PROD') == 'False':
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=CONSTANTS.googleScopes,
        redirect_uri=CONSTANTS.dev_googleRedirectUri
    )
else:
    flow = Flow.from_client_secrets_file(
        client_secrets_file=client_secrets_file,
        scopes=CONSTANTS.googleScopes,
        redirect_uri=CONSTANTS.prod_googleRedirectUri
    )

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # e.g., 'follow', 'comment', 'review'
    related_id = db.Column(db.Integer, nullable=False)  # ID of the related entity (Follower, Comment, Review)
    timestamp = db.Column(db.DateTime, default=datetime.now, nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    user = db.relationship('User', backref='notifications')

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(100), nullable=False)
    lname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(250), unique=True, nullable=False)
    username = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=True)
    google_id = db.Column(db.String(250), unique=True, nullable=True)
    sign_up_date = db.Column(db.DateTime, default=datetime.now)
    last_login = db.Column(db.DateTime, default=datetime.now, nullable=True)
    profile_pic = db.Column(db.Text, nullable=True, default=CONSTANTS.userDefaultProfilePic)
    shopping_list = db.relationship("ShoppingList", uselist=False, backref='user')
    recipes = db.relationship("Recipe", backref='user')
    cookbooks = db.relationship("CookBook", backref='user')
    comments = db.relationship("Comment", backref='user')
    reviews = db.relationship("Review", backref='user')
    following = db.relationship('Follower', foreign_keys='Follower.follower_id', backref='follower')
    followers = db.relationship('Follower', foreign_keys='Follower.following_id', backref='following')

class Follower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    following_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    posted = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comments = db.relationship("Comment", backref='recipe', cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='recipe', cascade="all, delete-orphan")
    media = db.relationship('RecipeMedia', backref='recipe', cascade="all, delete-orphan")

cookbook_recipes = db.Table(
    'cookbook_recipes',
    db.Column('cookbook_id', db.Integer, db.ForeignKey('cook_book.id'), primary_key=True),
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id'), primary_key=True)
)

class CookBook(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    status = db.Column(db.Boolean, nullable=False, default=True)
    cover_img = db.Column(db.Text, nullable=True, default=CONSTANTS.cookbookDefaultCover)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    last_modified = db.Column(db.DateTime, default=datetime.now)
    recipes = db.relationship("Recipe", secondary=cookbook_recipes, backref='cookbooks')

class ShoppingList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.now)
    shopping_list = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

class RecipeMedia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    img_url = db.Column(db.Text, nullable=False)
    user_upload = db.Column(db.Boolean, nullable=False, default=False)
    display_order = db.Column(db.Integer, nullable=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=False)
    commented = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    review = db.Column(db.Text, nullable=False)
    rating = db.Column(db.String(5), nullable=False)
    reviewed = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)

login_manager = LoginManager()
login_manager.init_app(app)

with app.app_context():
    db.create_all()

def admin_only(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        admin_email = os.environ.get("ADMIN_EMAIL")
        admin_username = os.environ.get("ADMIN_USERNAME")
        if current_user.email != admin_email or current_user.username != admin_username:
            return abort(403)
        return f(*args, **kwargs)
    return decorated_function

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.template_filter('custom_split')
def custom_split(list):
    clean_data = json.loads(list)
    return clean_data

@app.template_filter('parse_to_json')
def parse_to_json(data):
    return json.loads(data)

@app.template_filter('followers_ids')
def followers_ids(followers):
    return [follower.follower_id for follower in followers]

@app.template_filter('get_follower_data')
def get_follower_data(followers):
    user_ids = [follower.follower_id for follower in followers]
    followers_data = User.query.filter(User.id.in_(user_ids)).all()
    return followers_data

@app.template_filter('get_following_data')
def get_following_data(followers):
    user_ids = [follower.following_id for follower in followers]
    following_data = User.query.filter(User.id.in_(user_ids)).all()
    return following_data   

@app.template_filter('avg_rating')
def avg_rating(list):
    total = 0
    for rating in list:
        total += len(rating.rating)
    avg_length = total / len(list)
    avg_rating_string = '⭐' * int(avg_length)
    return avg_rating_string

@app.template_filter('date_sort')
def date_sort(cookbooks):
    sorted_cookbooks = sorted(cookbooks, key=lambda x: x.last_modified, reverse=True)
    return sorted_cookbooks

@app.template_filter('get_notifications_since_last_login')
def get_notifications_since_last_login(user_id):
    user = User.query.filter_by(id=user_id).first()
    notification_DATA = Notification.query.filter(
        Notification.user_id == user.id,
        Notification.timestamp > user.last_login,
        Notification.is_read != True
    ).order_by(Notification.timestamp.desc()).all()
    if notification_DATA:
        return NOTIFICATION.buildNotifications(notification_DATA, User, Comment, Review)
    else:
        return ['<div><p>No new notifications</p></div>']

@app.route('/mark_read', methods=['POST'])
def mark_as_read():
    return NOTIFICATION.markRead(current_user, db, User, Notification)

def update_last_login(user):
    user.last_login = datetime.now()
    db.session.commit()

@app.route("/")
def home():
    if current_user.is_authenticated and current_user.following:
        following_ids = [follower.following_id for follower in current_user.following]
        all_recipes = Recipe.query.filter(or_(Recipe.user_id == current_user.id, Recipe.user_id.in_(following_ids))).all()
    else:
        all_recipes = Recipe.query.all()
    return render_template('index.html', all_recipes=reversed(all_recipes), current_user=current_user)

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email_or_username = VALIDATOR.clean_input(request.form.get('email'))
        password = VALIDATOR.clean_input(request.form.get('password'))
        user = User.query.filter(or_(User.email == email_or_username, User.username == email_or_username)).first()
        if user:
            if user.google_id:
                flash("You have registered with Google. Please log in using Google.")
                return redirect(url_for('login'))
            else:
                if check_password_hash(user.password, password):
                    login_user(user)
                    return redirect(url_for('home'))
                else:
                    flash("Incorrect Password, try again!")
                    return render_template("login.html", current_user=current_user)
        else:
            flash("No user associated with that email or username, try <a href='" + url_for('register') + "'>registering</a>!")
            return redirect(url_for('login'))
    else:
        return render_template("login.html", current_user=current_user)

@app.route('/google-login')
def google_login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route('/callback')
def google_auth_callback():
    if "state" not in session or session["state"] != request.args.get("state"):
        abort(500)
    flow.fetch_token(authorization_response=request.url)
    try:
        resp = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers={'Authorization': f'Bearer {flow.credentials.token}'})
        resp.raise_for_status()
        user_info = resp.json()
    except requests.RequestException as e:
        flash("Failed to authenticate with Google. Please try again later.")
        return redirect(url_for('login'))

    user = User.query.filter_by(google_id=user_info['sub']).first()
    if user:
        login_user(user)
        return redirect(url_for('home'))
    else:
        return handle_new_google_user(user_info)

@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        if User.query.filter_by(email=request.form.get('email')).first():
            flash("You've already signed up with that email, <a href='" + url_for('login') + "'>log in</a> instead!")
            return redirect(url_for('register'))
        elif User.query.filter_by(username=request.form.get('username')).first():
            flash("User with username " + request.form.get('username') + " already exists. Try again.")
            return redirect(url_for('register'))
        elif request.form.get('username') == request.form.get('email'):
            flash('Username and Email cannot match. Please choose a unique username.')
            return redirect(url_for('register'))
        new_user_fName = VALIDATOR.clean_input(request.form.get('fname'))
        new_user_lName = VALIDATOR.clean_input(request.form.get('lname'))
        new_user_email = VALIDATOR.clean_input(request.form.get('email'))
        new_user_username = VALIDATOR.clean_input(request.form.get('username'))
        new_user_password = generate_password_hash(request.form.get('password'), method='pbkdf2:sha256', salt_length=8)
        new_user = User(email = new_user_email, username = new_user_username, password = new_user_password, fname = new_user_fName, lname = new_user_lName)        
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for("home"))
    else:
        return render_template("register.html", current_user=current_user)

def handle_new_google_user(user_info):
    try:
        new_user_fName = user_info.get("name").split(" ")[0]
        new_user_lName = user_info.get("name").split(" ")[1]
    except:
        new_user_fName = user_info.get("name").split(" ")[0]
        new_user_lName = " "
    new_user_email = user_info.get('email')
    new_user_username = user_info.get('email').split('@')[0]
    new_user_google_id = user_info.get("sub")
    profile_picture_url = user_info.get("picture")
    temp = IMAGE_PROCESSOR.download_image(profile_picture_url)
    temp_profile_pic_file = IMAGE_PROCESSOR.upload_profile(temp)
    new_user_profile_pic = temp_profile_pic_file
    new_user = User(email = new_user_email, username = new_user_username, fname = new_user_fName, lname = new_user_lName, profile_pic = new_user_profile_pic, google_id = new_user_google_id)
    db.session.add(new_user)
    db.session.commit()
    login_user(new_user)
    return redirect(url_for("home"))

@app.route("/new-recipe")
@login_required
def new_recipe():
    return render_template('new-recipe.html', current_user=current_user)

@app.route("/save_recipe", methods=["POST"])
@login_required
def save_recipe():
    if request.method == "POST":
        recipe_title = VALIDATOR.clean_input(request.form.get("title"))
        recipe_images = request.form.getlist("image_url")
        recipe_desc = VALIDATOR.clean_input(request.form.get("desc"))
        ingredients = json.dumps([VALIDATOR.clean_input(item) for item in custom_split(request.form.get("ingredients"))])
        instructions = json.dumps([VALIDATOR.clean_input(item) for item in custom_split(request.form.get("instructions"))])
        new_recipe = Recipe(
            title=recipe_title,
            description=recipe_desc,
            ingredients=ingredients,
            instructions=instructions,
            user_id=current_user.id
        )
        db.session.add(new_recipe)
        db.session.commit()
        for image in recipe_images:
            file_name = IMAGE_PROCESSOR.download_image(image)
            image_url = IMAGE_PROCESSOR.upload_file(file_name)
            new_media = RecipeMedia(img_url=image_url, recipe_id=new_recipe.id, user_upload=False)
            db.session.add(new_media)
        db.session.commit()
    return redirect(url_for("home"))

@app.route("/generate_images", methods=["POST"])
@login_required
def generate_images():
    try:
        data = request.get_json()
        title = VALIDATOR.clean_input(data['title'])
        description = data['description']
        ingredients = data['ingredients']
        prompt = f"{title}. {description}. {ingredients}"
        image_urls = RECIPE_AI.image_generation(prompt)
        return jsonify(images=image_urls)
    except Exception as e:
        app.logger.error(f"Error in generate Images route: {e}")
        return jsonify(error=str(e)), 400
    
@app.route("/generate_recipe", methods=["POST"])
@login_required
def generate_recipe():
    try:
        data = request.get_json()
        includeIngredients = VALIDATOR.clean_input(data['includeIngredients'])
        excludeIngredients = VALIDATOR.clean_input(data['excludeIngredients'])
        recipe = RECIPE_AI.recipe_generation(includeIngredients, excludeIngredients)
        return jsonify(recipe=recipe)
    except Exception as e:
        app.logger.error(f"Error in generate recipe route: {e}")
        return jsonify(error=str(e)), 400

@app.route("/delete-recipe/<recipe_id>/<int:userID>", methods=["GET", "POST"])
@login_required
def delete_recipe(recipe_id, userID):
    recipe_to_delete = Recipe.query.filter_by(id=recipe_id).first()
    if userID == recipe_to_delete.user.id:
        db.session.delete(recipe_to_delete)
        db.session.commit()
    return redirect(url_for('home'))

@app.route('/profile/<userID>', methods=['GET'])
@login_required
def user_profile(userID):
    user = User.query.filter_by(id=userID).first()
    user_recipes = Recipe.query.filter_by(user_id=userID).all()
    return render_template('profileHome.html', all_recipes=reversed(user_recipes), user=user, current_user=current_user)

@app.route('/edit_profile/<userID>', methods=['POST', 'GET'])
@login_required
def edit_profile(userID):
    if current_user.id == int(userID):
        user = User.query.filter_by(id=userID).first()
        if request.method == "POST":
            updated_Fname = VALIDATOR.clean_input(request.form.get('fname'))
            updated_lName = VALIDATOR.clean_input(request.form.get('lname'))
            updated_username = VALIDATOR.clean_input(request.form.get('username'))
            if user.username != updated_username and User.query.filter_by(username=updated_username).first():
                flash("User with username " + updated_username + " already exists. Try again.")
                return render_template("edit_profile.html", user=user, current_user=current_user)
            if user.email == updated_username:
                flash('Username and Email cannot match. Please choose a unique username.')
                return render_template("edit_profile.html", user=user, current_user=current_user)
            user.username = updated_username
            user.fname = updated_Fname
            user.lname = updated_lName
            updated_profile = request.files.get('file_input')
            if updated_profile:
                file_name = IMAGE_PROCESSOR.download_userIMG(file=updated_profile)
                updated_profile_url = IMAGE_PROCESSOR.upload_profile(file_name)
                user.profile_pic = updated_profile_url
            db.session.commit()
            return redirect(url_for('user_profile', userID=userID))
        return render_template("edit_profile.html", user=user, current_user=current_user)
    else:
        return redirect(url_for('home'))

@app.route('/edit_recipe/<recipeID>/<int:userID>', methods=['POST', 'GET'])
@login_required
def edit_recipe(recipeID, userID):
    recipe = Recipe.query.filter_by(id=recipeID).first()
    if userID != recipe.user.id:
        flash('You do not own that recipe. You cannot edit it.')
        return redirect(url_for('home'))
    else:
        return render_template('edit_recipe.html', recipe=recipe, current_user=current_user)

@app.route('/search', methods=['POST', 'GET'])
@login_required
def search():
    if request.method == 'POST':
        searchTerm = VALIDATOR.clean_input(request.form.get('searchTerm')).strip()
        searchwords = searchTerm.split(' ')
        users_results = []
        recipes_results = []
        cookbook_results = []
        for word in searchwords:
            users = User.query.filter(
                User.username.like(f"%{word.strip()}%") | 
                User.fname.like(f"%{word.strip()}%") | 
                User.lname.like(f"%{word.strip()}%")
            ).all()
            users_results.extend(users)
            recipes = Recipe.query.filter(
                Recipe.title.like(f"%{word.strip()}%") | 
                Recipe.description.like(f"%{word.strip()}%") | 
                Recipe.ingredients.like(f"%{word.strip()}%")
            ).all()
            recipes_results.extend(recipes)
            if word.lower() == "cookbook" or word.lower() == "books" or word.lower() == 'cook' or word.lower() == 'book':
                cookbooks = CookBook.query.filter()
            else:
                cookbooks = CookBook.query.filter(
                    (CookBook.name.like(f"%{word}%")) &
                    ((CookBook.status.is_(None)) | (CookBook.status != False) | (CookBook.user_id == current_user.id))
                )
            cookbook_results.extend(cookbooks)
        return render_template('searchResults.html', 
                               users=users_results, 
                               recipes=recipes_results, 
                               searchTerm=searchTerm,
                               cookbooks=cookbook_results, 
                               current_user=current_user)
    following_ids = [follower.following_id for follower in current_user.following]
    all_recipes = Recipe.query.filter(
        (Recipe.user_id != current_user.id) &
        (~Recipe.user_id.in_(following_ids))
    ).order_by(func.random()).limit(100).all()

    return render_template('searchResults.html', random_recipes=all_recipes, current_user=current_user)

@app.route('/comment/<userID>/<recipeID>', methods=['POST'])
@login_required
def comment(userID, recipeID):
    comment = VALIDATOR.clean_input(request.form.get('comment'))
    new_comment = Comment(comment=comment,
                          user_id=int(userID),
                          recipe_id = int(recipeID))
    db.session.add(new_comment)
    db.session.commit()
    recipe = Recipe.query.filter_by(id = recipeID).first()
    NOTIFICATION.createNotification(db, Notification, recipe.user_id, 'comment', new_comment.id)
    
    return redirect(url_for('view_recipe', recipeID=recipeID) + '#commentDiv')

@app.route('/review/<userID>/<recipeID>', methods=['POST'])
@login_required
def review(userID, recipeID):
    review = VALIDATOR.clean_input(request.form.get('review'))
    rating = request.form.get('rating')
    new_review = Review(review=review,
                        rating=rating,
                        user_id=int(userID),
                        recipe_id=int(recipeID))
    db.session.add(new_review)
    db.session.commit()
    recipe = Recipe.query.filter_by(id = recipeID).first()
    NOTIFICATION.createNotification(db, Notification, recipe.user_id, 'review', new_review.id)
    return redirect(url_for('view_recipe', recipeID=recipeID)+ '#reviewDiv')

@app.route('/view_recipe/<recipeID>', methods=['GET', 'POST'])
def view_recipe(recipeID):
    recipe = Recipe.query.filter_by(id=recipeID).first()
    return render_template('viewRecipe.html', recipe=recipe, current_user = current_user)

@app.route('/update_recipe', methods=['POST'])
def update_recipe():
    if request.method == "POST":
        try:
            recipe_id = VALIDATOR.clean_input(request.form.get("id"))
            recipe_title = VALIDATOR.clean_input(request.form.get("title"))
            recipe_desc = VALIDATOR.clean_input(request.form.get("desc"))
            ingredients = json.dumps([VALIDATOR.clean_input(item) for item in custom_split(request.form.get("ingredients"))])
            instructions = json.dumps([VALIDATOR.clean_input(item) for item in custom_split(request.form.get("instructions"))])
            removedRecipe_URLs = custom_split(request.form.get('removed_images'))
            user_uploads = ''
            try:
                user_uploads = request.files.getlist('userUploads')
            finally:
                recipe = Recipe.query.filter_by(id=recipe_id).first()
                if user_uploads:
                    for user_file in user_uploads:
                        file_name = IMAGE_PROCESSOR.download_userIMG(file=user_file)
                        recipe_img = IMAGE_PROCESSOR.upload_file(file_name)
                        new_image = RecipeMedia(img_url=recipe_img, recipe_id=recipe.id, user_upload=True)
                        db.session.add(new_image)
                if removedRecipe_URLs:
                    for url in removedRecipe_URLs:
                        image = RecipeMedia.query.filter_by(img_url=url, recipe_id=recipe_id).first()
                        db.session.delete(image)
                        db.session.commit()
                if recipe_title != '':
                    recipe.title = recipe_title
                if recipe_desc != '':
                    recipe.description = recipe_desc
                recipe.ingredients = ingredients
                recipe.instructions = instructions
                db.session.commit()
                return jsonify({'success': True}), 200
        except Exception as e:
            db.session.rollback()
            traceback.print_exc()
            return jsonify({'success': False, 'message': 'Internal server error: ' + str(e)}), 500
    else:
        return jsonify({'success': False, 'message': 'Invalid request method'}), 405

@app.route('/follow', methods=['POST'])
@login_required
def follow():
    try:
        data = request.get_json()
        userID = data.get('userID')
        currentUserID = data.get('currentUserID')
        if not userID or not currentUserID:
            return jsonify({'error': 'Missing userID or currentUserID'}), 400
        new_following = Follower(follower_id=currentUserID, following_id=userID)
        db.session.add(new_following)
        db.session.commit()
        NOTIFICATION.createNotification(db, Notification, userID, 'follow', current_user.id)
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/unfollow', methods=['POST'])
@login_required
def unfollow():
    try:
        data = request.get_json()
        userID = data.get('userID')
        currentUserID = data.get('currentUserID')
        if not userID or not currentUserID:
            return jsonify({'error': 'Missing userID or currentUserID'}), 400
        unfollow_rel = Follower.query.filter_by(follower_id=currentUserID, following_id=userID).first()
        if not unfollow_rel:
            return jsonify({'error': 'Relationship does not exist'}), 404
        db.session.delete(unfollow_rel)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/add_cookbook', methods=['POST'])
@login_required
def add_cookbook():
    try:
        data = request.get_json()
        cookbook_name = VALIDATOR.clean_input(data.get('cookbook'))
        user_id = data.get('userID')
        recipe_id = data.get('recipeID')
        status = data.get('status')
        if status == 'private':
            status = False
        else:
            status = True
        cookbook = CookBook.query.filter_by(id=cookbook_name, user_id=user_id).first()
        if not cookbook:
            cookbook = CookBook(name=cookbook_name, user_id=user_id, status=status, last_modified=datetime.now())
            db.session.add(cookbook)
            db.session.commit()
        recipe = Recipe.query.get(recipe_id)
        if recipe and recipe not in cookbook.recipes:
            cookbook.recipes.append(recipe)
            cookbook.last_modified = datetime.now()
            db.session.commit()
        else:
            return jsonify({'error': 'Recipe already exists in the cookbook.'}), 400
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred while adding the cookbook: {}'.format(str(e))}), 500

    

@app.route('/edit_cookbook/<cookbookID>', methods=['GET', 'POST'])
@login_required
def edit_cookbook(cookbookID):
    cookbook = CookBook.query.options(joinedload(CookBook.recipes)).filter_by(id=cookbookID).first()
    if request.method == 'POST' and cookbook.user_id == current_user.id:
        try:
            cookbook_id = request.form.get('id')
            name = VALIDATOR.clean_input(request.form.get('name'))
            status = request.form.get('status')
            try:
                cover_img_file = request.files['cover_img']
                if cover_img_file: 
                    file_name = IMAGE_PROCESSOR.download_userIMG(file=cover_img_file)
                    cover_img = IMAGE_PROCESSOR.upload_file(file_name)
                    cookbook.cover_img = cover_img
            finally:
                removedRecipes = request.form.get('removedRecipes', []) 
                cookbook = CookBook.query.filter_by(id=cookbook_id).first()
                cookbook.name = name
                if status == 'Private':
                    cookbook.status = False
                else:
                    cookbook.status = True
                for removedID in removedRecipes:
                    db.session.execute(
                        cookbook_recipes.delete().where(
                            and_(
                                cookbook_recipes.c.recipe_id == removedID,
                                cookbook_recipes.c.cookbook_id == cookbook.id
                            )
                        )
                    )
                cookbook.last_modified = datetime.now()
                db.session.commit()
                return jsonify({'success': True}), 200
        except:
            db.session.rollback()
            traceback.print_exc()
            return jsonify({'success': False, 'message': 'Internal server error'}), 500
    else:
        if cookbook.user_id == current_user.id:
            return render_template('edit_cookbook.html', cookbook=cookbook, current_user=current_user)
        else:
            flash('You do not have permission to edit this cookbook')
            return redirect(url_for("home"))

@app.route('/cookbook/<cookbookID>', methods=['GET'])
def cookbook(cookbookID):
    cookbook = CookBook.query.options(joinedload(CookBook.recipes)).filter_by(id=cookbookID).first()
    if cookbook:
        if cookbook.status or (current_user.is_authenticated and cookbook.user_id == current_user.id):
            return render_template('cookbook.html', cookbook=cookbook, current_user=current_user)
        else:
            flash('This cookbook is private and cannot be accessed by other users.', 'error')
            return redirect(url_for("home"))
    else:
        flash('Cookbook not found.', 'error')
        return redirect(url_for("home"))
    
@app.route('/delete_cookbook', methods=['POST'])
def delete_cookbook():
    cookbook_id = request.form.get('id')
    cookbook = CookBook.query.options(joinedload(CookBook.recipes)).filter_by(id=cookbook_id).first()
    if cookbook and current_user.id == cookbook.user_id:
        try:
            db.session.delete(cookbook)
            db.session.commit()
            return jsonify({'success': True}), 200
        except:
            db.session.rollback()
            traceback.print_exc()
            return jsonify({'success': False, 'message': 'Internal server error'}), 500 
    return jsonify({'success': False, 'message': 'Cookbook not found'}), 404 

@app.route('/generate_list', methods=['POST'])
def generate_list():
    if current_user.is_authenticated:
        try:
            ingredients = []
            cookbook_id = request.form.get('id')
            cookbook = CookBook.query.options(joinedload(CookBook.recipes)).filter_by(id=cookbook_id).first()
            for recipe in cookbook.recipes:
                for item in custom_split(recipe.ingredients):
                    ingredients.append(item)
            shopping_list = RECIPE_AI.list_generation(ingredients=ingredients)
            return render_template('new_shoppingList.html', shopping_list=shopping_list, current_user=current_user)
        except Exception as e:
            flash(f'Server Error: {e}')
            cookbook_id = request.form.get('id')
            return redirect(url_for('cookbook', cookbookID=cookbook_id)) 
    else:
        flash('Not an authenticated user.')
        cookbook_id = request.form.get('id')
        return redirect(url_for('cookbook', cookbookID=cookbook_id))

@app.route('/shopping_list', methods=['GET', 'POST'])
def display_shoppingList():
    if current_user.is_authenticated:
        shopping_list = ShoppingList.query.filter_by(user_id=current_user.id).first()
        return render_template('viewShoppingList.html', shopping_list=shopping_list.shopping_list, current_user=current_user)
    else:
        flash('Not an authenticated user Please Register.')
        return redirect(url_for('home'))

@app.route('/edit_list', methods=['POST', 'GET'])
def edit_list():
    if current_user.is_authenticated:
        shopping_list = ShoppingList.query.filter_by(user_id=current_user.id).first()
        return render_template('new_shoppingList.html', shopping_list=shopping_list.shopping_list, current_user=current_user)
    else:
        flash('Not an authenticated user Please Register.')
        return redirect(url_for('home'))

@app.route('/save_list', methods=['POST'])
def save_list():
    if current_user.is_authenticated:
        form_shoppingList = VALIDATOR.clean_input(request.form.get('shopping_list'))
        shoppingList = ShoppingList.query.filter_by(user_id = current_user.id).first()
        if not shoppingList:
            try:
                newShoppingList = ShoppingList(user_id=current_user.id, shopping_list=form_shoppingList)
                db.session.add(newShoppingList)
                db.session.commit()
                return jsonify({'success': True}), 200
            except Exception as e:
                db.session.rollback()
                traceback.print_exc()
                return jsonify({'error': str(e)}), 500
        else:
            try:
                shoppingList.shopping_list = form_shoppingList
                shoppingList.date_created = datetime.now()
                db.session.commit()
                return jsonify({'success': True}), 200
            except Exception as e:
                db.session.rollback()
                traceback.print_exc()
                return jsonify({'error': str(e)}), 500
    else:
        flash('Not an authenticated user. Cannot save list.')
        return redirect(url_for('home'))

@app.route('/admin')
@admin_only
def admin():
    all_recipes = Recipe.query.all()
    all_users = User.query.all()
    return render_template('admin.html', all_recipes=reversed(all_recipes), all_users=all_users, current_user=current_user)

@app.route('/admin_delete_recipe/<recipeID>', methods=['POST'])
@admin_only
def admin_delete_recipe(recipeID):
    recipe_to_delete = Recipe.query.filter_by(id=recipeID).first()
    db.session.delete(recipe_to_delete)
    db.session.commit()
    return redirect(url_for('admin'))

@app.route('/admin_delete_user/<userID>', methods=['POST'])
@admin_only
def admin_delete_user(userID):
    user_to_delete = User.query.filter_by(id=userID).first()
    if user_to_delete.reviews:
        reviews = Review.query.filter_by(user_id=userID).all()
        for review in reviews:
            db.session.delete(review)
    if user_to_delete.comments:
        comments = Comment.query.filter_by(user_id=userID).all()
        for comment in comments:
            db.session.delete(comment)
    if user_to_delete.recipes:
        for recipe in user_to_delete.recipes:
            media = RecipeMedia.query.filter_by(recipe_id = recipe.id).all()
            for pic in media:
                db.session.delete(pic)
            db.session.delete(recipe)
            db.session.commit()
    notifications = Notification.query.filter(or_(
        Notification.user_id == userID,
        and_(
            Notification.type == 'follow',
            Notification.related_id == userID
        ))
    ).all()
    for notification in notifications:
        db.session.delete(notification)
        db.session.commit()
    cookbook = CookBook.query.options(joinedload(CookBook.recipes)).filter_by(user_id=userID).all()
    for book in cookbook:
        db.session.delete(book)
        db.session.commit()
    followers = Follower.query.filter(or_(
        Follower.follower_id == userID,
        Follower.following_id == userID
    ))
    for follow in followers:
        db.session.delete(follow)
        db.session.commit()
    db.session.delete(user_to_delete)
    db.session.commit()
    return redirect(url_for('admin'))

@app.route('/admin_edit_profile/<userID>', methods=['POST', 'GET'])
@admin_only
def admin_edit_profile(userID):
    user = User.query.filter_by(id=userID).first()
    if request.method == "POST":
        updated_Fname = request.form.get('fname')
        updated_lName = request.form.get('lname')
        updated_email = request.form.get('email')
        updated_username = request.form.get('username')
        if user.username != updated_username and User.query.filter_by(username=updated_username).first():
            flash("User with username " + updated_username + " already exists. Try again.")
            return render_template("edit_profile.html", user = user, current_user=current_user)
        if user.email != updated_email and User.query.filter_by(email=updated_email).first():
            flash("User with that email address already exists. Try again.")
            return render_template("edit_profile.html", user = user, current_user=current_user)
        if updated_email == updated_username:
            flash('Username and Email cannot match. Please choose a unique username.')
            return render_template("edit_profile.html", user = user, current_user=current_user)
        user.fname = updated_Fname
        user.lname = updated_lName
        user.email = updated_email
        user.username = updated_username
        if request.form.get('password'):
            updated_password = generate_password_hash(request.form.get('password'), method='pbkdf2:sha256', salt_length=8)
            user.password = updated_password
        db.session.commit()
        return redirect(url_for('admin'))
    return render_template("admin_edit_profile.html", user = user)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.run(host=configCLASS.app_host,port=configCLASS.app_port,debug=configCLASS.debug_on)