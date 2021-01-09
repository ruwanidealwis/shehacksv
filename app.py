from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import config_settings
import os



migrate = Migrate()

app = Flask(__name__)
app.config.from_object(config_settings['development'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


from user import User

@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    app.run(debug=True)
