from flask import Flask, render_template, request, jsonify
from ai_interface import AI_tool
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

RECIPE_AI = AI_tool()

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/new-recipe")
def new_recipe():
    return render_template('new-recipe.html')

@app.route("/generate_images", methods=["POST"])
def generate_images():
    try:
        data = request.get_json()
        title = data['title']
        description = data['description']
        prompt = f"{title}. {description}"
        image_urls = RECIPE_AI.image_generation(prompt)
        return jsonify(images=image_urls)
    except Exception as e:
        app.logger.error(f"Error in regen_images route: {e}")
        return jsonify(error=str(e)), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 8080, debug=True)