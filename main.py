# Importing Modules
from flask import Flask, render_template, request, jsonify, session, redirect
from flask_sqlalchemy import SQLAlchemy
import json

# Loading variable config json
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


# Admins Table
class Admins(db.Model):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(30), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = password


# Owner Region (used to send otp by website owner's email)
email_ = db.session.query(Admins).filter(Admins.email == data["params"]["owner_email"]).first().email
password_ = db.session.query(Admins).filter(Admins.email == data["params"]["owner_email"]).first().password


@app.route('/')
def home():
    if 'user' in session:
        # If already logged in
        return render_template("index.html")
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
        user = db.session.query(Admins).filter(Admins.email == email).first()

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
            if int(session["otp"]) == int(otp) and session["email_otp"] == email:
                # If otp is correct
                try:
                    # Try to add user in database
                    admin = Admins(email, password)
                    db.session.add(admin)
                    db.session.commit()
                    add_user(email)
                    return jsonify(error=None)
                except:
                    # If user is already present
                    return jsonify(error="Already Registered")
                finally:
                    # In both cases clearing otp
                    session.pop("otp")
                    session.pop("email_otp")
            else:
                # If otp is incorrect
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
        user = db.session.query(Admins).filter(Admins.email == email).first()

        if user is not None:
            # If user is found in database
            if "otp" in session and "email_otp" in session:
                # If otp is present in session storage
                if int(session["otp"]) == int(otp) and email == session["email_otp"]:
                    # If otp is correct
                    # Updating Password
                    db.session.query(Admins).filter(Admins.email == email).update({Admins.password: password})
                    db.session.commit()
                    add_user(email)
                    # Clearing otp
                    session.pop("otp")
                    session.pop("email_otp")
                    return jsonify(error=None)
                else:
                    # If otp is incorrect
                    return jsonify(error="Incorrect OTP")
            else:
                # If otp is not present then request it
                return jsonify(error="Request OTP")
        else:
            # If user is not found in database
            return jsonify(error="Not Registered")


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


if __name__ == '__main__':
    app.run(debug=data["params"]["debug"])
