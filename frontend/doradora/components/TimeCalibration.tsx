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
    diffs: Array<number>;
};

export const TimeCalibration: React.FC<Props> = (props: Props) => {
    const {pictures, setPictures, threshold, setThreshold, diffs} = props;

    const [camera, setCamera] = useState<Camera | null>(null);
    const [hasCameraPermission, setCameraPermission] = useState<Boolean>(false);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer | null>(null);
    const [pictureIndex, setPictureIndex] = useState<number>(0);
    const [isCameraStarted, setCameraStarted] = useState<Boolean>(false);
    const [isCameraFinished, setCameraFinished] = useState<Boolean>(false);

    const __takePicture = async () => {
        if(!camera) return;
        const photo = await camera.takePictureAsync({ base64: true });
        setPictureIndex((index) => {
            setPictures((pictures) => {
                let newPictures = pictures.slice(0, pictures.length);
                newPictures[index] = photo;
                return newPictures;
            });
            return index;
        }); 
    }

    const __controlInterval = () => {
        setPictureIndex((index) => {
            setIntervalID((id) => {
                if(index === pictures.length && id){
                    setPictureIndex(0);
                    clearInterval(id);
                    setCameraFinished(true);
                }
                return id;
            })
            return index;
        })
    }

    const __startCamera = () => {
        if(isCameraStarted) return;
        setCameraStarted(true);
        const id = setInterval(() => {
            __takePicture();
            setPictureIndex((number) => {return number + 1});
            __controlInterval();
        }, 1000);
        setIntervalID(id);
    }

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(cameraPermission.status === 'granted');
        })();
      }, []);

    return (
        <View style={{width: "100%", height: "100%"}}>
            {isCameraFinished && pictures[pictureIndex] ? (
                <View style={styles.container}>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: diffs[pictureIndex] > threshold ? "#AA0000" : "#0000AA"}}>
                        <ImageBackground source={{uri: pictures[pictureIndex]?.uri ?? undefined}} style={styles.previewScreen}/>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setPictureIndex((index) => {return index > 4 ? index - 5 : 0;})} style={styles.button}>
                                <Text style={styles.buttonTitle}>{"<<"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPictureIndex((index) => {return index > 0 ? index - 1 : index;})}style={styles.button}>
                                <Text style={styles.buttonTitle}>{"<"}</Text>
                            </TouchableOpacity>
                            
                            <Text style={[styles.text, {color: diffs[pictureIndex] > threshold ? "#CC0000" : "#0000CC"}]}>{pictureIndex+1}/{pictures.length}</Text>
                        
                            <TouchableOpacity onPress={() => setPictureIndex((index) => {return index < pictures.length - 1 ? index + 1 : index;})} style={styles.button}>
                                <Text style={styles.buttonTitle}>{">"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPictureIndex((index) => {return index < pictures.length - 5 ? index + 5 : pictures.length - 1;})} style={styles.button}>
                                <Text style={styles.buttonTitle}>{">>"}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sliderContainer}>
                            <Text style={styles.text}>{threshold}</Text>
                            <Slider 
                                value={threshold} 
                                onValueChange={(value) => setThreshold(value)} 
                                maximumValue={1}
                                minimumValue={0}
                                step={0.1}
                            />
                        </View>

                        <View style={{flex: 2, alignItems: "center", justifyContent: "center"}}>
                            <TouchableOpacity style={styles.decideButton}><Text style={styles.buttonTitle}>確定</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : hasCameraPermission ? (
                <View style={styles.container}>
                    <View style={{flex: 1, }}>
                        <Camera ref={(ref) => setCamera(ref)} style={styles.cameraScreen} />
                    </View>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => __startCamera()} style={styles.startButton}><Text style={styles.buttonTitle}>start</Text></TouchableOpacity>
                    </View>
                </View>
            ) : (<Text>Camera is not allowed</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flex: 1,
        flexDirection: "row",
    },
    cameraScreen: {
        width: 300,
        height: 300,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#AAAAAA",
        margin: 10,

        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
    },
    buttonContainer: {
        flex: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    previewScreen: {
        width: 300,
        height: 300,
    },
    sliderContainer: {
        flex: 1,
        backgroundColor: "#AAAAAA",
        borderRadius: 10,

        padding: 30,
        flexDirection: "column",
        justifyContent: "center",
    },
    decideButton: {
        width: 200,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#FF9900",
        margin: 10,

        justifyContent: "center",
        alignItems: "center",
    },
    startButton: {
        width: 200,
        height: 100,
        borderRadius: 10,
        backgroundColor: "#AAAAAA",

        justifyContent: "center",
        alignItems: "center",
    },
    buttonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})