from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_marshmallow import Marshmallow

DB_NAME = "database.db"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
db = SQLAlchemy(app)
#db.init_app(app)
ma = Marshmallow(app)



def create_app():
    

    # from WebApp-Project TODO: remove or implement?
    from .routes.test_routes import test_routes

    app.register_blueprint(test_routes, url_prefix='/')
    
    from .database.models import Player

    with app.app_context():
        db.create_all()
    
    return app


def create_database(app):
    if not path.exists('src/database' + DB_NAME):
        db.create_all(app=app)
        print('Created Database!')
