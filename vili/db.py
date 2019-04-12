import os
import psycopg2

import click
from flask import current_app, g
from flask.cli import with_appcontext


def get_conn():
  if 'conn' not in g:
    # open a connection, save it to close when done
    DB_URL = os.environ.get('DATABASE_URL', None)
    if DB_URL:
      g.conn = psycopg2.connect(DB_URL, sslmode='require')
    else:
      g.conn = psycopg2.connect(
        f"dbname={current_app.config['DB_NAME']}" +
        f" user={current_app.config['DB_USER']}"
      )

  return g.conn


def close_conn(e=None):
  conn = g.pop('conn', None)

  if conn is not None:
    conn.close() # close the connection


def init_db():
  conn = get_conn()

  with current_app.open_resource('data/schema.sql') as f:
    cur = conn.cursor()
    cur.execute(f.read())
    cur.close()
    conn.commit()


@click.command('init-db')
@with_appcontext
def init_db_command():
  """Clear the existing data and create new tables."""
  init_db()
  click.echo('Initialized the database.')


def init_app(app):
  app.teardown_appcontext(close_conn)
  app.cli.add_command(init_db_command)

