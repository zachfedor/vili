import psycopg2
import pytest

from vili.db import get_conn


def test_get_close_conn(app):
  with app.app_context():
    conn = get_conn()
    assert conn is get_conn(), 'get_conn should always return the same connection'

  with pytest.raises(psycopg2.InterfaceError) as e:
    cur = conn.cursor()
    cur.execute('SELECT 1')

  assert 'closed' in str(e), 'connection should be closed after app context'


def test_init_db_command(runner, monkeypatch):
  class Recorder(object):
    called = False

  def fake_init_db():
    Recorder.called = True

  monkeypatch.setattr('vili.db.init_db', fake_init_db)
  result = runner.invoke(args=['init-db'])
  assert 'Initialized' in result.output
  assert Recorder.called

