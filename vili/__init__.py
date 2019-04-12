from flask import Flask, render_template


def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)

  app.config.from_mapping(
    SECRET_KEY='dev',
    DB_NAME='vili',
    DB_USER='vili_user',
  )

  if test_config is None:
    app.config.from_pyfile('config.py', silent=True)
  else:
    app.config.from_mapping(test_config)

  from . import db
  db.init_app(app)

  @app.route('/')
  def index():
    return 'Vili API'

  return app

