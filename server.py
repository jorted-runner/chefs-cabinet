# TODO - Form Styling
# TODO - Change Colors?
# TODO - Comments
# TODO - Following/Follow
# TODO - Search for content
# TODO - User Uploaded Photos

from flask import Flask, render_template, redirect, url_for, request, jsonify, abort, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
from flask_bootstrap import Bootstrap
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from dotenv import load_dotenv
from datetime import date
from functools import wraps
from bs4 import BeautifulSoup

import json
import os 

from ai_interface import AI_tool
from image_processing import ImageProcessing

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipe-db.sqlite3'
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

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    img_url = db.Column(db.String(250), nullable=True)
    date_posted = db.Column(db.String(250), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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

@app.route("/")
def home():
    all_recipes = Recipe.query.all()
    return render_template('index.html', all_recipes=reversed(all_recipes), current_user=current_user)

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if not User.query.filter_by(email=request.form.get('email')).first():
            flash("No user associated with that email, try <a href='" + url_for('register') + "'>registering</a>!")

            return redirect(url_for('login'))
        email = request.form.get("email")
        user = User.query.filter_by(email = email).first()
        if user:
            password = request.form.get('password')
            if check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for('home'))
            else:
                flash("Incorrect Password, try again!")
                return render_template("login.html")
    else:
        return render_template("login.html", current_user=current_user)
    
@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        if User.query.filter_by(email=request.form.get('email')).first():
            flash("You've already signed up with that email, <a href='" + url_for('login') + "'>log in</a> instead!")
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
    return render_template('new-recipe.html')

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
    
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 8080, debug=True)