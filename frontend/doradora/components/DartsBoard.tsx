import { View } from "react-native";
import * as React from "react";

type DartsBoardProps = {
    diameter: number,
    tileColors: Array<Array<string>>,
    maxZIndex: number,
}

export default function DartsBoard(props: DartsBoardProps) {
    const { diameter, tileColors, maxZIndex } = props;
    const unit = diameter / 40;
    const radiusUnits = [20, 18, 12, 10];

    const tileses = [...Array(8)].map((_, i) => 
        <Tiles key={i} colors={tileColors[i]} radius={radiusUnits[Math.floor(i / 2)] * unit} maxRadius={diameter / 2} isTileCenter={i % 2 === 0} zIndex={Math.floor(i / 2) - 5}/>
    );

    const lims = [...Array(4)].map((_, i) => {
        const radius = 2 * radiusUnits[i] * unit * 1.02;
        return <View style={{
            borderColor: "#444444", 
            width: radius, 
            height: radius, 
            borderWidth: radius * 0.01, 
            borderRadius: radius,

            position: "absolute", 
            top: diameter / 2 - radius / 2,
            left: diameter / 2 - radius / 2, 
            zIndex: maxZIndex,
        }}/>
    });
    
    return (
        <View style={{width: diameter, height: diameter,}}>
            {tileses}
            <View style={{borderColor: tileColors[8][0], 
                borderWidth: 2 * unit, 
                borderRadius: 2 * unit, 
                position: "absolute", 
                left: diameter / 2 - 2 * unit, 
                top: diameter / 2 - 2 *　unit, 
                zIndex: maxZIndex}}
            />
            <View style={{
                borderColor: tileColors[8][1], 
                borderWidth: unit, 
                borderRadius: unit, 
                position: "absolute", 
                left: diameter / 2 - unit, 
                top: diameter / 2 - unit, 
                zIndex: maxZIndex}}
            />
            {lims}
        </View>
    );
}

type TilesProps = {
    colors: Array<string>,
    radius: number,
    maxRadius: number,
    isTileCenter: Boolean,
    zIndex: number,
}

function Tiles(props: TilesProps){
    const { colors, radius, maxRadius, isTileCenter, zIndex } = props;
    const width = Math.sqrt(Math.pow(radius, 2) * (1-0.90)) / 2;
    const tiles = [...Array(10)].map((_, i) => {
        return <View key={i} style={{
            position: "absolute",

            borderBottomWidth: radius,
            borderBottomColor: colors[i],
            borderLeftWidth: width,
            borderLeftColor: "transparent",
            borderRightWidth: width,
            borderRightColor: "transparent",
            zIndex: zIndex,
            
            transform: [{translateY: -1 * radius / 2}, {"rotate": isTileCenter ? `${i * 36}deg` : `${18 + i * 36}deg`}, {translateY: radius / 2}],
        }}/>
    });
    
    return(
        <View style={{position: "absolute", left: maxRadius - (width), top: maxRadius}}>{tiles}</View>
    )
}