from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

class AI_tool():
  def __init__(self):
    self.client = OpenAI()
    gpt_url = "https://api.openai.com/v1/chat/completions"
    self.seed = 51773

  def image_generation(self, prompt):
    response = self.client.images.generate(
      model="dall-e-3",
      prompt = prompt,
      size="1024x1024",
      quality='hd',
      n=1
    )
    urls = []
    urls.append(response.data[0].url)
    return urls
    
  def recipe_generation(self, include, exclude):
    prompt = f"Write a recipe with a descriptive name that must include {include} and any other needed ingredients but does not contain {exclude}. Output the Title, Description, Ingredients, and Instructions. Format the output in a JSON where each ingredient is a single item within the 'Ingredients' and each step within 'Instructions' the same way." 
    response = self.client.chat.completions.create(
      model="gpt-3.5-turbo-0125",
      response_format={"type":"json_object"},
      messages=[
        {"role":"system","content":"You are a helpful assistant trained as a chef designed to output JSON."},
        {"role": "user", "content": f"{prompt}"}
      ],
      seed=self.seed
    )
    recipe = response.choices[0].message.content
    return recipe

  def list_generation(self, ingredients):
    prompt = f"I'm planning to cook several recipes and need to create a shopping list based on their ingredients. Please provide the items needed along with their quantities, categorized into Protein, Produce, Dairy, Spices, and Pantry. In the JSON, ensure to use the keys 'item' and 'quantity'. 'item' should only include the item name without its state (e.g., chopped, diced, minced, cooked, etc). 'quantity' should indicate the quantity with the unit (e.g., lbs, cans, bundles, etc). Round the quantities up to the nearest whole number. Combine similar ingredients and sum their quantities accordingly. Here are the ingredients: {ingredients}"
    response = self.client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={"type":"json_object"},
        messages=[
          {"role":"system","content":"You're a helpful assistant trained as a personal shopper, ready to output JSON."},
          {"role": "user", "content": f"{prompt}"}
        ],
        seed = (self.seed - 1)
      )
    shopping_list = response.choices[0].message.content
    return shopping_list
