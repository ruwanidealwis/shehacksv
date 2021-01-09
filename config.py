

import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = True
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = "random for now"
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
