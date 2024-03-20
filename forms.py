from flask_wtf import FlaskForm

from wtforms import StringField, SubmitField, EmailField, PasswordField
from wtforms.validators import DataRequired, Length


class NewUser(FlaskForm):
    first_name = StringField("First Name", validators=[DataRequired()])
    last_name = StringField("Last Name", validators=[DataRequired()])
    username = StringField("User Name", validators=[DataRequired()])
    email = EmailField("Email Address", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min= 8)])
    submit = SubmitField("Register")

class UserLogin(FlaskForm):
    email = EmailField("Email Address", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Login")