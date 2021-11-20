import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable, Image, ViewStyle, GestureResponderEvent } from 'react-native'
import ReactNativeZoomableView, { ZoomableViewEvent } from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

type CapturePreviewProps = {
    photoUri: string;
    retakePicture: () => void;
    calibrateCV: (
        arrowPosition: {x: number; y: number},
        markerPoints: number[][],
        cropPoints: number[][],
        isManualMarker: boolean
    ) => void;
    toGameScreenFn: () => void;
};

export default function CapturePreview(props: CapturePreviewProps) {
    const [arrowPosition, setArrowPosition] = useState({ x: 250, y: 125 });
    const [isAnchorActive, setIsAnchorActive] = useState([false, false, false, false]);
    const [isMarkerActive, setIsMarkerActive] = useState([false, false, false, false]);
    const rMarker = 4;
    const rAnchor = 6;
    const [markerPositions, setMarkerPositions] = useState([[50, 250], [200, 250], [125, 120], [125, 380]]);
    const [anchorPositions, setAnchorPositions] = useState([[20, 30], [230, 30], [230, 500], [20, 500]]);
    const [isManualMarker, setIsManualMarker] = useState(false);

    const moveMarkerPosition = (evt: GestureResponderEvent) => {
        console.log("-----------------");
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;

        if (isAnchorActive.some((v) => v == true)) {
            const id = isAnchorActive.findIndex((v) => v == true);
            let ap = anchorPositions;
            ap[id] = [y, x];
            ap[id ^ 1] = [ap[id ^ 2][0], x];
            ap[id ^ 3] = [y, ap[id ^ 2][1]];

            setAnchorPositions(ap);
            setIsAnchorActive([false, false, false, false]);
        } else if (isMarkerActive.some((v) => v == true)) {
            const id = isMarkerActive.findIndex((v) => v == true);
            let mp = markerPositions;
            mp[id] = [y, x];

            setMarkerPositions(mp);
            setIsMarkerActive([false, false, false, false]);
        } else {
            console.log(`x: ${x}, y: ${y}`);
            setArrowPosition({ 'x': x, 'y': y });
        }
    };

    const activateRectangleAnchor = (id: number) => {
        let tmp = [false, false, false, false];
        tmp[id] = true;
        setIsAnchorActive(tmp);
        setIsMarkerActive([false, false, false, false]);
    };

    const activateMarker = (id: number) => {
        let tmp = [false, false, false, false];
        tmp[id] = true;
        setIsAnchorActive([false, false, false, false]);
        setIsMarkerActive(tmp);
    };

    const reflectZoomLevel = (zoomableViewEventObject: ZoomableViewEvent) => {
        // console.log(`now zoom level: ${zoomableViewEventObject.zoomLevel}`);
    };

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
            >
                <Pressable style={styles.imageContainer} onPress={(evt) => moveMarkerPosition(evt)}>
                    <Image source={{ uri: props.photoUri }} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
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
                }} />

                {Array(4).fill(1).map((_, i) => <Pressable
                    style={anchorStyle(isAnchorActive[i], anchorPositions[i], rAnchor)} //position: 'absolute' によるワーニング. 期待通りに動く. むしろこれを外すとマーカー位置がおかしくなる.
                    onPress={() => activateRectangleAnchor(i)}
                    key={i}
                />)}

                {isManualMarker ? (
                    Array(4).fill(1).map((_, i) => <Pressable
                        style={markerStyle(isMarkerActive[i], markerPositions[i], rMarker)} //position: 'absolute' によるワーニング. 期待通りに動く. むしろこれを外すとマーカー位置がおかしくなる.
                        onPress={() => activateMarker(i)}
                        key={i}
                    />)
                ) : <></>}
            </ReactNativeZoomableView>

            <View style={{flexDirection: "row", justifyContent: 'space-around', position: "absolute", bottom: 10, width: '100%'}}>
                <View>
                    <TouchableOpacity style={styles.button} onPress={props.retakePicture}>
                        <Text style={styles.buttonTitle}>Re-Take</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => setIsManualMarker(!isManualMarker)}>
                        <Text style={styles.buttonTitle}>Manual Marker</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => props.calibrateCV(arrowPosition, markerPositions, anchorPositions, isManualMarker)}>
                        <Text style={styles.buttonTitle}>Calibrate Image</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={props.toGameScreenFn}>
                        <Text style={styles.buttonTitle}>To Game Screen</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    zoomWrapper: {
        flex: 1,
        overflow: 'hidden',
    },

    imageContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
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

const anchorStyle = (anchorActivation: boolean, anchorPosition: Array<number>, rAnchor: number): ViewStyle => ({
    width: 2 * rAnchor,
    height: 2 * rAnchor,
    borderRadius: rAnchor,
    backgroundColor: anchorActivation ? 'purple' : "orange",
    overflow: "hidden",
    position: 'absolute',
    top: anchorPosition[0] - rAnchor,
    left: anchorPosition[1] - rAnchor,
});

const markerStyle = (isMarkerActive: boolean, markerPosition: Array<number>, rMarker: number): ViewStyle => ({
    width: 2 * rMarker,
    height: 2 * rMarker,
    borderRadius: rMarker,
    backgroundColor: isMarkerActive ? 'purple' : "red",
    // overflow: "hidden",
    position: 'absolute',
    top: markerPosition[0] - rMarker,
    left: markerPosition[1] - rMarker,
});