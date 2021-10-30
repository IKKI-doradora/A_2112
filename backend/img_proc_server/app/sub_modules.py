import cv2
import numpy as np
import base64
from math import atan2
import pickle
from sklearn.decomposition import PCA
from sklearn import preprocessing
import mediapipe as mp

PARAM_PATH = './work/proc_params.dat'
IMAGE_DIR = './work/'
SUCCESS = 'success'
MISS = 'miss'


def is_ignore_pixel(img, idx, column, kernel_size, p):
    img_crop = img[max(0, idx-int(kernel_size/2)):idx+int(kernel_size/2),
                   max(0, column-int(kernel_size/2)):column+int(kernel_size/2), 1]
    # print(np.percentile(img_crop, p))
    if np.percentile(img_crop, p) > 10:
        return False
    else:
        return True


def extract_est_tip(img, diff_image=False, ignore_kernel_size=3, p=50, calib=False, debug=False):
    img_c = img.copy()

    if not diff_image:
        # cond_green = (img[:, :, 0] > 40) & (img[:, :, 1] > 40) & (img[:, :, 2] < 30)
        cond_green = (img[:, :, 0] <60) & (img[:, :, 1] > 60) & (img[:, :, 2] < 70)
        img_c[:, :, 0] = np.where(cond_green, 255, 0)
        img_c[:, :, 1] = np.where(cond_green, 255, 0)
        img_c[:, :, 2] = np.where(cond_green, 255, 0)

    est_xtip, est_ytip = None, None
    for c in range(0, img.shape[1]):
        # print("C:", c, np.max(img_c[:, c, 1]))
        i = np.argmax(img_c[:, c, 1])
        if is_ignore_pixel(img_c, i, c, ignore_kernel_size, p):
            continue
        est_xtip = c
        est_ytip = i
        break
    # print(est_xtip, est_ytip)

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


def is_ignore_pixel2(img, idx, column, kernel_size, p):
    img_crop = img[max(0,idx-int(kernel_size/2)):idx+int(kernel_size/2), max(0,column-int(kernel_size/2)):column+int(kernel_size/2), 1]
    # print(img_crop.shape)
    if np.percentile(img_crop, p) == 255:
        # print(idx,column)
        # print(img_crop)
        return False, img_crop
    else:
        return True, img_crop


def extract_arrow(img, condition, diff_image = False, ignore_kernel_size = 3, p = 50):
    img_arrow = img.copy()


    if not diff_image:    
        img_arrow[:,:,0] = np.where(condition, 255, 0)
        img_arrow[:,:,1] = np.where(condition, 255, 0)
        img_arrow[:,:,2] = np.where(condition, 255, 0)
        

    est_xtip, est_ytip = np.nan, np.nan
    for c in range(0,img.shape[1]):
        i = np.argmax(img_arrow[:,c,1])
        state, img_crop = is_ignore_pixel2(img_arrow,i,c,ignore_kernel_size,p)
        if state:
            continue
        est_xtip = c
        est_ytip = i
        # print(img_crop)
        break

    return img_arrow, est_xtip, est_ytip


def estimate_axis(img, est_xtip, est_ytip, kernel, rate=20):
    # print(img)
    # print(max(0,est_ytip-kernel),est_ytip+kernel, max(0,est_xtip-kernel),est_xtip+kernel)
    img = img[max(0,est_ytip-kernel):est_ytip+kernel, max(0,est_xtip-kernel):est_xtip+kernel, 1].copy()
    # print(img)
    x, y = np.where(img > 10)
    samples = np.array([x,y]).T
    mm = preprocessing.MinMaxScaler()
    samples = mm.fit_transform(samples)
    # samples = scipy.stats.zscore(samples)

    pcamodel = PCA()
    pcamodel.fit(samples)
    pca_cor = pcamodel.transform(samples)
    # print(pca_cor)
    dx, dy = pcamodel.components_[0]
    if dx > 0:
        axis = np.array([[est_xtip-rate*dx, est_ytip-rate*dy], [est_xtip, est_ytip]], dtype=int)
    else:
        axis = np.array([[est_xtip, est_ytip], [est_xtip+rate*dx, est_ytip+rate*dy]], dtype=int)

    return axis


def lineList(x1, y1, x2, y2): 
    line_lst = []
    step = 0
    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    if dx > dy:
        if x1 > x2 :
            step = 0
            if y1 > y2:
                step = 1
            else:
                step = -1
            x1, x2 = x2, x1 # swap
            y1 = y2;
        else:
            if y1 < y2:
                step = 1
            else:
                step = -1
        line_lst.append((x1, y1))
        s = dx >> 1
        x1 += 1
        while (x1 <= x2):
            s -= dy
            if s < 0:
                s += dx
                y1 += step
            line_lst.append((x1, y1))
            x1 += 1
    else:
        if y1 > y2:
            if x1 > x2:
                step = 1
            else:
                step = -1
           
            y1, y2 = y2, y1 # swap
            x1 = x2
        else:
            if x1 < x2:
                step = 1
            else:
                step = -1
        line_lst.append((x1, y1))
        s = dy >> 1
        y1 += 1
        while y1 <= y2:
            s -= dx
            if s < 0:
                s += dy
                x1 += step
            line_lst.append((x1, y1))
            y1 += 1
    return  line_lst

#   img         イメージ
#   start_point 始点
#   end_point   終点
#   gap         点線ギャップ（間隔）
#   linewidth   線幅
#   color       色
#
def drawDashedLine(img, start_point, end_point, gap, linewidth, color):
    li = lineList(start_point[0], start_point[1], end_point[0], end_point[1])
    fwd = start_point
    bwd = start_point
    j = 0
    for i, pt in enumerate(li):
        if i % gap == 0:
            bwd = pt

            if(j % 2):
                cv2.line(img, fwd, bwd, color, linewidth, lineType=cv2.LINE_AA)
            fwd = bwd
            j += 1
    return img


def annotate_pose(image):
    mp_drawing = mp.solutions.drawing_utils 
    drawing_spec = mp_drawing.DrawingSpec(thickness=6, circle_radius=1, color=(0,0,0))
    drawing_spec2 = mp_drawing.DrawingSpec(thickness=6, circle_radius=1, color=(255,0,255))
    mp_pose = mp.solutions.pose
    with mp_pose.Pose(
        static_image_mode=True, min_detection_confidence=0.5) as pose:
        # Convert the BGR image to RGB and process it with MediaPipe Pose.
        results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        # Print nose landmark.
        image_hight, image_width, _ = image.shape
        annotated_image = image.copy()
        mp_drawing.draw_landmarks(
            image=annotated_image,
            landmark_list=results.pose_landmarks,
            connections=mp_pose.POSE_CONNECTIONS,
            landmark_drawing_spec=drawing_spec2,
            connection_drawing_spec=drawing_spec,
            )
    return annotated_image


def detect_release(img_arrow, img_hand, axis, kernel=5):
    p_grasp = axis[np.argmin(axis[:,0])]
    pg_minw, pg_maxw = p_grasp[0]-kernel, p_grasp[0]+kernel
    pg_minh, pg_maxh = p_grasp[1]-kernel, p_grasp[1]+kernel
    grasp_area = np.sum(img_hand[pg_minh:pg_maxh,pg_minw:pg_maxw,:])
    if grasp_area == 0:
        return True
    else:
        return False