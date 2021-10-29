import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import { View, Text } from "../components/Themed"
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video } from "expo-av"

export default function TrajectoryScreen() {
    const [trajectoryUri, setTrajectoryUri] = useState<string | null>(null);
    const [sourceUri, setSourceUri] = useState<string | null>(null);

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            _getTrajectory(result.uri);
            console.log(result.uri);
        }
    }

    const _getTrajectory = async (uri: string) => {
        setSourceUri(uri);
        const video = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        console.log(video.length);

        // キャッシュへの書き込みテスト
        // const newUri = FileSystem.cacheDirectory + "trajectory.mov";
        // await FileSystem.writeAsStringAsync(newUri, video, { encoding: 'base64' });
        // setTrajectoryUri(newUri);

        fetch("http://192.168.43.129:5000/trajectory", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({base64: video}),
        })
        .then(res => {console.log(res); return res.json()})
        .then(async data => {
            const newUri = FileSystem.cacheDirectory + "trajectory.mov";
            await FileSystem.writeAsStringAsync(newUri, data.base64mp4, { encoding: "base64" });
            setTrajectoryUri(newUri);
        });

        // 通信テスト
        // fetch("http://proc.memotube.xyz/video", {
        //     method: "POST",
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({base64: video}),
        // })
        //     .then(res => {return res.text()})
        //     .then(data => console.log(data));
        
    }
    

    useEffect(() => {
        (async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        })();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={pickVideo} style={styles.button}><Text>Pick an video from camera roll</Text></TouchableOpacity>
                {/* <TouchableOpacity onPress={() => {setTrajectoryUri(uri => uri)}} style={styles.button}/> */}
            </View>
            <View style={{flex: 5, alignItems: 'center', justifyContent: 'center' }}>
                {trajectoryUri ? (
                    <Video 
                        source={{uri: trajectoryUri}} 
                        style={styles.videoScreen}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                    />
                ) : (<Text>Please choose a video</Text>)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#FF9900",
        width: 300,
        height: 50,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    videoScreen: {
        width: 600,
        height: 300,
    },
});