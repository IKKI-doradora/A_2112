import React, {useRef, useCallback, useState} from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, Alert, Text, View} from 'react-native';
import { Camera } from "expo-camera"

import ViewShot, { captureScreen } from "react-native-view-shot"

interface Props {}
let camera: Camera| null;

export const ViewShotScreen: React.FC<Props> = (props: Props) => {
    const viewShot = useRef<any>(null);
    const [isCameraActivated, setCameraActivated] = useState<Boolean>(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
    const __capture = useCallback(() => {
      viewShot.current.capture().then((uri: string) => {
        // console.log(uri);
        setCapturedImage(uri);
      });
    }, []);

    const __capture2 = () => captureScreen({
        format: "jpg",
        quality: 0.8,
    }).then(
        uri => {console.log("Image saved to", uri); setCapturedImage(uri)},
        error => console.error("Oops, snapshot failed", error)
    );

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
                    <ViewShot ref={viewShot} options={{format: 'jpg', quality: 0.9}}>
                        <View>
                            <View style={styles.targetView} />
                            <Text>top</Text>
                        </View>
                        <Camera ref={(r) => {camera = r}} style={styles.cameraScreen} />
                        <Text>bottom</Text>
                    </ViewShot>
                    <TouchableOpacity onPress={__capture} style={styles.button} />
                    <TouchableOpacity onPress={__capture2} style={styles.button} />

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
      width: 200,
      height: 200,
  },
  previewScreen: {
      width: 300,
      height: 300,
  }
});