import cv2
import numpy as np
import base64
from math import atan2
import pickle
import glob
from natsort import natsorted
from PIL import Image, ImageDraw
from sub_modules import *


IGNORE_KERNEL_SIZE = 12
P = 60

def image_preprocess(base64Image, calib=False):
    tmp1 = base64.b64decode(base64Image)
    tmp2 = np.frombuffer(tmp1, dtype=np.uint8)
    img_org = cv2.imdecode(tmp2, cv2.IMREAD_COLOR)
    # print("org shape", img_org.shape)

    # cv2.imwrite('./work/test3.png', img_org)
    if not calib:
        with open(PARAM_PATH, 'rb') as f:
            proc_params = pickle.load(f)
        h_crop, w_crop = proc_params["crop_points"]
        img = img_org[int(h_crop[0]):int(h_crop[1]), int(w_crop[0]):int(w_crop[1]), :]
        # print(img.shape)
        # cv2.imwrite('./work/test3_crop.png', img)

        return img, img_org

    return img_org


def init_calib(img_org, arrow_point, marker_points, crop_points, debug=True, manual_marker = True):
    img = img_org.copy()

    # 画像処理に使う部分をクロップ
    h, w = img.shape[:2]
    crop_points = np.array(
        [[int(crop_point[0]*h), int(crop_point[1]*w)] for crop_point in crop_points])
    # print(crop_points)
    h_crop = np.sort(list(set(crop_points[:, 0])))
    w_crop = np.sort(list(set(crop_points[:, 1])))
    img = img[h_crop[0]:h_crop[1], w_crop[0]:w_crop[1], :]

    # 変換後にボードを囲う矩形サイズ
    rect_size = min(img.shape[:2])

    # 予測補正量計算
    arrow_point = [int(arrow_point[0]*h - h_crop[0]),int(arrow_point[1]*w - w_crop[0])]
    status, img_arrow, est_xtip, est_ytip = extract_est_tip(img, diff_image=False, ignore_kernel_size=IGNORE_KERNEL_SIZE, p=P, calib=True)
    if status == MISS:
        return img_arrow

    true_xtip, true_ytip = arrow_point[1], arrow_point[0]
    dx = true_xtip - est_xtip
    dy = true_ytip - est_ytip

    _ = cv2.circle(img_arrow, (arrow_point[1], arrow_point[0]), 3, (0, 120, 120), -1)  # 視覚デバッグ用
    _ = cv2.circle(_, (est_xtip, est_ytip), 3, (0, 0, 255), -1) 
    cv2.imwrite('./work/calib_tip.png', _)
    # return _

    # 変換前後の対応点を設定
    if manual_marker:
        marker_points = np.array([[int(marker_point[1]*w - w_crop[0]), int(marker_point[0]*h - h_crop[0])] for marker_point in marker_points])
    else:
        img_filtered = img.copy()
        cond_green = (img_filtered[:,:,0]>50)&(img_filtered[:,:,0]<30)&(img_filtered[:,:,1]>30)&(img_filtered[:,:,2]<30)

        img_filtered[:,:,0] = np.where(cond_green, 255, 0)
        img_filtered[:,:,1] = np.where(cond_green, 255, 0)
        img_filtered[:,:,2] = np.where(cond_green, 255, 0)

        img_filtered = cv2.blur(img_filtered, (8,8))

        img_filtered[:,:,0] = np.where(img_filtered[:,:,0]>0, 255, 0)
        img_filtered[:,:,1] = np.where(img_filtered[:,:,1]>0, 255, 0)
        img_filtered[:,:,2] = np.where(img_filtered[:,:,2]>0, 255, 0)

        img_filtered_gray = cv2.cvtColor(img_filtered, cv2.COLOR_BGR2GRAY)
        circles = cv2.HoughCircles(img_filtered_gray , cv2.HOUGH_GRADIENT, dp=0.6, minDist=200, param1=100, param2=2, minRadius=0, maxRadius=0)[0]
        circles = [circle for circle in circles if circle[2] < 20] # 画角に合わせて要調整
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
  

