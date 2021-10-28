import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image } from 'react-native'
import { Camera } from 'expo-camera'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';


export default function CaputuprePreview({ photo, retakePicture, calibrateCV, sendArrowImage }: any) {
    const [arrowPosition, setArrowPosition] = useState({ 'x': 250, 'y': 125 })
    const [nowZoomLevel, setNowZoomLevel] = useState(1.0)
    const [anchorActivations, setAnchorActivations] = useState([false, false, false, false])
    const [markerActivatioin, setMarkerActivations] = useState([false, false, false, false])
    const [rMarker, setRMarker] = useState(4)
    const [rAnchor, setRAnchor] = useState(6)
    const [markerPositions, setMarkerPositions] = useState([[50, 250], [200, 250], [125, 120], [125, 380]])
    const [anchorPositions, setAnchorPositions] = useState([[20, 30], [230, 30], [230, 500], [20, 500]])
    const [doneImgProcess, setDoneImgProcess] = useState(false)

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
        } else if (markerActivatioin.some((v) => v == true)) {
            const id = markerActivatioin.findIndex((v) => v == true)
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

                <Pressable
                    style={{
                        width: 2 * rAnchor,
                        height: 2 * rAnchor,
                        borderRadius: rAnchor,
                        backgroundColor: anchorActivations[0] ? 'purple' : "orange",
                        overflow: "hidden",
                        position: 'absolute',
                        top: anchorPositions[0][0] - rAnchor,
                        left: anchorPositions[0][1] - rAnchor,
                    }}
                    onPress={(evt) => activateRectangleAnchor(evt, 0)}
                ></Pressable >
                <Pressable
                    style={{
                        width: 2 * rAnchor,
                        height: 2 * rAnchor,
                        borderRadius: rAnchor,
                        backgroundColor: anchorActivations[1] ? 'purple' : "orange",
                        overflow: "hidden",
                        position: 'absolute',
                        top: anchorPositions[1][0] - rAnchor,
                        left: anchorPositions[1][1] - rAnchor,
                    }}
                    onPress={(evt) => activateRectangleAnchor(evt, 1)}
                ></Pressable >
                <Pressable
                    style={{
                        width: 2 * rAnchor,
                        height: 2 * rAnchor,
                        borderRadius: rAnchor,
                        backgroundColor: anchorActivations[2] ? 'purple' : "orange",
                        overflow: "hidden",
                        position: 'absolute',
                        top: anchorPositions[2][0] - rAnchor,
                        left: anchorPositions[2][1] - rAnchor,
                    }}
                    onPress={(evt) => activateRectangleAnchor(evt, 2)}
                ></Pressable >
                <Pressable
                    style={{
                        width: 2 * rAnchor,
                        height: 2 * rAnchor,
                        borderRadius: rAnchor,
                        backgroundColor: anchorActivations[3] ? 'purple' : "orange",
                        overflow: "hidden",
                        position: 'absolute',
                        top: anchorPositions[3][0] - rAnchor,
                        left: anchorPositions[3][1] - rAnchor,
                    }}
                    onPress={(evt) => activateRectangleAnchor(evt, 3)}
                ></Pressable >

                <Pressable
                    style={{
                        width: 2 * rMarker,
                        height: 2 * rMarker,
                        borderRadius: rMarker,
                        backgroundColor: markerActivatioin[0] ? 'purple' : "green",
                        overflow: "hidden",
                        position: 'absolute',
                        top: markerPositions[0][0] - rMarker,
                        left: markerPositions[0][1] - rMarker,
                    }}
                    onPress={(evt) => activateMarker(evt, 0)}
                ></Pressable >
                <Pressable
                    style={{
                        width: 2 * rMarker,
                        height: 2 * rMarker,
                        borderRadius: rMarker,
                        backgroundColor: markerActivatioin[1] ? 'purple' : "green",
                        overflow: "hidden",
                        position: 'absolute',
                        top: markerPositions[1][0] - rMarker,
                        left: markerPositions[1][1] - rMarker,
                    }}
                    onPress={(evt) => activateMarker(evt, 1)}
                ></Pressable >
                <Pressable
                    style={{
                        width: 2 * rMarker,
                        height: 2 * rMarker,
                        borderRadius: rMarker,
                        backgroundColor: markerActivatioin[2] ? 'purple' : "green",
                        overflow: "hidden",
                        position: 'absolute',
                        top: markerPositions[2][0] - rMarker,
                        left: markerPositions[2][1] - rMarker,
                    }}
                    onPress={(evt) => activateMarker(evt, 2)}
                ></Pressable >
                <Pressable
                    style={{
                        width: 2 * rMarker,
                        height: 2 * rMarker,
                        borderRadius: rMarker,
                        backgroundColor: markerActivatioin[3] ? 'purple' : "green",
                        overflow: "hidden",
                        position: 'absolute',
                        top: markerPositions[3][0] - rMarker,
                        left: markerPositions[3][1] - rMarker,
                    }}
                    onPress={(evt) => activateMarker(evt, 3)}
                ></Pressable >

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
                <View style={{ position: 'absolute', bottom: 10, left: 500 }}>
                    <TouchableOpacity style={styles.button} >
                        <Text style={styles.buttonTitle} onPress={(evt) => calibrateCV(evt, [arrowPosition.y, arrowPosition.x], markerPositions, anchorPositions, setDoneImgProcess)} >Calibrate Image</Text>
                    </TouchableOpacity>
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
        height: 40,
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