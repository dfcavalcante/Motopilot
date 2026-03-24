import psycopg2
import sys

try:
    conn = psycopg2.connect('postgresql://postgres:12345@localhost:5432/motopilot_db')
    print('SUCCESS')
except psycopg2.Error as e:
    print('DB_ERROR_CODE:', e.pgcode)
    print('DB_ERROR_MSG:', e.pgerror)
    print('ARGS:', e.args)
except Exception as e:
    print('OTHER_ERROR:', type(e), e)
