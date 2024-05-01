import sqlite3
from datetime import datetime

# Connect to the database
old_DB = sqlite3.connect('instance/chefscabinet.sqlite3')
new_DB = sqlite3.connect('instance/chefs_cabinet.sqlite3')

old_cursor = old_DB.cursor()
new_cursor = new_DB.cursor()

# Move Users ##
old_cursor.execute("SELECT * FROM user")
old_users = old_cursor.fetchall()
for user in old_users:
    new_cursor.execute(f"INSERT INTO user (id, fname, lname, email, username, password, profile_pic, sign_up_date) VALUES ({user[0]}, '{user[1]}', '{user[2]}', '{user[3]}', '{user[4]}', '{user[5]}', '{user[7]}', '{user[6]}')")

## Move Recipes ##
old_cursor.execute("SELECT * FROM recipe")
old_recipes = old_cursor.fetchall()
for recipe in old_recipes:
    new_cursor.execute(f"INSERT INTO recipe (id, title, description, ingredients, instructions, posted, user_id) VALUES ({recipe[0]}, '{recipe[1]}', '{recipe[2]}', '{recipe[3]}', '{recipe[4]}', '{datetime.now()}', {recipe[6]})")
    old_cursor.execute(f"SELECT * FROM recipe_media where recipe_id == {recipe[0]}")
    recipe_media = old_cursor.fetchall()
    for media in recipe_media:
        new_cursor.execute(f"INSERT INTO recipe_media (recipe_id, img_url, user_upload) VALUES ({recipe[0]}, '{media[1]}', '{media[2]}')")
    old_cursor.execute(f"SELECT * FROM comment WHERE recipe_id = {recipe[0]}")
    old_comments = old_cursor.fetchall()
    for comment in old_comments:
        new_cursor.execute(f"INSERT INTO comment (id, comment, commented, user_id, recipe_id) VALUES ('{comment[0]}','{comment[1]}', '{comment[2]}', '{comment[3]}', '{recipe[0]}')")
    old_cursor.execute(f"SELECT * FROM review WHERE recipe_id = {recipe[0]}")
    old_reviews = old_cursor.fetchall()
    for review in old_reviews:
        new_cursor.execute(f"INSERT INTO review (id, review, rating, reviewed, user_id, recipe_id) VALUES ('{review[0]}', '{review[1]}', '{review[2]}', '{review[3]}', '{review[4]}', '{recipe[0]}')")
old_cursor.execute(f"SELECT * FROM cook_book")
old_cookbooks = old_cursor.fetchall()
for cookbook in old_cookbooks:
    new_cursor.execute(f"INSERT INTO cook_book (id, name, status, cover_img, user_id, last_modified) VALUES ('{cookbook[0]}', '{cookbook[1]}', '{cookbook[2]}', '{cookbook[3]}', '{cookbook[4]}', '{datetime.now()}')")
old_cursor.execute(f"SELECT * FROM cookbook_recipes")
old_cookbook_recipes = old_cursor.fetchall()
for recipe in old_cookbook_recipes:
    new_cursor.execute(f"INSERT into cookbook_recipes (cookbook_id, recipe_id) VALUES ('{recipe[0]}', '{recipe[1]}')")

new_DB.commit()
new_DB.close()
old_DB.close()
