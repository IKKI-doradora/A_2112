
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import { Camera, CameraCapturedPicture } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import { CapturedPicture } from 'expo-camera/build/Camera.types'
import { SCOPABLE_TYPES } from '@babel/types'

let camera: Camera | null


export default function TakePictureScreen() {
  const [isCameraActivated, setCameraActivated] = useState<Boolean>(false)
  const [isSerialCameraActivated, setSerialCameraActivated] = useState<Boolean>(false)
  const [isPreviewVisible, setPreviewVisible] = useState<Boolean>(false)
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null)

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status === 'granted') {
      setCameraActivated(true)
    } else {
      Alert.alert('Access denied')
    }
  }

  const __toggleSerialCamera = async () => {
      if(isSerialCameraActivated){
        setSerialCameraActivated(false);
      } else {
        setSerialCameraActivated(true);
        const intervalID: number = window.setInterval(() => {
          setSerialCameraActivated((active) => {
            if(!active) window.clearInterval(intervalID);
            return active;
          })
          __retakePicture();
          __takePicture();
          }, 3000);
      }
  }

  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync({ base64: true })
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }

  const __processImage = async (width=209, height=408) => {
    console.log("-----------------")
    console.log(width)
    if(capturedImage){
      const resizedImage = await ImageManipulator.manipulateAsync(
        capturedImage.uri,
        [{ resize: { width:width,height:height } },],
        { base64: true, compress: 1 }
      )
      fetch(`http://proc.memotube.xyz/`, {
        method: 'POST',
        body: JSON.stringify({base64Image: resizedImage.base64}),
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(res => res.json())
        .then(
          data => {
            const newImage : CameraCapturedPicture = {uri: "data:image/jpg;base64,"+data.base64Image, base64: data.base64Image, width, height}
            setCapturedImage(newImage)
          }
        )
    }
    return true;
  }

  return (
    <View style={styles.container}>
      {isCameraActivated ? (
        <View style={{ flex: 1, width: '100%' }}>
          {isPreviewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} processImage={__processImage} retakePicture={__retakePicture} />
          ) : (
            <Camera ref={(r) => { camera = r }} style={{ flex: 1 }}>
              <View style={styles.c1}>
                <View style={styles.c2}>
                  <View style={styles.c3}>
                    <TouchableOpacity onPress={__toggleSerialCamera} style={styles.b1}/>
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View style={styles.c4}>
          <TouchableOpacity onPress={__startCamera} style={styles.b2}>
            <Text style={styles.t1}>
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}

const CameraPreview = (props: {photo: CapturedPicture, retakePicture: VoidFunction, processImage: (arg1?: number, arg2?: number) => Promise<Boolean>}
  ) => {
  return (
    <View style={styles.c5}>
      <ImageBackground source={{ uri: props.photo && props.photo.uri }} style={{ flex: 1 }}>
        <View style={styles.c6} >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            
            <TouchableOpacity onPress={props.retakePicture} style={styles.b3}>
              <Text style={styles.previewText}>
                Re-take
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>props.processImage()} style={styles.b3}>
              <Text style={styles.previewText}>
                process image
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
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

  c1: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row'
    
  },

  c2: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between'
  },

  c3: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center'
  },


  b1: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: '#fff'
  },

  c4: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 200,
    paddingBottom: 200,
  },

  b2: {
    width: 130,
    borderRadius: 4,
    backgroundColor: '#14274e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },

  t1:{
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  c5: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    height: '100%'
  },

  c6: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    justifyContent: 'flex-end'
  },

  b3: {
    width: 130,
    height: 40,
    alignItems: 'center',
    borderRadius: 4
  },

  previewText: { 
    color: '#fff', 
    fontSize: 20 
  },

})