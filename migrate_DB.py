import sqlite3
from datetime import datetime

# Connect to the database
old_DB = sqlite3.connect('instance\chefsCab.sqlite3')
new_DB = sqlite3.connect('instance\chefs-Cab.sqlite3')

old_cursor = old_DB.cursor()
new_cursor = new_DB.cursor()

# Move Users ##
old_cursor.execute("SELECT * FROM user")
old_users = old_cursor.fetchall()
for user in old_users:
    new_cursor.execute(f"INSERT INTO user (id, fname, lname, email, username, password, profile_pic, sign_up_date) VALUES ({user[0]}, '{user[1]}', '{user[2]}', '{user[3]}', '{user[4]}', '{user[5]}', 'https://chefs-cabinet.s3.amazonaws.com/profile-placeholder.png', '{datetime.now()}')")

## Move Recipes ##
old_cursor.execute("SELECT * FROM recipe")
old_recipes = old_cursor.fetchall()
for recipe in old_recipes:
    new_cursor.execute(f"INSERT INTO recipe (id, title, description, ingredients, instructions, posted, user_id) VALUES ({recipe[0]}, '{recipe[1]}', '{recipe[2]}', '{recipe[3]}', '{recipe[4]}', '{datetime.now()}', {recipe[7]})")
    new_cursor.execute(f"INSERT INTO recipe_media (recipe_id, img_url, user_upload) VALUES ({recipe[0]}, '{recipe[5]}', False)")
    old_cursor.execute(f"SELECT * FROM comment WHERE recipe_id = {recipe[0]}")
    old_comments = old_cursor.fetchall()
    for comment in old_comments:
        new_cursor.execute(f"INSERT INTO comment (comment, user_id, recipe_id) VALUES ('{comment[1]}', '{comment[2]}', '{comment[3]}')")
    old_cursor.execute(f"SELECT * FROM review WHERE recipe_id = {recipe[0]}")
    old_reviews = old_cursor.fetchall()
    for review in old_reviews:
        new_cursor.execute(f"INSERT INTO review (review, rating, user_id, recipe_id) VALUES ('{review[1]}', '{review[2]}', '{review[3]}', '{review[4]}')")

new_DB.commit()
new_DB.close()
old_DB.close()
