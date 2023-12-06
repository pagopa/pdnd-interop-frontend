# La versione di Python in uso è la 3.8
# Prima di lanciare lo script, pip3 install python-jose
# Attenzione: nella versione di Python 3.10,
# la sintassi cambia e questo script non funziona 

from jose import jwt
from jose.constants import Algorithms
import datetime
import argparse
import uuid
import os

def clear():
  os.system('clear')

def get_private_key(key_path):
  with open(key_path, "rb") as private_key:
    encoded_string = private_key.read()
    return encoded_string

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Inputs')
  parser.add_argument('--kid', required=True)
  parser.add_argument('--alg', required=True)
  parser.add_argument('--typ', required=True)
  parser.add_argument('--issuer', required=True)
  parser.add_argument('--subject', required=True)
  parser.add_argument('--audience', required=True)
  parser.add_argument('--keyPath', required=True)

  args = parser.parse_args()

  issued = datetime.datetime.utcnow()
  delta = datetime.timedelta(minutes=43200)
  expire_in = issued + delta
  jti = uuid.uuid4()

  headers_rsa = {
    "kid": args.kid,
    "alg": args.alg,
    "typ": args.typ
  }

  payload = {
    "iss": args.issuer,
    "sub": args.subject,
    "aud": args.audience,
    "jti": str(jti),
    "iat": issued,
    "exp": expire_in
  }

  rsaKey = get_private_key(args.keyPath)

  client_assertion = jwt.encode(payload, rsaKey, algorithm=Algorithms.RS256, headers=headers_rsa)

  clear()
  print(client_assertion)