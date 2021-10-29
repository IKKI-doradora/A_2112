import cv2
import numpy as np
import base64
from math import atan2
import pickle
import glob
from natsort import natsorted
import matplotlib.pyplot as plt
from sub_modules import *


def image_preprocess(base64Image, calib=False):
    tmp1 = base64.b64decode(base64Image)
    tmp2 = np.frombuffer(tmp1, dtype=np.uint8)
    img_org = cv2.imdecode(tmp2, cv2.IMREAD_COLOR)

    if not calib:
        with open(PARAM_PATH, 'rb') as f:
            proc_params = pickle.load(f)
        h_crop, w_crop = proc_params["crop_points"]
        img = img_org[h_crop[0]:h_crop[1], w_crop[0]:w_crop[1], :]

        return img, img_org

    return img_org


def init_calib(img_org, arrow_point, marker_points, crop_points, debug=True, manual_marker = True):
    img = img_org.copy()

    # 画像処理に使う部分をクロップ
    h, w = img.shape[:2]
    crop_points = np.array([[int(crop_point[0]*h), int(crop_point[1]*w)] for crop_point in crop_points])
    h_crop = np.sort(list(set(crop_points[:, 0])))
    w_crop = np.sort(list(set(crop_points[:, 1])))
    img = img[h_crop[0]:h_crop[1], w_crop[0]:w_crop[1], :]

    # 変換後にボードを囲う矩形サイズ
    rect_size = min(img.shape[:2])

    # 予測補正量計算
    arrow_point = [int(arrow_point[0]*h - h_crop[0]),int(arrow_point[1]*w - w_crop[0])]
    status, _, est_xtip, est_ytip = extract_est_tip(img, diff_image=False, ignore_kernel_size=3, p=50, calib=True)
    if status == MISS:
        return None

    true_xtip, true_ytip = arrow_point[1], arrow_point[0]
    dx = true_xtip - est_xtip
    dy = true_ytip - est_ytip

    # _ = cv2.circle(_, (arrow_point[1], arrow_point[0]), 3, (0, 120, 120), -1)  # 視覚デバッグ用
    # _ = cv2.circle(_, (est_xtip, est_ytip), 3, (0, 0, 255), -1) 
    # return _

    # 変換前後の対応点を設定
    if manual_marker:
        marker_points = np.array([[int(marker_point[1]*w - w_crop[0]), int(marker_point[0]*h - h_crop[0])] for marker_point in marker_points])
    else:
        img_filtered = img.copy()
        cond_green = (img_filtered[:,:,0]>30)&(img_filtered[:,:,1]>70)&(img_filtered[:,:,2]<60)

        img_filtered[:,:,0] = np.where(cond_green, 255, 0)
        img_filtered[:,:,1] = np.where(cond_green, 255, 0)
        img_filtered[:,:,2] = np.where(cond_green, 255, 0)

        img_filtered = cv2.blur(img_filtered, (8,8))

        img_filtered[:,:,0] = np.where(img_filtered[:,:,0]>0, 255, 0)
        img_filtered[:,:,1] = np.where(img_filtered[:,:,1]>0, 255, 0)
        img_filtered[:,:,2] = np.where(img_filtered[:,:,2]>0, 255, 0)

        img_filtered_gray = cv2.cvtColor(img_filtered, cv2.COLOR_BGR2GRAY)
        circles = cv2.HoughCircles(img_filtered_gray , cv2.HOUGH_GRADIENT, dp=0.3, minDist=50, param1=100, param2=2, minRadius=0, maxRadius=0)[0]
        circles = [circle for circle in circles if circle[2] < 10] # 画角に合わせて要調整
        if debug:
            print(circles)

        if len(circles) != 4:
            img_filtered_circle = img_filtered.copy()
            for circle in circles:
                cv2.circle(img_filtered_circle, (int(circle[0]), int(circle[1])), int(circle[2]), (0, 255, 0), 1)
                cv2.circle(img_filtered_circle, (int(circle[0]), int(circle[1])), 2, (0, 255, 0), 2)
            print(circles)
            return img_filtered_circle

        # # 視覚デバッグ用
        # img_filtered_circle = img_filtered.copy()
        # for circle in circles:
        #     cv2.circle(img_filtered_circle, (circle[0], circle[1]), circle[2], (0, 255, 0), 1)
        #     cv2.circle(img_filtered_circle, (circle[0], circle[1]), 2, (0, 255, 0), 2)
        # return img_filtered_circle

        marker_points = [circle[:2].astype(int) for circle in circles]

    idx_mp = np.argsort([mp[0] for mp in marker_points], axis=0)
    marked_points = np.array(marker_points)[idx_mp]

    p_trans = np.array([[0.5, 0.1], [0.5, 0.9], [0.9, 0.5], [0.1, 0.5]])
    idx = np.argsort(p_trans[:, 0], axis=0)
    if ((marked_points[1, 1] > marked_points[2, 1]) & (idx[1] < idx[2])) or ((marked_points[1, 1] < marked_points[2, 1]) & (idx[1] > idx[2])):
        tmp = idx[1]
        idx[1] = idx[2]
        idx[2] = tmp
    p_trans = p_trans[idx]

    p_original = np.float32(marked_points)
    p_trans = p_trans.astype(np.float32)*rect_size

    # 射影変換行列
    M1 = cv2.getPerspectiveTransform(p_original, p_trans)

    # 変換実行
    img = cv2.circle(img, (arrow_point[1], arrow_point[0]), 3, (0, 120, 120), -1)  # 視覚デバッグ用
    img = cv2.circle(img, (est_xtip, est_ytip), 3, (0, 0, 255), -1) 
    for marker_point in marker_points:
        cv2.circle(img, marker_point, 6, (0, 0, 255), 1)
    img_disp = cv2.warpPerspective(img, M1, (rect_size, rect_size))
    img = cv2.warpPerspective(img, M1, (img.shape[1], img.shape[0]))

    # ボード中心, 半径計算
    board_center = [rect_size*0.5, rect_size*0.5]
    # デバッグ用として video のマーカー・半径比を使用, 後で修正
    vec = np.array(marker_points[0]) - np.array(board_center)
    board_radius = np.linalg.norm(vec, ord=2) * 19.5 / 24

    # キャリブレーションで得たパラメータを保存
    proc_params = {
        "M1": M1,
        "delta_est": (dx, dy),
        "board": [*board_center, board_radius],
        "crop_points": (h_crop, w_crop),
    }
    f = open(PARAM_PATH, 'wb')
    pickle.dump(proc_params, f)
    f.close()

    if debug:
        print(proc_params)

    h_padding = int((img_org.shape[0]-rect_size)/2)
    w_padding = int((img_org.shape[1]-rect_size)/2)
    img_disp = cv2.copyMakeBorder(img_disp, h_padding, h_padding, w_padding, w_padding, cv2.BORDER_CONSTANT, (0,0,0))

    return img_disp


