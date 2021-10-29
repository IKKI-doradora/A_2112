import { useNavigation } from '@react-navigation/core';
// import * as React from 'react';
// import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RootStackScreenProps } from '../types';
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions } from 'react-native'
import { Camera } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import CapturePreview from '../components/CapturePreview'
let camera: Camera

const url = 'http://192.168.1.4:5000'
// const url = 'http://proc.memotube.xyz';
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default function CameraTest() {
  const [startCamera, setStartCamera] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<any>(null)

  const __startCamera = async () => {
    // const { status } = await Camera.requestPermissionsAsync()
    const { status } = await Camera.requestCameraPermissionsAsync()
    // console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }

  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync({ base64: true })
    // console.log(photo)
    // console.log(photo.base64)
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  const __retakePicture = (setDoneImgProcess: any) => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
    setDoneImgProcess(false)
  }

  const __calibrateCV = async (evt: any, arrowPoint: Array<number>, markerPoints: Array<number>, cropPoints: Array<number>, setDoneImgProcess: any, isManualMarker: boolean) => {
    console.log("-----------------")
    console.log(windowHeight, windowWidth)
    console.log(capturedImage.height, capturedImage.width)
    
    const resizedImage = await ImageManipulator.manipulateAsync(
      capturedImage.uri,
      [{ resize: { width: capturedImage.width / 3, height: capturedImage.height / 3 } },],
      // [{ resize: { width: 450, height: 900 } },],
      { base64: true, compress: 1 }
    )

    arrowPoint[0] /= windowHeight
    arrowPoint[1] /= windowWidth
    cropPoints.forEach(cropPoint => {
      cropPoint[0] /= windowHeight
      cropPoint[1] /= windowWidth
    })
    markerPoints.forEach(markerPoint => {
      markerPoint[0] /= windowHeight
      markerPoint[1] /= windowWidth
    })

    fetch(url + "/calib", {
      method: 'POST',
      body: JSON.stringify({
        base64Image: resizedImage.base64,
        arrowPoint: arrowPoint,
        markerPoints: markerPoints,
        cropPoints: cropPoints,
        manualMarker: isManualMarker,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(
        data => {
          const newImage = { uri: "data:image/jpg;base64," + data.base64Image, base64: data.base64Image }
          setCapturedImage(newImage)
        }
      )

    setDoneImgProcess(true)

    return true;
  }


  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {previewVisible && capturedImage ? (
            <CapturePreview photo={capturedImage} calibrateCV={__calibrateCV} retakePicture={__retakePicture} />
          ) : (
            <Camera
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});