import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from firebase_admin import db

cred = credentials.Certificate('./doradora-admin.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'doradora-e51d2.appspot.com',
    'databaseURL': 'https://doradora-e51d2-default-rtdb.asia-southeast1.firebasedatabase.app/',

})

bucket = storage.bucket()




