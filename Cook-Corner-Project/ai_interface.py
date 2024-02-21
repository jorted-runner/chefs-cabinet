from dotenv import load_dotenv
import requests
from openai import OpenAI
import os

load_dotenv()

class AI_tool():
  def __init__(self):
    self.client = OpenAI()
    gpt_url = "https://api.openai.com/v1/chat/completions"

    

  def image_generation(self, prompt):
    response = self.client.images.generate(
      model="dall-e-3",
      prompt = prompt,
      size="1024x1024",
      quality='hd',
      n=1,
    )
    urls = []
    urls.append(response.data[0].url)
    return urls
    

  def recipe_generation(self, include, exclude):
    prompt = f"Write a recipe with a descriptive name that includes {include} and any other needed ingredients but does not contain {exclude}. Output the Title, Description, Ingredients, and Instructions. Format the output in a JSON." 
    response = self.client.chat.completions.create(
      model="gpt-3.5-turbo-0125",
      response_format={"type":"json_object"},
      messages=[
        {
          {"role":"system","content":"You are a helpful assistant trained as a chef designed to output JSON."},
          {"role": "user", "content": prompt}
        }
      ]
    )
    print(response)
    print("--------------------")
    recipe = response.choices[0].message.content
    print(recipe)
    return recipe
    
