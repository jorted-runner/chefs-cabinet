import requests, json, pprint, time
from requests.auth import HTTPBasicAuth
import errno
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
import hashlib
import base64


ACCOUNT_SID = 'xxxxxx'
AUTH_TOKEN = 'xxxxxxxx'
BASE_URL = 'https://products.api.impactradius.com/Mediapartners/{}/'.format(ACCOUNT_SID)
API_PATH = 'Catalogs/4277'
consumerId = 'xxxxxxxx'
epoxTime = str(int(time.time()*1000))
keyVersion = '1'

URL = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items'


hashDict = { 'WM_CONSUMER.ID' : consumerId,
            'WM_CONSUMER.INTIMESTAMP' : epoxTime,
            'WM_SEC.KEY_VERSION' : keyVersion
            }
sortedHashString = hashDict['WM_CONSUMER.ID'] +'\n'+ hashDict['WM_CONSUMER.INTIMESTAMP'] +'\n'+ hashDict['WM_SEC.KEY_VERSION']+'\n'
encodedHashString = sortedHashString.encode()

try:
    with open('./WM_IO_private_key.pem', 'r') as f:
        key = RSA.importKey(f.read())
except IOError as e:
    print(e)

hasher = SHA256.new(encodedHashString)
signer = PKCS1_v1_5.new(key)
signature = signer.sign(hasher)

signature_enc = str(base64.b64encode(signature),'utf-8')

headers = { 'WM_CONSUMER.ID' : consumerId,
            'WM_CONSUMER.INTIMESTAMP' : epoxTime,
            'WM_SEC.AUTH_SIGNATURE' : signature_enc,
            'WM_SEC.KEY_VERSION' : keyVersion,
            'WM_QOS.CORRELATION_ID' : 'afjksldkfj4r8ojfns',
            'WM_IFX.CLIENT_TYPE' : 'INTERNAL',
            'WM_PREVIEW' : 'false',
            'WM_SHOW_REASON_CODES' : 'ALL',
            'Content-Type' : 'application/json',
            }

params = {
            'category' : '4171_1228385',
            'publisherId' : 'xxxxxxxxxxx'
        }

response = requests.get(URL, headers=headers, params=params)

jsonData = json.loads(response.text)
