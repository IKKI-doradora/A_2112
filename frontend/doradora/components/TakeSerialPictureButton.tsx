import React, {useRef, useCallback, useState} from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, Alert, Text, View} from 'react-native';
import { Camera } from "expo-camera"

import ViewShot, { captureScreen } from "react-native-view-shot"
import { assertBlockParent } from '@babel/types';

interface Props {}
let camera: Camera| null;

export const TakeSerialPictureButton: React.FC<Props> = (props: Props) => {
    const viewShot = useRef<any>(null);
    const [isCameraActivated, setCameraActivated] = useState<Boolean>(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [zoomRatio, setZoomRatio] = useState<number>(0);
  
    const __capture = useCallback(() => {
      viewShot.current.capture().then((uri: string) => {
        // console.log(uri);
        setCapturedImage(uri);
      });
    }, []);

    const __startCamera = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            setCameraActivated(true);
        } else {
            Alert.alert('Access denied');
        }
    }
  
    return (
        <View style={styles.container}>
            {isCameraActivated ? (
                <View style={styles.container1}>
                    <ViewShot ref={viewShot} options={{format: 'jpg', quality: 0.9}} style={styles.viewShotTarget}>
                        <Text>top</Text>
                        <Camera zoom={zoomRatio} ref={(r) => {camera = r}} style={styles.cameraScreen} />
                        <Text>bottom</Text>
                    </ViewShot>
                    
                </View>
            ) : (
                <View>
                    <TouchableOpacity onPress={__startCamera} style={styles.startCameraButton}>
                        <Text style={styles.text1}>
                            Take picture
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity onPress={__capture} style={[styles.button, {top:50}]} />
            <TouchableOpacity onPress={() => setZoomRatio(0)} style={[styles.button, {top:100}]}><Text>zoom:0</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setZoomRatio(0.5)} style={[styles.button, {top:150}]}><Text>zoom:0.5</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setZoomRatio(1)} style={[styles.button, {top:200}]}><Text>zoom:1</Text></TouchableOpacity>
            {capturedImage ? <ImageBackground source={{uri: capturedImage}} style={styles.previewScreen} />: <Text>no image</Text> }
            
        </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  targetView: {
    width: 50,
    height: 50,
    backgroundColor: "#FFAA66",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#AAAAAA",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
  },
  container1: {
    alignItems: "center",
  },
  startCameraButton: {
    width: 130,
    borderRadius: 4,
    backgroundColor: '#14274e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  text1: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cameraScreen: {
      width: 1440,
      height: 1920,
  },
  previewScreen: {
      width: 1200,
      height: 1200,
      zIndex: -1,
  },
  viewShotTarget: {
    position: "absolute",
    left: -4000,
    top: -4000,
  },
});