def detect_arrow(img_prev, img, debug=True):
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

    img_org = img.copy()

    # No diff
    # _, _, est_tipx0, est_tipy0 = extract_est_tip(img, diff_image=False, ignore_kernel_size=IGNORE_KERNEL_SIZE, p=P, calib=True)
    # status, img, est_tipx, est_tipy = extract_est_tip(img, diff_image=False, ignore_kernel_size=IGNORE_KERNEL_SIZE, p=P, calib=False)
    # if debug:
    #     cv2.circle(img, (int(est_tipx0), int(est_tipy0)), 4, (255, 0, 255), -1)
    #     cv2.circle(img, (int(est_tipx), int(est_tipy)), 4, (0, 0, 255), -1)
    #     cv2.imwrite('./work/out_gray.png', img)

    #     cv2.circle(img_org, (int(est_tipx0), int(est_tipy0)), 4, (255, 0, 255), -1)
    #     cv2.circle(img_org, (int(est_tipx), int(est_tipy)), 4, (0, 0, 255), -1)
    #     cv2.imwrite('./work/out_color.png', img_org)


    # Use diff
    _, img_prev, _, _ = extract_est_tip(img_prev, ignore_kernel_size=IGNORE_KERNEL_SIZE, p = P, calib=False)
    _, img, _, _ = extract_est_tip(img, ignore_kernel_size=IGNORE_KERNEL_SIZE, p = P, calib=False)
    cv2.imwrite('./work/gray1.png', img_prev)
    cv2.imwrite('./work/gray2.png', img)
    img = cv2.absdiff(img, img_prev)
    status, img, est_tipx, est_tipy = extract_est_tip(img, diff_image=True, ignore_kernel_size=IGNORE_KERNEL_SIZE, p = P, calib=False)
    if debug:
        img_diff = img.copy()
        cv2.circle(img_diff, (int(est_tipx), int(est_tipy)), 4, (0, 0, 255), -1)
        cv2.imwrite('./work/gray_diff.png', img_diff)
        color_diff = img_org.copy()
        cv2.circle(img_org, (int(est_tipx), int(est_tipy)), 4, (0, 0, 255), -1)
        cv2.imwrite('./work/color_diff.png', color_diff)

    # cv2.circle(img, (int(est_tipx), int(est_tipy)), 4, (0, 0, 255), -1)
    # cv2.imwrite('./work/test3.png', img)

    # cv2.circle(img_org, (int(est_tipx), int(est_tipy)), 4, (0, 0, 255), -1)
    # cv2.imwrite('./work/test4.png', img_org)

    # cv2.circle(img_org, (int(est_tipx), int(est_tipy)), 4, (0, 0, 255), -1)
    # cv2.imwrite('./work/out_color.png', img_org)

    

    # print("est tip: ", est_tipx, est_tipy)
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
    # x = est_tipx_front -196
    # y = est_tipy_front - 181
    theta = atan2(y, x)
    r = np.linalg.norm(np.array([x,y]), ord=2) / board_radius #正規化
    r = np.linalg.norm(np.array([x,y]), ord=2) / board_radius

    # score = calc_score(r, theta)

    # print(r, theta, score)

    # 視覚的に確認
    ref_image, ref_r, ref_center = reference_board()
    vis_x = ref_r * r * np.cos(theta) + ref_center[0]
    vis_y = ref_r * r * np.sin(theta) + ref_center[1]

    score = calc_score(r=ref_r * r,theta=theta)

    # r = r / ref_r

    cv2.circle(ref_image, (int(vis_x), int(vis_y)), 4, (0, 0, 255), -1)
    cv2.imwrite('./work/image_ref.png', ref_image)

    theta = (theta+2*np.pi)
    x = r * np.cos(theta)
    y = r * -np.sin(theta)

    print('x',x,'y',y,'theta',theta, 'score', score)
    
    return ref_image, x, y, score
    #(204,180), (203,189), (168,301), (171,181)

