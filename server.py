from flask import Flask, render_template, request, jsonify
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from ai_interface import AI_tool
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

import os

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipe-db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


RECIPE_AI = AI_tool()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
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

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/new-recipe")
@login_required
def new_recipe():
    return render_template('new-recipe.html')

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

if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 8080, debug=True)