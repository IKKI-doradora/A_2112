import * as React from "react";
import { View, Text } from "../components/Themed";
import ModelLine from "../components/MoelLine";
import { useState } from "react";
import { useWindowDimensions, TouchableOpacity } from "react-native";
import { Slider } from "react-native-elements/dist/slider/Slider";

import posjson from "../assets/positions.json";

export default function formScreen() {
    const [ rotationX, setRotationX ] = useState<number>(0);
    const [ rotationY, setRotationY ] = useState<number>(0);
    const [ rotationZ, setRotationZ ] = useState<number>(0);
    const [ cameraPosition, setCameraPosition ] = useState<number>(500);
    const [ animationStepSize, setAnimationStepSize] = useState<number>(0.4);

    const { width, height, scale } = useWindowDimensions();

    return(
        <View style={{flex: 1, flexDirection: "row"}}>
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center', padding: 20}}>
                <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                    <Text>rotationX</Text>
                    <Slider
                        value={rotationX}
                        onValueChange={(value) => setRotationX(value)}
                        maximumValue={3}
                        minimumValue={-3}
                        step={0.1}
                    />
                </View>

                <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                    <Text>rotationY</Text>
                    <Slider
                        value={rotationY}
                        onValueChange={(value) => setRotationY(value)}
                        maximumValue={3}
                        minimumValue={-3}
                        step={0.1}
                    />
                </View>

                <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                    <Text>rotationZ</Text>
                    <Slider
                        value={rotationZ}
                        onValueChange={(value) => setRotationZ(value)}
                        maximumValue={3}
                        minimumValue={-3}
                        step={0.1}
                    />
                </View>

                <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                    <Text>cameraPosition</Text>
                    <Slider
                        value={cameraPosition}
                        onValueChange={(value) => setCameraPosition(value)}
                        maximumValue={1000}
                        minimumValue={0}
                        step={100}
                    />
                </View>

            </View>


            <View style={{flex: 2, justifyContent: "center"}}>
                <View style={{position: "absolute", zIndex: 10}}>
                <ModelLine 
                    jointTimeLine={posjson} 
                    rotationX={rotationX} 
                    rotationY={rotationY} 
                    rotationZ={rotationZ} 
                    cameraPosition={cameraPosition} 
                    animationStepSize={animationStepSize} 
                    style={{width: width / 3 * 2, height: height}}
                />
                </View>
            </View>
        </View>
    )
}