def detect_arrow(img_prev, img, arrow_count):
    # 補正付き投擲位置推定
    # status, img, est_tipx, est_tipy = extract_est_tip(img, ignore_kernel_size=3, calib=False)
    # if status == MISS:
    #     return None, None, None, 0

    # cv2.imwrite(IMAGE_DIR + f'arrow{arrow_count}.jpg', img)

    # if arrow_count >= 2:
    #     files = natsorted(glob.glob(IMAGE_DIR + "*.jpg"))
    #     if len(files) == 1:
    #         pass
    #     else:
    #         file = files[-2]
    #         img_prev = cv2.imread(file)
    #         img = cv2.absdiff(img, img_prev)
    #         img, est_tipx, est_tipy = extract_est_tip(img, ignore_kernel_size=3, diff_image=True, calib=False)

    _, img_prev, _, _ = extract_est_tip(img_prev, ignore_kernel_size=3, calib=False)
    _, img, _, _ = extract_est_tip(img, ignore_kernel_size=3, calib=False)
    img = cv2.absdiff(img, img_prev)
    status, img, est_tipx, est_tipy = extract_est_tip(img, ignore_kernel_size=3, calib=False)
    if status == MISS:
        return None, None, None, 0

    # 正面化, ボード座標系 (曲座標) に変換
    with open(PARAM_PATH, 'rb') as f:
        proc_params = pickle.load(f)
    M1 = proc_params["M1"]
    board = proc_params["board"]
    board_center = board[:2]
    board_radius = board[2]

    est_tip_front = cv2.perspectiveTransform(np.array([[[est_tipx, est_tipy]]], dtype=np.float32), M1)[0][0]
    est_tipx_front = est_tip_front[0]
    est_tipy_front = est_tip_front[1]

    x = est_tipx_front - board_center[0]
    y = est_tipy_front - board_center[1]
    theta = atan2(y, x) 
    r = np.linalg.norm(np.array([x,y]), ord=2) / board_radius #正規化

    # スコア計算
    score = calc_score(r, theta)

    # 視覚的に確認
    ref_image, ref_r, ref_center = reference_board()
    vis_x = ref_r * r * np.cos(theta) + ref_center[0]
    vis_y = ref_r * r * np.sin(theta) + ref_center[1]
    print(int(vis_x), int(vis_y))
    cv2.circle(ref_image, (int(vis_x), int(vis_y)), 4, (0, 0, 255), -1)

    # return ref_image, theta, r, score
    return ref_image, r*np.cos(theta), np.sin(theta), score

