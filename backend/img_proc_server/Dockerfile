FROM python:3.8.0

RUN apt-get update && apt-get upgrade -y
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

# OpenCV
RUN apt-get install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxrender1 libxext6
RUN pip install opencv-python opencv-contrib-python

RUN pip install flask numpy matplotlib pybase64 natsort firebase-admin

RUN pip install scikit-learn mediapipe