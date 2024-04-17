# TODO - Show avg rating on card and view recipe
# TODO - Admin Edit DB page
# TODO - Add footer to help with styling
# TODO - Form Styling
# TODO - Change Colors?
# TODO - Comments
# TODO - Following/Follow
# TODO - Search for content
# TODO - User Uploaded Photos
# TODO - Update queries current method is deprecated - https://docs.sqlalchemy.org/en/20/tutorial/index.html
# Nav HTML for Notifications <li><a href="#"><img src="/static/images/notification-icon.svg" alt="Notification Icon" class="nav-icon"></a></li>

from flask import Flask, render_template, redirect, url_for, request, jsonify, abort, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
from flask_bootstrap import Bootstrap

from werkzeug.security import generate_password_hash, check_password_hash

from dotenv import load_dotenv
from datetime import date
from functools import wraps
from sqlalchemy import func

import json
import os 

from ai_interface import AI_tool
from image_processing import ImageProcessing

from config import Config
configCLASS = Config()

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chefsCab.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
Bootstrap(app)

RECIPE_AI = AI_tool()
IMAGE_PROCESSOR = ImageProcessing()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(100), nullable=False)
    lname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(250), unique=True, nullable=False)
    username = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    recipes = db.relationship("Recipe", backref='user')
    comments = db.relationship("Comment", backref='user')
    reviews = db.relationship("Review", backref='user')

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    img_url = db.Column(db.String(250), nullable=True)
    date_posted = db.Column(db.String(250), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comments = db.relationship("Comment", backref='recipe')
    reviews = db.relationship('Review', backref='recipe')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    review = db.Column(db.Text, nullable=False)
    rating = db.Column(db.String(5), nullable=False)
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
        if current_user.email != admin_email:
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

@app.template_filter('avg_rating')
def avg_rating(list):
    total = 0
    for rating in list:
        total += len(rating.rating)
    avg_length = total / len(list)
    avg_rating_string = '⭐' * int(avg_length)
    return avg_rating_string


@app.route("/")
def home():
    all_recipes = Recipe.query.all()
    return render_template('index.html', all_recipes=reversed(all_recipes), current_user=current_user)

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email_or_username = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter((User.email == email_or_username) | (User.username == email_or_username)).first()
        if not user:
            flash("No user associated with that email or username, try <a href='" + url_for('register') + "'>registering</a>!")
            return redirect(url_for('login'))
        else:
            password = request.form.get('password')
            if check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for('home'))
            else:
                flash("Incorrect Password, try again!")
                return render_template("login.html", current_user=current_user)
    else:
        return render_template("login.html", current_user=current_user)
    
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
        new_user_fName = request.form.get('fname')
        new_user_lName = request.form.get('lname')
        new_user_email = request.form.get('email')
        new_user_username = request.form.get('username')
        new_user_password = generate_password_hash(request.form.get('password'), method='pbkdf2:sha256', salt_length=8)
        new_user = User(email = new_user_email, username = new_user_username, password = new_user_password, fname = new_user_fName, lname = new_user_lName)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for("home"))
    else:
        return render_template("register.html", current_user=current_user)
    
@app.route("/new-recipe")
@login_required
def new_recipe():
    return render_template('new-recipe.html', current_user=current_user)

@app.route("/save_recipe", methods=["POST"])
@login_required
def save_recipe():
    if request.method == "POST":
        recipe_title = request.form.get("title")
        recipe_image = request.form.get("image_url")
        recipe_desc = request.form.get("desc")
        ingredients = request.form.get("ingredients")
        instructions = request.form.get("instructions")
        file_name = IMAGE_PROCESSOR.download_image(recipe_image)
        file_url = IMAGE_PROCESSOR.upload_file(file_name)
        new_recipe = Recipe(
            title=recipe_title,
            description=recipe_desc,
            ingredients=ingredients,
            instructions=instructions,
            img_url=file_url,
            date_posted=date.today().strftime("%B %d, %Y"),
            user_id=current_user.id        
        )
        db.session.add(new_recipe)
        db.session.commit()
    return redirect(url_for("home"))

