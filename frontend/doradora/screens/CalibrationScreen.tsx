import { useNavigation, useRoute } from '@react-navigation/core';
import { RootStackScreenProps } from '../types';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions } from 'react-native'
import { Camera, CameraCapturedPicture } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import CapturePreview from '../components/CapturePreview';
import { useStore } from '../hooks/useStore';

type CalibrationScreenProps = RootStackScreenProps<'Calibration'>;
let camera: Camera | null;

const url = 'http://192.168.0.162:5000';
// const url = 'http://proc.memotube.xyz';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CalibrationScreen() {
  const navigation = useNavigation<CalibrationScreenProps['navigation']>();
  const route = useRoute<CalibrationScreenProps["route"]>();

  const [isCameraStarted, setIsCameraStarted] = useState<boolean>(false);
  const [canPreview, setCanPreview] = useState<boolean>(false); // !!capturedImage に置き換えられるからいらない説
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const user = useStore(e => e.user);

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    status == 'granted' ? setIsCameraStarted(true) : Alert.alert('Access denied');
  };

  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync({ base64: true });
    setCanPreview(true);
    console.log(photo.height, photo.width);
    setCapturedImage(photo);
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setCanPreview(false);
    __startCamera();
  };

  const __calibrateCV = async (
    arrowPosition: {x: number; y: number},
    markerPoints: number[][],
    cropPoints: number[][],
    isManualMarker: boolean
  ) => {
    if (!capturedImage) return; // 空のときの処理，Todo

    console.log("-----------------");
    console.log(windowHeight, windowWidth);
    console.log(capturedImage.height, capturedImage.width);

    const resizedImage = await ImageManipulator.manipulateAsync(
      capturedImage.uri,
      [{ resize: { width: capturedImage.width / 3, height: capturedImage.height / 3 } },],
      { base64: true, compress: 1 }
    );

    arrowPosition.y /= windowHeight;
    arrowPosition.x /= windowWidth;
    cropPoints.forEach(cropPoint => {
      cropPoint[0] /= windowHeight;
      cropPoint[1] /= windowWidth;
    });
    markerPoints.forEach(markerPoint => {
      markerPoint[0] /= windowHeight;
      markerPoint[1] /= windowWidth;
    });

    // リクエスト部分は別関数に切り出したい
    const _body = ({
      base64Image: resizedImage.base64,
      arrowPoint: [arrowPosition.y, arrowPosition.x],
      markerPoints: markerPoints,
      cropPoints: cropPoints,
      manualMarker: isManualMarker,
    });

    fetch(url + "/calib", {
      method: 'POST',
      body: JSON.stringify(_body),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
      console.log("status", res.status)
      return res.json()
    })
    .then(data => {
      const newImage = { uri: "data:image/jpg;base64," + data.base64Image, base64: data.base64Image, height: resizedImage.height, width: resizedImage.width }
      setCapturedImage(newImage)
    });
  };

  return (
    <View style={styles.container}>
      {isCameraStarted ? ( // 較正画面
        canPreview && capturedImage ? (
          <View style={{flex: 1, width: '100%'}}>
            <CapturePreview
              photoUri={capturedImage.uri}
              calibrateCV={__calibrateCV}
              retakePicture={__retakePicture}
              toGameScreenFn={() => navigation.navigate("Game", route.params)}
            />
          </View>
        ) : ( // 撮影画面
          <Camera style={{flex: 1, width:'100%'}} ratio={'16:9'} ref={(r) => {camera = r}}>
            <View style={styles.takePictureContainer}>
              <TouchableOpacity style={styles.takePictureButton} onPress={__takePicture}/>
            </View>
          </Camera>
        )
      ) : ( // 撮影前画面
        <View style={styles.preTakePictureContainer}>
          <TouchableOpacity style={styles.button} onPress={__startCamera}>
            <Text style={styles.buttonTitle}>Take picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Game", route.params)}>
            <Text style={styles.buttonTitle}>Start game</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  takePictureContainer: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  takePictureButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#fff',
  },

  preTakePictureContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  button: {
    width: 130,
    borderRadius: 4,
    backgroundColor: '#14274e',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },

  buttonTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});