

import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = True
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = "random for now"
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL_DEV')


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL_DEV')


config_settings = {

    'development': DevelopmentConfig
}
