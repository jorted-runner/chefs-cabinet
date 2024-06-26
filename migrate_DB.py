import sqlite3
from datetime import datetime

# Connect to the database
old_DB = sqlite3.connect('instance/chefs_db_2.sqlite3')
new_DB = sqlite3.connect('instance/chefs_db_3.sqlite3')

old_cursor = old_DB.cursor()
new_cursor = new_DB.cursor()

# Move Users ##
old_cursor.execute("SELECT * FROM user")
old_users = old_cursor.fetchall()
for user in old_users:
    print(user[6])
    if user[6] == None:
        print('it worked')
        new_cursor.execute(f"INSERT INTO user (id, fname, lname, email, username, password, profile_pic, sign_up_date, last_login) VALUES ({user[0]}, '{user[1]}', '{user[2]}', '{user[3]}', '{user[4]}', '{user[5]}', '{user[8]}', '{user[7]}', '{datetime.now()}')")
    else:
        new_cursor.execute(f"INSERT INTO user (id, fname, lname, email, username, password, google_id, profile_pic, sign_up_date, last_login) VALUES ({user[0]}, '{user[1]}', '{user[2]}', '{user[3]}', '{user[4]}', '{user[5]}', '{user[6]}', '{user[8]}', '{user[7]}', '{datetime.now()}')")

## Move Recipes ##
old_cursor.execute("SELECT * FROM recipe")
old_recipes = old_cursor.fetchall()
for recipe in old_recipes:
    new_cursor.execute(f"INSERT INTO recipe (id, title, description, ingredients, instructions, posted, user_id) VALUES ({recipe[0]}, '{recipe[1]}', '{recipe[2]}', '{recipe[3]}', '{recipe[4]}', '{recipe[5]}', {recipe[6]})")
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
    new_cursor.execute(f"INSERT INTO cook_book (id, name, status, cover_img, user_id, last_modified) VALUES ('{cookbook[0]}', '{cookbook[1]}', '{cookbook[2]}', '{cookbook[3]}', '{cookbook[4]}', '{cookbook[5]}')")
old_cursor.execute(f"SELECT * FROM cookbook_recipes")
old_cookbook_recipes = old_cursor.fetchall()
for recipe in old_cookbook_recipes:
    new_cursor.execute(f"INSERT into cookbook_recipes (cookbook_id, recipe_id) VALUES ('{recipe[0]}', '{recipe[1]}')")

old_cursor.execute(f"SELECT * from follower")
old_followers = old_cursor.fetchall()
for follower in old_followers:
    new_cursor.execute("INSERT into follower (id, follower_id, following_id) values (?, ?, ?)", (follower[0], follower[1], follower[2]))

old_cursor.execute('SELECT * FROM shopping_list')
old_shoppingLists = old_cursor.fetchall()
for list in old_shoppingLists:
    new_cursor.execute('INSERT into shopping_list (id, date_created, shopping_list, user_id) VALUES (?, ?, ?, ?)', (list[0], list[1], list[2], list[3]))

new_DB.commit()
new_DB.close()
old_DB.close()