def detc_traj(cap):
    # 調整用パラメータ
    # start_idx = 220
    # end_idx = 320
    start_idx = 315
    end_idx = 450

    hmin = 200
    hmax = 530
    wmin = 50
    wmax = 1600

    x_offset = 350
    vis_x_offset = x_offset + wmin
    vis_y_offset = hmin

    # cap を frames に変換
    frames = []
    for idx in range(start_idx,end_idx,1):
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        _, frame = cap.read()
        frames.append(frame)

    # 羽, 矢先端軌道, リリース位置を検出
    release_flag = False
    release_idx = 0
    cv2_imgs = []
    trajectory = []
    axis_list = []
    for idx in range(0, len(frames), 1):
        # print(idx)
        tmp_img = frames[idx][hmin:hmax,wmin+x_offset:wmax,:].copy()

        # 手の検出
        cond_blue = (130<tmp_img[:,:,0]) & (tmp_img[:,:,0]<180)
        cond_green = (150<tmp_img[:,:,1]) & (tmp_img[:,:,1]<190)
        cond_red = (200<tmp_img[:,:,2]) & (tmp_img[:,:,2]<230)
        condition = cond_blue & cond_green & cond_red
        img_hand, _, _ = extract_arrow(tmp_img, condition, ignore_kernel_size = 8, p = 60)

        # 羽の検出
        cond_blue = (30<tmp_img[:,:,0]) & (tmp_img[:,:,0]<90)
        cond_green = 70<tmp_img[:,:,1]
        cond_red = (30<tmp_img[:,:,2]) & (tmp_img[:,:,2]<90)
        condition = cond_blue & cond_green & cond_red

        cond_blue = (100<tmp_img[:,:,0]) & (tmp_img[:,:,0]<150)
        cond_green = 150<tmp_img[:,:,1]
        cond_red = (100<tmp_img[:,:,2]) & (tmp_img[:,:,2]<150)
        condition = (cond_blue & cond_green & cond_red) | condition

        img_arrow, est_xtip, est_ytip = extract_arrow(tmp_img, condition, ignore_kernel_size = 16, p = 70)
        trajectory.append([est_xtip, est_ytip])

        # 先端の検出
        if est_xtip == est_xtip:
            axis = estimate_axis(img_arrow, est_xtip, est_ytip, kernel=30, rate=55)
            axis_list.append(axis)
            if detect_release(img_arrow, img_hand, axis, kernel=10) and (not release_flag):
                release_flag = True
                release_idx = idx
                print(idx)
        else:
            axis_list.append([[None, None], [None,None]])

        vis_frame = frames[idx].copy()

        for (est_xtip, est_ytip), axis in zip(trajectory, axis_list):
            if est_xtip==est_xtip:
                cv2.line(vis_frame,(axis[0][0]+vis_x_offset, axis[0][1]+vis_y_offset), (axis[1][0]+vis_x_offset, axis[1][1]+vis_y_offset),(255,0,0),3)
                cv2.circle(vis_frame, (int(est_xtip)+vis_x_offset, int(est_ytip)+vis_y_offset), 6, (0, 0, 255), -1)
            
        cv2_imgs.append(vis_frame)

    # 取得した軌跡から追加情報プロット
    max_idx = np.argmin(np.nan_to_num(np.array(trajectory)[:,1],nan = 1000))
    max_height_x = int(trajectory[max_idx][0])
    max_height_y = int(trajectory[max_idx][1])
    release_x = int(trajectory[release_idx][0])
    release_y = int(trajectory[release_idx][1])

    imgs = []
    gif_imgs = []
    for i, img in enumerate(cv2_imgs):
        tmp_img = img.copy()
        if i >= release_idx:
            cv2.circle(tmp_img, (release_x+vis_x_offset, release_y+vis_y_offset), 36, (255, 255, 255), 1)
            cv2.circle(tmp_img, (release_x+vis_x_offset, release_y+vis_y_offset), 32, (0, 0, 0), 2)
            cv2.circle(tmp_img, (release_x+vis_x_offset, release_y+vis_y_offset), 28, (255, 255, 255), 1)
            cv2.putText(tmp_img,
                    text='Release',
                    org=(release_x+40+vis_x_offset, release_y-60+vis_y_offset),
                    fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                    fontScale=1.5,
                    color=(0, 0, 0),
                    thickness=4,
                    lineType=cv2.LINE_4)
            drawDashedLine(tmp_img, (release_x+vis_x_offset, release_y+vis_y_offset), (release_x+vis_x_offset, img.shape[0]), 8, 2, (255,0,255))
        if i >= max_idx:
            cv2.circle(tmp_img, (max_height_x+vis_x_offset, max_height_y+vis_y_offset), 36, (255, 255, 255), 1)
            cv2.circle(tmp_img, (max_height_x+vis_x_offset, max_height_y+vis_y_offset), 32, (0, 0, 0), 2)
            cv2.circle(tmp_img, (max_height_x+vis_x_offset, max_height_y+vis_y_offset), 28, (255, 255, 255), 1)
            cv2.putText(tmp_img,
                    text='Max Height',
                    org=(max_height_x+40+vis_x_offset, max_height_y-60+vis_y_offset),
                    fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                    fontScale=1.5,
                    color=(0, 0, 0),
                    thickness=4,
                    lineType=cv2.LINE_4)
            drawDashedLine(tmp_img, (max_height_x+vis_x_offset, max_height_y+vis_y_offset), (max_height_x+vis_x_offset, img.shape[0]), 8, 2, (255,0,255))

        tmp_img = annotate_pose(tmp_img)
        imgs.append(tmp_img)

        tmp_img = cv2.cvtColor(tmp_img, cv2.COLOR_BGR2RGB)
        gif_imgs.append(Image.fromarray(tmp_img))
    gif_imgs[0].save('./work/output3.gif', save_all=True, append_images=gif_imgs[1:], optimize=False, loop=0)

    # mp4に変換
    height, width, layers = tmp_img.shape
    size = (width,height)

    out = cv2.VideoWriter('./work/video_proc.mp4',cv2.VideoWriter_fourcc(*'DIVX'), 15, size)
    for i in range(len(imgs)):
        out.write(imgs[i])
    out.release()

    # base64に変換
    with open('./work/video_proc.mp4', "rb") as f:
        data = f.read()
    
    encode = base64.b64encode(data).decode('UTF-8')
    
    return encode


def calc_score(r, theta):
    theta += np.pi

    score_list = [11,14,9,12,5,20,1,18,4,13,6,10,15,2,17,3,19,7,16,8]

    dtheta = 2*np.pi/20
    tmp_theta = - 0.5*dtheta
    triple_range = (106, 126)
    double_range = (178, 198)

    # print("r",r,"theta",theta)

    for i, score in enumerate(score_list):
        if r <= 8:
            score = 50
        elif r <= 22:
            score = 25
        if tmp_theta < theta <= tmp_theta+dtheta:
            if triple_range[0] < r <= triple_range[1]:
                score *= 3
            elif double_range[0] < r <= double_range[1]:
                score *= 2
            break
        else:
            tmp_theta += dtheta
    return score