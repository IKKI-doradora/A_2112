import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from 'react-native'
import { Camera } from 'expo-camera'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { useNavigation } from '@react-navigation/core';
import { RootStackScreenProps } from '../types';


type CalibrationScreenProps = RootStackScreenProps<'Calibration'>;

export default function CaputuprePreview({ photo, retakePicture, calibrateCV, sendArrowImage }: any) {
    const navigation = useNavigation<CalibrationScreenProps['navigation']>()

    const [arrowPosition, setArrowPosition] = useState({ 'x': 250, 'y': 125 })
    const [nowZoomLevel, setNowZoomLevel] = useState(1.0)
    const [anchorActivations, setAnchorActivations] = useState([false, false, false, false])
    const [markerActivation, setMarkerActivations] = useState([false, false, false, false])
    const [rMarker, setRMarker] = useState(4)
    const [rAnchor, setRAnchor] = useState(6)
    const [markerPositions, setMarkerPositions] = useState([[50, 250], [200, 250], [125, 120], [125, 380]])
    const [anchorPositions, setAnchorPositions] = useState([[20, 30], [230, 30], [230, 500], [20, 500]])
    const [doneImgProcess, setDoneImgProcess] = useState(false)
    const [isManulMarker, setIsManualMarker] = useState(false)

    const moveMarkerPosition = (evt: any) => {
        console.log("-----------------")
        if (anchorActivations.some((v) => v == true)) {
            const id = anchorActivations.findIndex((v) => v == true)
            const x = evt.nativeEvent.locationX
            const y = evt.nativeEvent.locationY
            let ap = anchorPositions
            ap[id] = [y, x]
            if (id == 0) {
                ap[1] = [ap[2][0], x]
                ap[3] = [y, ap[2][1]]
            }
            if (id == 1) {
                ap[0] = [ap[3][0], x]
                ap[2] = [y, ap[3][1]]
            }
            if (id == 2) {
                ap[3] = [ap[0][0], x]
                ap[1] = [y, ap[0][1]]
            }
            if (id == 3) {
                ap[2] = [ap[1][0], x]
                ap[0] = [y, ap[1][1]]
            }
            setAnchorPositions(ap)
            setAnchorActivations([false, false, false, false])
        } else if (markerActivation.some((v) => v == true)) {
            const id = markerActivation.findIndex((v) => v == true)
            const x = evt.nativeEvent.locationX
            const y = evt.nativeEvent.locationY
            let ap = markerPositions
            ap[id] = [y, x]
            setMarkerPositions(ap)
            setMarkerActivations([false, false, false, false])
        } else {
            const x = evt.nativeEvent.locationX
            const y = evt.nativeEvent.locationY
            console.log(nowZoomLevel)
            console.log(`x: ${x}, y: ${y}`)
            setArrowPosition({ 'x': x, 'y': y })
        }

        return true;
    }

    const activateRectangleAnchor = (evt: any, id: number) => {
        let tmp = [false, false, false, false]
        tmp[id] = true
        setAnchorActivations(tmp)
        setMarkerActivations([false, false, false, false])
    }

    const activateMarker = (evt: any, id: number) => {
        let tmp = [false, false, false, false]
        tmp[id] = true
        setMarkerActivations(tmp)
        setAnchorActivations([false, false, false, false])
    }

    const reflectZoomLevel = (event, gestureState, zoomableViewEventObject) => {
        // console.log(zoomableViewEventObject)
        setNowZoomLevel(zoomableViewEventObject.zoomLevel)
        // setRMarker(1.*rMarker/zoomableViewEventObject.zoomLevel)
        // setRAnchor(1.*rAnchor/zoomableViewEventObject.zoomLevel)
    }

    const switchManualMarker = () => {
        if (isManulMarker) {
            setIsManualMarker(false)
        } else {
            setIsManualMarker(true)
        }
    }


    return (
        <View style={styles.zoomWrapper}>

            <ReactNativeZoomableView
                zoomEnabled={true}
                maxZoom={3}
                minZoom={0.5}
                zoomStep={0.25}
                initialZoom={1.0}
                bindToBorders={true}
                onZoomAfter={reflectZoomLevel}
                style={{
                    // padding: 10,
                }}
            >
                <Pressable
                    style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        width: '100%',
                        height: '100%'
                    }}
                    onPress={(evt) => moveMarkerPosition(evt)}
                >
                    <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />

                </Pressable >

                <View style={{
                    width: 2 * rMarker,
                    height: 2 * rMarker,
                    borderRadius: rMarker,
                    backgroundColor: "yellow",
                    overflow: "hidden",
                    position: 'absolute',
                    top: arrowPosition.y - rMarker,
                    left: arrowPosition.x - rMarker,
                }}
                ></View>

                {(() => {
                    let anchors = []
                    for (let i = 0; i < 4; i++) {
                        anchors.push(
                            <Pressable
                                style={anchorStyle(anchorActivations[i], anchorPositions[i], rAnchor)} //position: 'absolute' によるワーニング. 期待通りに動く. むしろこれを外すとマーカー位置がおかしくなる.
                                onPress={(evt) => activateRectangleAnchor(evt, i)}
                                key={i}
                            ></Pressable >
                        )
                    }
                    return anchors
                })()}

                {isManulMarker ?
                    (() => {
                        let markers = []
                        for (let i = 0; i < 4; i++) {
                            markers.push(
                                <Pressable
                                    style={markerStyle(markerActivation[i], markerPositions[i], rMarker)} //position: 'absolute' によるワーニング. 期待通りに動く. むしろこれを外すとマーカー位置がおかしくなる.
                                    onPress={(evt) => activateMarker(evt, i)}
                                    key={i}
                                ></Pressable >
                            )
                        }
                        return markers
                    })()
                : <></>}


            </ReactNativeZoomableView>

            <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
                <TouchableOpacity style={styles.button} >
                    <Text style={styles.buttonTitle} onPress={() => retakePicture(setDoneImgProcess)} >Re-Take</Text>
                </TouchableOpacity>
            </View>

            {doneImgProcess ?
                <View style={{ position: 'absolute', bottom: 10, left: 500 }}>
                    <TouchableOpacity style={styles.button} >
                        <Text style={styles.buttonTitle} onPress={() => navigation.navigate("Game")} >To Game Screen</Text>
                    </TouchableOpacity>
                </View>
                :
                <View>
                    <View style={{ position: 'absolute', bottom: 10, left: 250 }}>
                        <TouchableOpacity style={styles.button} >
                            <Text style={styles.buttonTitle} onPress={switchManualMarker} >Manual Marker</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', bottom: 10, left: 500 }}>
                        <TouchableOpacity style={styles.button} >
                            <Text style={styles.buttonTitle} onPress={(evt) => calibrateCV(evt, [arrowPosition.y, arrowPosition.x], markerPositions, anchorPositions, setDoneImgProcess, isManulMarker)} >Calibrate Image</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

        </View>


    )
}



const styles = StyleSheet.create({
    zoomWrapper: {
        flex: 1,
        overflow: 'hidden',
    },

    button: {
        width: 160,
        height: 30,
        padding: 0,
        borderRadius: 10,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        bottom: 2,
    },

    buttonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

const markerStyle = (markerActivation: boolean, moveMarkerPosition: Array<number>, rMarker: number) => ({
    width: 2 * rMarker,
    height: 2 * rMarker,
    borderRadius: rMarker,
    backgroundColor: markerActivation ? 'purple' : "red",
    // overflow: "hidden",
    position: 'absolute',
    top: moveMarkerPosition[0] - rMarker,
    left: moveMarkerPosition[1] - rMarker,
})

const anchorStyle = (anchorActivation: boolean, anchorPosition: Array<number>, rAnchor: number) => ({
    width: 2 * rAnchor,
    height: 2 * rAnchor,
    borderRadius: rAnchor,
    backgroundColor: anchorActivation ? 'purple' : "orange",
    overflow: "hidden",
    position: 'absolute',
    top: anchorPosition[0] - rAnchor,
    left: anchorPosition[1] - rAnchor,
})