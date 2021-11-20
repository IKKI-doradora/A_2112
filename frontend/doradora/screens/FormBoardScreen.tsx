import * as React from "react";
import { View, Text } from "../components/Themed";
import ModelLineWithBoard from "../components/ModelLineWithBoard";
import { useState } from "react";
import { useWindowDimensions, TouchableOpacity } from "react-native";
import { Slider } from "react-native-elements/dist/slider/Slider";

// とりあえずassets内の軌道を表示する
import posjson from "../assets/positions.json";
import arowjson from "../assets/arrowPositions.json";

export default function formScreen() {
    const [ cameraPosition, setCameraPosition ] = useState<number>(300);
    const [ animationStepSize, setAnimationStepSize ] = useState<number>(0.4);

    const { width, height, scale } = useWindowDimensions();

    return(
        <View style={{flex: 1, flexDirection: "row"}}>
            <View style={{flex: 1}}>
                    <ModelLineWithBoard
                        jointTimeLine={posjson} 
                        arrowTimeLine={arowjson}
                        cameraPosition={cameraPosition} 
                        isCameraTP={false}
                        animationStepSize={animationStepSize} 
                        armLengthCm={25}
                        boardHeightPix={684}
                        maxHeightPix={684 + 396}
                        style={{width: width /  2, height: height}}
                    />
                <Text style={{color: "#FFFFFF", fontSize: 20, fontWeight: "bold", position: "absolute", transform: [{translateY: -150}]}}>First Person</Text>
            </View>

            <View style={{flex: 1}}>
                    <ModelLineWithBoard
                        jointTimeLine={posjson} 
                        arrowTimeLine={arowjson}
                        cameraPosition={cameraPosition} 
                        isCameraTP={true}
                        animationStepSize={animationStepSize} 
                        armLengthCm={25}
                        boardHeightPix={684}
                        maxHeightPix={684 + 396}
                        style={{width: width /  2, height: height}}
                    />
                <Text style={{color: "#FFFFFF", fontSize: 20, fontWeight: "bold", position: "absolute", transform: [{translateY: -150}]}}>Third Person</Text>
            </View>

            {/* 画面の仕切り */}
            <View style={{backgroundColor: "#000000", width: 5, height: height, position: "absolute"}}/>
        </View>
    )
}