@app.route("/generate_images", methods=["POST"])
@login_required
def generate_images():
    try:
        data = request.get_json()
        title = data['title']
        description = data['description']
        prompt = f"{title}. {description}"
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
        includeIngredients = data['includeIngredients']
        excludeIngredients = data['excludeIngredients']
        recipe = RECIPE_AI.recipe_generation(includeIngredients, excludeIngredients)
        return jsonify(recipe=recipe)
    except Exception as e:
        app.logger.error(f"Error in generate recipe route: {e}")
        return jsonify(error=str(e)), 400

@app.route("/delete-recipe/<recipe_id>", methods=["GET", "POST"])
@login_required
def delete_recipe(recipe_id):
    recipe_to_delete = Recipe.query.filter_by(id=recipe_id).first()
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
    if current_user.id == int(userID) or current_user.username == 'jorted-runner':
        user = User.query.filter_by(id=userID).first()
        if request.method == "POST":
            updated_Fname = request.form.get('fname')
            updated_lName = request.form.get('lname')
            updated_email = request.form.get('email')
            updated_username = request.form.get('username')
            if user.username != updated_username:
                if User.query.filter_by(username=updated_username).first():
                    flash("User with username " + updated_username + " already exists. Try again.")
                    return render_template("editProfile.html", user = user, current_user=current_user)
            if updated_email == updated_username:
                flash('Username and Email cannot match. Please choose a unique username.')
                return render_template("editProfile.html", user = user, current_user=current_user)
            user.fname = updated_Fname
            user.fname = updated_Fname
            user.lName = updated_lName
            user.email = updated_email
            user.username = updated_username
            db.session.commit()
            return redirect(url_for('user_profile', userID = userID))
        return render_template("editProfile.html", user = user, current_user=current_user)
    else:
        return redirect(url_for('home'))

@app.route('/search', methods=['POST', 'GET'])
@login_required
def search():
    if request.method == 'POST':
        searchTerm = request.form.get('searchTerm')
        users = User.query.filter(
            User.username.like(f"%{searchTerm}%") | 
            User.fname.like(f"%{searchTerm}%") | 
            User.lname.like(f"%{searchTerm}%")
            ).all()
        results = Recipe.query.filter(
            Recipe.title.like(f"%{searchTerm}%") | 
            Recipe.description.like(f"%{searchTerm}%") | 
            Recipe.ingredients.like(f"%{searchTerm}%")
        ).all()
        return render_template('searchResults.html', results=results, users=users, searchTerm=searchTerm, current_user=current_user)
    return render_template('searchResults.html', current_user=current_user)

@app.route('/comment/<userID>/<recipeID>', methods=['POST'])
@login_required
def comment(userID, recipeID):
    comment = request.form.get('comment')
    new_comment = Comment(comment=comment,
                          user_id=int(userID),
                          recipe_id = int(recipeID))
    db.session.add(new_comment)
    db.session.commit()
    return redirect(url_for('home') + '#recipe_' + recipeID)

@app.route('/review/<userID>/<recipeID>', methods=['POST', 'GET'])
@login_required
def review(userID, recipeID):
    recipe = Recipe.query.filter_by(id=recipeID).first()
    if request.method == 'GET':
        return render_template('review.html', recipe=recipe, current_user=current_user)
    else:
        review = request.form.get('review')
        rating = request.form.get('rating')
        new_recipe = Review(review=review,
                            rating=rating,
                            user_id=int(userID),
                            recipe_id = int(recipeID))
        db.session.add(new_recipe)
        db.session.commit()
        return redirect(url_for('view_recipe', recipeID=recipeID))

@app.route('/view_recipe/<recipeID>', methods=['GET', 'POST'])
def view_recipe(recipeID):
    recipe = Recipe.query.filter_by(id=recipeID).first()
    if request.method == 'GET':
        return render_template('viewRecipe.html', recipe=recipe, current_user=current_user)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.run(host=configCLASS.app_host,port=configCLASS.app_port,debug=configCLASS.debug_on)