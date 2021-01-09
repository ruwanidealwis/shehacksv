from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os



migrate = Migrate()

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


from user import User

@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    app.run(debug=True)
