import { View } from "react-native";
import * as React from "react";

type DartsBoardProps = {
    diameter: number,
    maxZIndex: number,
}

export default function DartsBoard(props: DartsBoardProps) {
    const { diameter, maxZIndex } = props;
    const unit = diameter / 40;
    const colors = ["#AA0000", "#00AA00", "#000000", "#FFFFCC"];
    const radiusesUnits = [20, 18, 12, 10];
    const tileses = [...Array(10)].map((_, i) => {
        return <View
        
            
        />
    })
    
    return (
        <View style={{width: diameter, height: diameter,}}>
            <Tiles color={colors[0]} radius={20 * unit} maxRadius={diameter/2} isTileCenter={true} zIndex={maxZIndex-5}/>
            <Tiles color={colors[1]} radius={20 * unit} maxRadius={diameter/2} isTileCenter={false} zIndex={maxZIndex-5}/>
            <Tiles color={colors[2]} radius={18 * unit} maxRadius={diameter/2} isTileCenter={true} zIndex={maxZIndex-4}/>
            <Tiles color={colors[3]} radius={18 * unit} maxRadius={diameter/2} isTileCenter={false} zIndex={maxZIndex-4}/>
            <Tiles color={colors[0]} radius={12 * unit} maxRadius={diameter/2} isTileCenter={true} zIndex={maxZIndex-3}/>
            <Tiles color={colors[1]} radius={12 * unit} maxRadius={diameter/2} isTileCenter={false} zIndex={maxZIndex-3}/>
            <Tiles color={colors[2]} radius={10 * unit} maxRadius={diameter/2} isTileCenter={true} zIndex={maxZIndex-2}/>
            <Tiles color={colors[3]} radius={10 * unit} maxRadius={diameter/2} isTileCenter={false} zIndex={maxZIndex-2}/>
            <View style={{borderColor: colors[0], borderWidth: 2 * unit, borderRadius: 2 * unit, position: "absolute", left: diameter / 2 - 2 * unit, top: diameter / 2 - 2 *　unit, zIndex: maxZIndex}}/>
            <View style={{borderColor: colors[2], borderWidth: unit, borderRadius: unit, position: "absolute", left: diameter / 2 - unit, top: diameter / 2 - unit, zIndex: maxZIndex}}/>

        </View>
    );
}

type TilesProps = {
    color: string,
    radius: number,
    maxRadius: number,
    isTileCenter: Boolean,
    zIndex: number,
}

function Tiles(props: TilesProps){
    const { color, radius, maxRadius, isTileCenter, zIndex } = props;
    const width = Math.sqrt(Math.pow(radius, 2) * (1-0.90)) / 2;
    const tiles = [...Array(10)].map((_, i) => {
        return <View style={{
            position: "absolute",

            borderBottomWidth: radius,
            borderBottomColor: color,
            borderLeftWidth: width,
            borderLeftColor: "transparent",
            borderRightWidth: width,
            borderRightColor: "transparent",
            // borderRadius: 100,

            zIndex: zIndex,
            
            transform: [{translateY: -1 * radius / 2}, {"rotate": isTileCenter ? `${i * 36}deg` : `${18 + i * 36}deg`}, {translateY: radius / 2}],
        }}/>
    });
    
    return(
        <View style={{position: "absolute", left: maxRadius - (width), top: maxRadius}}>{tiles}</View>
    )
}