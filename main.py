# Importing Modules
from flask import Flask, render_template, request, jsonify, session, redirect
from flask_sqlalchemy import SQLAlchemy
import json
import datetime

# Loading variable configurations
with open("config.json") as f:
    data = json.load(f)

# Creating App
app = Flask(__name__)
# Secret key for session storage
app.secret_key = data["params"]["SECRET_KEY"]
# Connecting to database
if data["params"]["debug"]:
    app.config['SQLALCHEMY_DATABASE_URI'] = data["params"]["local_database_uri"]
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = data["params"]["production_database_uri"]
db = SQLAlchemy(app)


# Users Table
class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(30), nullable=False)
    fname = db.Column(db.String(20), nullable=True)
    lname = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(60), nullable=True)
    about = db.Column(db.String(200), nullable=True)
    complete = db.Column(db.Boolean(), nullable=False)
    twitter = db.Column(db.String(50), nullable=True)
    insta = db.Column(db.String(50), nullable=True)
    github = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(50), nullable=True)

    def __init__(self, email, password, fname=None, lname=None, address=None, about=None, complete=False,
                 twitter=None, insta=None, github=None, website=None):
        self.email = email
        self.password = password
        self.fname = fname
        self.lname = lname
        self.address = address
        self.about = about
        self.complete = complete
        self.twitter = twitter
        self.insta = insta
        self.github = github
        self.website = website


# Posts Table
class Posts(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(30), nullable=False)
    subtitle = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    time_upload = db.Column(db.DateTime(30), nullable=False)

    def __init__(self, email, title, subtitle, description, content):
        self.email = email
        self.title = title
        self.subtitle = subtitle
        self.description = description
        self.content = content
        self.time_upload = datetime.datetime.now()


# Owner Region (used to send otp by website owner's email)
email_ = db.session.query(Users).filter(Users.email == data["params"]["owner_email"]).first().email
password_ = db.session.query(Users).filter(Users.email == data["params"]["owner_email"]).first().password


@app.route('/')
def home():
    if 'user' in session:
        # If already logged in
        user = db.session.query(Users).filter(Users.email == session["user"]).first()
        # Checking if profile of user is complete
        if user.complete:
            return redirect('/about')
        else:
            return redirect("/edit")
    else:
        # If not logged in
        return render_template("login.html")


def add_user(email):
    # Adding user in session storage to check logged in or not
    session["user"] = email


@app.route('/login_user', methods=["POST"])
def login_user():
    # Logging in
    if request.method == "POST":
        # Getting values from form
        email = request.form["email"]
        password = request.form["password"]

        # Finding user by email
        user = db.session.query(Users).filter(Users.email == email).first()

        if user is not None:
            # If user is present in database
            if password == user.password:
                # If password is correct
                add_user(email)
                if "otp" in session and "email_otp" in session:
                    # Removing otp storage if present
                    session.pop("otp")
                    session.pop("email_otp")
                return jsonify(error=None)
            else:
                # If password is incorrect
                return jsonify(error="Incorrect Password")
        else:
            # If user is not present in database
            return jsonify(error="Not Registered")


@app.route('/register_user', methods=["POST"])
def register_user():
    # Registering
    if request.method == "POST":
        # Getting values from form
        email = request.form["email"]
        password = request.form["password"]
        otp = request.form["otp"]

        if "otp" in session and "email_otp" in session:
            # If otp is present
            try:
                if int(session["otp"]) == int(otp) and session["email_otp"] == email:
                    # If otp is correct
                    try:
                        # Try to add user in database
                        admin = Users(email, password)
                        db.session.add(admin)
                        db.session.commit()
                        add_user(email)
                        return jsonify(error=None)
                    except Exception as e:
                        # If user is already present
                        # return jsonify(error="Already Registered")
                        return jsonify(error=e)
                    finally:
                        # In both cases clearing otp
                        session.pop("otp")
                        session.pop("email_otp")
                else:
                    # If otp is incorrect
                    return jsonify(error="Incorrect OTP")
            except:
                return jsonify(error="Incorrect OTP")
        else:
            # If otp is not present then request it
            return jsonify(error="Request OTP")


@app.route('/forgot_user', methods=["POST"])
def forgot_user():
    # Forgot password
    if request.method == "POST":
        # Getting values from form
        email = request.form["email"]
        password = request.form["password"]
        otp = request.form["otp"]

        # Finding user by email
        user = db.session.query(Users).filter(Users.email == email).first()

        if user is not None:
            # If user is found in database
            if "otp" in session and "email_otp" in session:
                # If otp is present in session storage
                try:
                    if int(session["otp"]) == int(otp) and email == session["email_otp"]:
                        # If otp is correct
                        # Updating Password
                        db.session.query(Users).filter(Users.email == email).update({Users.password: password})
                        db.session.commit()
                        add_user(email)
                        # Clearing otp
                        session.pop("otp")
                        session.pop("email_otp")
                        return jsonify(error=None)
                    else:
                        # If otp is incorrect
                        return jsonify(error="Incorrect OTP")
                except:
                    return jsonify(error="Incorrect OTP")
            else:
                # If otp is not present then request it
                return jsonify(error="Request OTP")
        else:
            # If user is not found in database
            return jsonify(error="Not Registered")


