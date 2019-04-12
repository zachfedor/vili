import os

import pytest

from . import create_app
from vili.db import get_conn, init_db


@pytest.fixture
def app():
  app = create_app({
    'TESTING': True,
    'DB_NAME': 'vili_test',
    'DB_USER': 'vili_user',
  })

  with app.app_context():
    init_db()

    with open(os.path.join(os.path.dirname(__file__), 'data', 'mock.sql'), 'rb') as f:
      with get_conn() as conn:
        with conn.cursor() as cur:
          cur.execute(f.read())

  yield app


@pytest.fixture
def client(app):
  return app.test_client()


@pytest.fixture
def runner(app):
  return app.test_cli_runner()

