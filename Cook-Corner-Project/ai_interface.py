from dotenv import load_dotenv
import requests
from openai import OpenAI
import os

load_dotenv()
gpt_3_url = "https://api.openai.com/v1/chat/completions"

class AI_tool():
  def __init__(self):
    self.client = OpenAI()
    

  def image_generation(self, prompt):
    response = self.client.images.generate(
      model="dall-e-3",
      prompt = prompt,
      size="1024x1024",
      quality='hd',
      n=1,
    )
    print(response)
    urls = []
    urls.append(response.data[0].url)
    return urls
    

  # def recipe_generation(self, include, exclude):
  #   prompt = f"Write a recipe with a descriptive name that includes {include} and any other needed ingredients but does not contain {exclude}. Output the Title, Description, Ingredients, and Instructions. Format the output using html tags, tagging the title with the <h2> tag." 
  #   response = openai.ChatCompletion.create(
  #     model="gpt-3.5-turbo",
  #     messages=[
  #       {"role": "user", "content": prompt}
  #     ]
  #   )
  #   recipe = response.choices[0].message.content
  #   # recipe_parts = recipe.split("Ingredients:")
  #   # header = recipe_parts[0].strip()
  #   # header_parts = header.split("Description:")
  #   # title = header_parts[0].strip().split("Title:")[1]
  #   # description = header_parts[1]
  #   # ingredients = recipe_parts[1].split("Instructions:")[0].strip()
  #   # instructions = recipe_parts[1].split("Instructions:")[1].strip()
  #   # ingredients_list = ingredients.split("- ")
  #   return recipe
    
