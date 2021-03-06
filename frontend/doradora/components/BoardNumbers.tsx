import { Text, View } from "react-native";
import * as React from "react";

type Props = {
    diameter: number,
    fontSize: number,
    textColors: Array<string>,
    zIndex: number,
}

export default function BoardNumbers(props: Props){
    const { diameter, fontSize, textColors, zIndex } = props;
    const numbers = [6, 13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10];
    const boardNumbers = [...Array(20)].map((_, i) => (
        <View key={i} style={{
            width: fontSize, 
            height: fontSize, 

            position: "absolute", 
            left: diameter / 2 - fontSize / 2 + diameter / 2 * Math.cos(i * Math.PI / 10), 
            top: diameter / 2 - fontSize / 2 - diameter / 2 * Math.sin(i * Math.PI / 10), 
            alignItems: "center",
            justifyContent: "center",
            zIndex: zIndex
        }}>
            <Text style={{color: textColors[i], fontWeight: "bold", fontSize: fontSize * 0.8}}>{numbers[i]}</Text>
        </View>
    ));
    return(
        <View style={{width: diameter, height: diameter,}}>
            {boardNumbers}
        </View>
    )
}