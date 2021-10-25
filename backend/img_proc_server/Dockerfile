FROM python:3.8.0

RUN apt-get update && apt-get upgrade -y
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

# OpenCV
RUN apt-get install -y libgl1-mesa-glx libglib2.0-0 libsm6 libxrender1 libxext6
RUN pip install opencv-python
RUN pip install opencv-contrib-python

RUN pip install flask numpy matplotlib
RUN pip install pybase64

RUN mkdir /app