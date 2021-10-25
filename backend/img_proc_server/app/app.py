from flask import *
import cv2
import numpy as np
import matplotlib.pyplot as plt
import json
import base64

app = Flask(__name__)

@app.route('/', methods = ['POST'])
def post():
    base64Image = json.loads(request.data.decode('UTF-8'))["base64Image"]
    tmp1 = base64.b64decode(base64Image)
    tmp2 = np.frombuffer(tmp1, dtype = np.uint8)
    img = cv2.imdecode(tmp2, cv2.IMREAD_COLOR)
    img2 = cv2.flip(img, 1)
    retval, buffer = cv2.imencode('.jpg', img2)
    base64Image2 = base64.b64encode(buffer).decode('UTF-8')
    print(base64Image2)
    # plt.imshow(img)
    # plt.show()
    
    return make_response(jsonify({'base64Image':base64Image2 }),200)
    # return make_response(jsonify({'error':'Does not support POST method'}),404)


@app.route('/', methods = ['GET'])
def get():
    print("test")
    return make_response(jsonify({'base64Image':"test" }),200)


if __name__ == "__main__":
    app.run(
        host='0.0.0.0', 
        port=5000, debug=True, 
        # use_reloader=False, threaded=False
    )