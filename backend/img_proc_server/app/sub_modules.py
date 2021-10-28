import cv2
import numpy as np
import pickle

PARAM_PATH = './proc_params.pickle'
IMAGE_DIR = './images/'
SUCCESS = 'success'
MISS = 'miss'


def is_ignore_pixel(img, idx, column, kernel_size, p):
    img_crop = img[max(0, idx-int(kernel_size/2)):idx+int(kernel_size/2),
                   max(0, column-int(kernel_size/2)):column+int(kernel_size/2), 1]
    if np.percentile(img_crop, p) == 255:
        # print(idx,column)
        # print(img_crop)
        return False
    else:
        return True


def extract_est_tip(img, diff_image=False, ignore_kernel_size=3, p=50, calib=False, debug=False):
    img_c = img.copy()

    if not diff_image:
        cond_green = (img[:, :, 0] > 40) & (img[:, :, 1] > 40) & (img[:, :, 2] < 30)
        img_c[:, :, 0] = np.where(cond_green, 255, 0)
        img_c[:, :, 1] = np.where(cond_green, 255, 0)
        img_c[:, :, 2] = np.where(cond_green, 255, 0)

    est_xtip, est_ytip = None, None
    for c in range(0, img.shape[1]):
        i = np.argmax(img_c[:, c, 1])
        if is_ignore_pixel(img_c, i, c, ignore_kernel_size, p):
            continue
        est_xtip = c
        est_ytip = i
        break

    if est_xtip == None:
        return MISS, img_c, None, None

    if not calib:
        with open(PARAM_PATH, 'rb') as f:
            proc_params = pickle.load(f)
        dx, dy = proc_params["delta_est"]
        est_xtip += dx
        est_ytip += dy

    if debug:
        # img = cv2.circle(img_c, (est_xtip, est_ytip), 5, (255, 0, 0), 1)
        print(est_xtip, est_ytip)

    return SUCCESS, img_c, est_xtip, est_ytip


def reference_board():
    coordinate_size = 500
    coordinate_center = (250, 250)
    coordinate_r = 198
    coordinate_mergine = coordinate_r / (coordinate_size/2)

    img = np.ones((coordinate_size,coordinate_size,3), np.float32)*255
    cv2.circle(img,coordinate_center,radius=8,color=(0,0,0),thickness=1)
    cv2.circle(img,coordinate_center,radius=22,color=(0,0,0),thickness=1)
    cv2.circle(img,coordinate_center,radius=106,color=(0,0,0),thickness=1)
    cv2.circle(img,coordinate_center,radius=106,color=(0,0,0),thickness=1)
    cv2.circle(img,coordinate_center,radius=126,color=(0,0,0),thickness=1)
    cv2.circle(img,coordinate_center,radius=178,color=(0,0,0),thickness=1)
    cv2.circle(img,coordinate_center,radius=coordinate_r,color=(0,0,0),thickness=1)

    for i in range(20):
        cv2.line(img,(int(coordinate_center[0]+22*np.cos(2*np.pi/20*i+2*np.pi/40)),int(coordinate_center[1]+22*np.sin(2*np.pi/20*i+2*np.pi/40))),(int(coordinate_center[0]+coordinate_r*np.cos(2*np.pi/20*i+2*np.pi/40)),int(coordinate_center[1]+coordinate_r*np.sin(2*np.pi/20*i+2*np.pi/40))),(0,0,0),1)

    return img, coordinate_r, coordinate_center


def calc_score(r, theta):
    dtheta = 2*np.pi/20
    tmp_theta = - 0.5*dtheta
    score_list = [6,13,4,18,1,20,5,12,9,14,11,8,16,7,19,3,17,2,15,10]
    triple_range = (106/198, 126/198)
    double_range = (178/198, 1)

    for i, score in enumerate(score_list):
        if tmp_theta < theta <= tmp_theta+dtheta:
            if triple_range[0] < r <= triple_range[1]:
                score *= 3
            elif double_range[0] < r <= double_range[1]:
                score *= 2
            break
        else:
            tmp_theta += dtheta

    return score