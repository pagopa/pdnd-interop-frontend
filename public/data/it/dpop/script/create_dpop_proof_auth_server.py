# La versione di Python in uso e' la 3.8
# Prima di lanciare lo script, pip3 install python-jose cryptography
# Attenzione: nella versione di Python 3.10,
# la sintassi cambia e questo script non funziona

from jose import jwt
import datetime
import argparse
import uuid
import os
import base64
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, ec
from cryptography.hazmat.backends import default_backend


def clear():
  os.system('clear')


def to_base64url(value):
  return base64.urlsafe_b64encode(value).rstrip(b'=').decode('ascii')


def int_to_bytes(value):
  if value == 0:
    return b'\x00'
  length = (value.bit_length() + 7) // 8
  return value.to_bytes(length, byteorder='big')


def get_private_key(key_path):
  with open(key_path, "rb") as private_key:
    return private_key.read()


def build_jwk_from_private_key(private_key_pem):
  private_key = serialization.load_pem_private_key(
    private_key_pem,
    password=None,
    backend=default_backend()
  )

  public_key = private_key.public_key()

  if isinstance(public_key, rsa.RSAPublicKey):
    numbers = public_key.public_numbers()
    return {
      "kty": "RSA",
      "n": to_base64url(int_to_bytes(numbers.n)),
      "e": to_base64url(int_to_bytes(numbers.e))
    }

  if isinstance(public_key, ec.EllipticCurvePublicKey):
    numbers = public_key.public_numbers()

    if not isinstance(numbers.curve, ec.SECP256R1):
      raise ValueError("Only EC P-256 keys are supported by this script")

    return {
      "kty": "EC",
      "crv": "P-256",
      "x": to_base64url(int_to_bytes(numbers.x).rjust(32, b'\x00')),
      "y": to_base64url(int_to_bytes(numbers.y).rjust(32, b'\x00'))
    }

  raise ValueError("Only RSA and EC P-256 keys are supported by this script")


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Inputs')
  parser.add_argument('--alg', required=True)
  parser.add_argument('--typ', required=True)
  parser.add_argument('--htm', required=True)
  parser.add_argument('--htu', required=True)
  parser.add_argument('--keyPath', required=True)

  args = parser.parse_args()

  issued = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
  jti = uuid.uuid4()

  rsa_key = get_private_key(args.keyPath)
  jwk = build_jwk_from_private_key(rsa_key)

  headers_rsa = {
    "alg": args.alg,
    "typ": args.typ,
    "jwk": jwk
  }

  payload = {
    "htm": args.htm,
    "htu": args.htu,
    "jti": str(jti),
    "iat": issued
  }

  dpop_proof = jwt.encode(
    payload,
    rsa_key,
    algorithm=args.alg,
    headers=headers_rsa
  )

  clear()
  print(dpop_proof)
