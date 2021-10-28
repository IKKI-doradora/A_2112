import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio, Video } from "expo-av";

export const TakeVideoScreen: React.FC<{}> = ({ }) => {
    const [cam, setCam] = useState<Camera | null>(null);
    const [vid, setVid] = useState<string | null>(null);
    const [hasCameraPermission, setCameraPermission] = useState<Boolean>(false);
    const [hasAudioPermission, setAudioPermission] = useState<Boolean>(false);
    const [isSerialRecordActivated, setSerialRecordActivated] = useState<Boolean>(false);
    const [isRecordActivated, setRecordActivated] = useState<Boolean>(false);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer | null>(null);

    const startRecord = async () => {
        if (cam) {
            console.log('take video')
            setRecordActivated(true);
            let video = await cam.recordAsync({ mute: true, maxDuration: 10 });
            console.log('video', video);
            setVid(video.uri);
        }
    }

    const stopRecord = async () => {
        if (cam) {
            console.log("stop video");
            setRecordActivated(false);
            const end = await cam.stopRecording();
            return end;
        }
    }

    const toggleSerialRecord: VoidFunction = async () => {
        if (isSerialRecordActivated) {
            console.log("video stopped");
            setSerialRecordActivated(false);
            if (intervalID) clearInterval(intervalID);
            stopRecord();
        } else {
            setSerialRecordActivated(true);
            const id = setInterval(() => {
                stopRecord().then(() => {
                    startRecord();
                });
            }, 1000);
            setIntervalID(id);
        }
    }

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(cameraPermission.status === 'granted');
            const audioPermission = await Audio.requestPermissionsAsync();
            setAudioPermission(audioPermission.status === "granted")
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={(ref) => setCam(ref)}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { toggleSerialRecord() }}>
                        <Text style={styles.text}> {isSerialRecordActivated ? "Stop" : "Start"} </Text>
                    </TouchableOpacity>
                </View>
            </Camera>

            {vid ? (<Video
                source={{ uri: vid }}
                style={styles.previewScreen}
                useNativeControls
                resizeMode="contain"
                isLooping
            />
            ) : (<Text>no image</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    camera: {
        width: 300,
        height: 300,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 15,
        color: "#44CC44",
    },
    buttonContainer: {
        width: 300,
        height: 300,
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 20,
    },
    previewScreen: {
        width: 300,
        height: 300,
    }
})