@app.route('/logout_user', methods=["POST"])
def logout_user():
    # Logging out
    if request.method == "POST":
        if "user" in session:
            session.pop("user")
            return jsonify(error=None)
        else:
            return jsonify(error="Logged out already")


@app.route('/delete_user', methods=["POST"])
def delete_user():
    # Deleting user
    if request.method == "POST":
        if "user" in session:
            # Finding user by email
            user = db.session.query(Users).filter(Users.email == session["user"]).first()
            db.session.delete(user)
            db.session.commit()
            session.pop("user")
            return jsonify(error=None)
        else:
            return jsonify(error="Logged out")


@app.route('/send_otp', methods=["POST"])
def send_otp():
    # Sending otp
    import requests
    email = request.form["email"]
    response = requests.post(
        url=f"https://cybersaksham-apis.herokuapp.com/mail_otp?from={email_}&to={email}&password={password_}"
    )
    # Adding otp in session storage
    session["otp"] = response.json()["otp"]
    session["email_otp"] = email
    return jsonify(response=response.json())


@app.route('/update_profile', methods=["POST"])
def update_profile():
    # Update Profile of User
    if request.method == "POST":
        # Getting values from form
        firstname__ = request.form["firstname"]
        lastname__ = request.form["lastname"]
        email__ = request.form["email"]
        address__ = request.form["address"]
        about__ = request.form["about"]

        # Finding user by email
        user = db.session.query(Users).filter(Users.email == email__)

        # Checking for correct user
        if session["user"] == email__:
            user.update({
                Users.fname: firstname__,
                Users.lname: lastname__,
                Users.address: address__,
                Users.about: about__,
                Users.complete: True
            })
            db.session.commit()
            return jsonify(error=None)
        else:
            return jsonify(error="Incorrect Email")


def formatLinks(link):
    if link == "":
        return None
    return link


@app.route('/update_social', methods=["POST"])
def update_social():
    # Update Social Links of User
    if request.method == "POST":
        # Getting values from form & formatting it
        email__ = request.form["email"]
        twitter__ = formatLinks(request.form["twitter"])
        insta__ = formatLinks(request.form["insta"])
        github__ = formatLinks(request.form["github"])
        website__ = formatLinks(request.form["website"])

        # Finding user by email
        user = db.session.query(Users).filter(Users.email == email__)

        if user.first().complete:
            if "user" in session:
                # Checking for correct user
                if session["user"] == email__:
                    user.update({
                        Users.twitter: twitter__,
                        Users.insta: insta__,
                        Users.github: github__,
                        Users.website: website__
                    })
                    db.session.commit()
                    return jsonify(error=None)
                else:
                    return jsonify(error="Incorrect Email")
            else:
                return jsonify(error="Login First")
        else:
            return jsonify(error="Complete info first")


@app.route('/update_password', methods=["POST"])
def update_password():
    # Update Password of User
    if request.method == "POST":
        # Getting values from form & formatting it
        email__ = request.form["email"]
        old_pass__ = formatLinks(request.form["oldPass"])
        new_pass__ = formatLinks(request.form["newPass"])

        # Finding user by email
        user = db.session.query(Users).filter(Users.email == email__)

        if user.first().complete:
            if "user" in session:
                # Checking for correct user
                if session["user"] == email__:
                    if user.first().password == old_pass__:
                        user.update({
                            Users.password: new_pass__
                        })
                        db.session.commit()
                        return jsonify(error=None)
                    else:
                        return jsonify(error="Incorrect Password")
                else:
                    return jsonify(error="Incorrect Email")
            else:
                return jsonify(error="Login First")
        else:
            return jsonify(error="Complete info first")


@app.route('/about')
def about():
    if "user" in session:
        user = db.session.query(Users).filter(Users.email == session["user"]).first()
        if user.complete:
            return render_template("about.html", user=user, params=data["params"])
        else:
            return redirect('/')
    else:
        return redirect('/')


@app.route('/settings')
def settings():
    if "user" in session:
        user = db.session.query(Users).filter(Users.email == session["user"]).first()
        if user.complete:
            return render_template("settings.html", user=user)
        else:
            return redirect('/')
    else:
        return redirect('/')


@app.route('/edit')
def edit():
    if "user" in session:
        user = db.session.query(Users).filter(Users.email == session["user"]).first()
        return render_template("edit_profile.html", user=user)
    else:
        return redirect('/')


if __name__ == '__main__':
    app.run(debug=data["params"]["debug"])
