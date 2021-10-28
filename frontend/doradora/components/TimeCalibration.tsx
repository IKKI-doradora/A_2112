import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import {View, Text} from "../components/Themed";
import { Camera, CameraCapturedPicture } from 'expo-camera';
import {Slider} from "react-native-elements";

type Props = {
    pictures: Array<CameraCapturedPicture | null>;
    setPictures: React.Dispatch<React.SetStateAction<(CameraCapturedPicture | null)[]>>;
    threshold: number;
    setThreshold: React.Dispatch<React.SetStateAction<number>>;
    isPicturesActive: Array<Boolean>;
};

export const TimeCalibration: React.FC<Props> = (props: Props) => {
    const {pictures, setPictures, threshold, setThreshold, isPicturesActive} = props;

    const [camera, setCamera] = useState<Camera | null>(null);
    const [hasCameraPermission, setCameraPermission] = useState<Boolean>(false);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer | null>(null);
    const [pictureIndex, setPictureIndex] = useState<number>(0);
    const [isCameraFinished, setCameraFinished] = useState<Boolean>(false);

    const __takePicture = async () => {
        if(!camera) return;
        const photo = await camera.takePictureAsync({ base64: true });
        setPictures((picturePaths) => {
            let newPicturePaths = picturePaths.slice(0, picturePaths.length);
            newPicturePaths[pictureIndex] = photo;
            return newPicturePaths;
        });
    }

    const __controlInterval = () => {
        if(pictureIndex === pictures.length && intervalID){
            setPictureIndex(0);
            clearInterval(intervalID);
        }
    }

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(cameraPermission.status === 'granted');
            if(hasCameraPermission){
                const id = setInterval(() => {
                    __takePicture();
                    setPictureIndex((number) => {return number + 1});
                    __controlInterval();
                }, 100);
                setIntervalID(id);
          }
        })();
      }, []);

    return (
        <View style={styles.container}>
            {hasCameraPermission ? (
                <Camera ref={(ref) => setCamera(ref)} style={styles.cameraScreen} />
            ) : (<Text style={styles.text}>Video is not allowed</Text>)}

            {isCameraFinished && pictures[pictureIndex] ? (
                <View>
                    <ImageBackground source={{uri: pictures[pictureIndex]?.uri ?? undefined}} style={styles.previewScreen}/>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => setPictureIndex((index) => {return index > 4 ? index - 5 : 0;})}>
                            <Text>{"<<"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPictureIndex((index) => {return index > 0 ? index - 1 : index;})}>
                            <Text>{"<"}</Text>
                        </TouchableOpacity>
                        
                        <Text style={[styles.text, {color: isPicturesActive[pictureIndex] ? "#AA0000" : "#0000AA"}]}>{pictureIndex+1}/{pictures.length}</Text>
                       
                        <TouchableOpacity onPress={() => setPictureIndex((index) => {return index < pictures.length - 1 ? index + 1 : index;})}>
                            <Text>{">"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPictureIndex((index) => {return index < pictures.length - 5 ? index + 5 : pictures.length - 1;})}>
                            <Text>{">>"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text>{threshold}</Text>
                        <Slider 
                            value={threshold} 
                            onValueChange={(value) => setThreshold(value)} 
                            maximumValue={1}
                            minimumValue={0}
                            step={0.1}
                        />
                    </View>

                </View>
            ) : (<Text>Taking picture now...</Text>)}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    cameraScreen: {
        width: 300,
        height: 300,
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: "#AAAAAA",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 15,
        color: "#44CC44",
    },
    buttonContainer: {
        width: 100,
        height: 100,
        padding: 20,

        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    previewScreen: {
        width: 300,
        height: 300,
    },
    sliderContainer: {
        flexDirection: "column"
    },
})