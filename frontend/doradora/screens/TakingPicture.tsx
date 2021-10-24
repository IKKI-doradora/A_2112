
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import { Camera, CameraCapturedPicture } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import { CapturedPicture } from 'expo-camera/build/Camera.types'
let camera: Camera | null


export default function TakingPicture() {
  const [isCameraActivated, setCameraActivated] = useState<Boolean>(false)
  const [isPreviewVisible, setPreviewVisible] = useState<Boolean>(false)
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null)

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    // console.log(status)
    if (status === 'granted') {
      setCameraActivated(true)
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
        // [{ resize: { width: capturedImage.width / 8, height: capturedImage.height / 8 } },],
        [{ resize: { width:width,height:height } },],
        { base64: true, compress: 1 }
      )
      // console.log(resizedImage.width)
      // console.log(resizedImage.height)
      // console.log(capturedImage.width)
      // console.log(capturedImage.height)
      fetch(`https://proc.memotube.xyz/`, {
        method: 'POST',
        body: JSON.stringify({base64Image: resizedImage.base64}),
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(res => res.json())
        .then(
          data => {
            // console.log(data.base64Image)
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
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {isPreviewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} processImage={__processImage} retakePicture={__retakePicture} />
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
  }
})


const CameraPreview = (props: {photo: CapturedPicture, retakePicture: VoidFunction, processImage: (arg1?: number, arg2?: number) => Promise<Boolean>}
  ) => {
  // console.log('sdsfds', photo)
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{ uri: props.photo && props.photo.uri }}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={props.retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>props.processImage()}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                process image
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}