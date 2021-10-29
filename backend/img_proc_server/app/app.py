from flask import *
import cv2
import numpy as np
import matplotlib.pyplot as plt
import json
import base64
from main_modules import *

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


@app.route('/calib', methods = ['POST'])
def calib():
    base64Image = json.loads(request.data.decode('UTF-8'))["base64Image"]
    arrow_point = json.loads(request.data.decode('UTF-8'))["arrowPoint"]
    marker_points = json.loads(request.data.decode('UTF-8'))["markerPoints"]
    crop_points = json.loads(request.data.decode('UTF-8'))["cropPoints"]
    manual_marker = json.loads(request.data.decode('UTF-8'))["manualMarker"]

    img_org = image_preprocess(base64Image, calib=True)
    

    # arrow_point = [int(arrow_point[0]*h  - h_crop[0]), int(arrow_point[1]*w -w_crop[0])]
    # marker_points = np.array([[int(marker_point[1]*w - w_crop[0]), int(marker_point[0]*h - h_crop[0])] for marker_point in marker_points])

    img = init_calib(img_org, arrow_point, marker_points, crop_points, debug=True, manual_marker=manual_marker)

    if img is None:
        return make_response(jsonify({'base64Image':base64Image }),200)
    else:
        # img = cv2.resize(img, img_org.shape[:2])
        retval, buffer = cv2.imencode('.jpg', img)
        base64Image2 = base64.b64encode(buffer).decode('UTF-8')
        
        return make_response(jsonify({'base64Image':base64Image2 }),200)


@app.route('/arrow', methods = ['POST'])
def arrow(count):
    base64ImagePrev = json.loads(request.data.decode('UTF-8'))["base64ImagePrev"]
    base64Image = json.loads(request.data.decode('UTF-8'))["base64Image"]

    img_prev, _ = image_preprocess(base64ImagePrev, calib=False)
    img, img_org = image_preprocess(base64ImagePrev, calib=False)

    # img, r, theta, score = detect_arrow(img, img_prev, count)
    img, x, y, score = detect_arrow(img, img_prev, count)

    # if img is None:
    #     return make_response(jsonify({'base64Image':base64Image }),200)
    # else:
    #     # img = cv2.resize(img, img_org.shape[:2])
    #     retval, buffer = cv2.imencode('.jpg', img)
    #     base64Image2 = base64.b64encode(buffer).decode('UTF-8')
    #     return make_response(jsonify({'base64Image':base64Image2 }),200)

    return make_response(jsonify({'x': x, 'y': y, 'score': score}),200)


@app.route('/trajectory', methods = ['POST'])
def proc_movie():
    base64Movie = json.loads(request.data.decode('UTF-8'))["base64"]
    dec_base64 = base64.b64decode(base64Movie)
    dec_arrays = np.frombuffer(dec_base64, dtype=np.uint8)
    images = []
    #ToDo 動作確認
    for dec_array in len(dec_arrays):
        image = cv2.imdecode(dec_array, cv2.IMREAD_COLOR)
        images.append(image)

    base64mp4 = detc_traj(images)
    
    return make_response(jsonify({'base64mp4':base64mp4 }),200)


if __name__ == "__main__":
    app.run(
        host='0.0.0.0', 
        port=5000, debug=True, 
        # use_reloader=False, threaded=False
    )