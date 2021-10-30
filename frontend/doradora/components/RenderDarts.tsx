import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { Round } from '../types';
import { Dimensions, Image, Platform, ImageBackground } from 'react-native';
import { useState} from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { RootStackScreenProps } from '../types';
import DartsBoard from "./DartsBoard";
import BoardNumbers from "./BoardNumbers"

type RenderDartsProps = {
  darts: Round['darts'];
  isAnalysisColor: Boolean;
  highlights: Array<Array<number>>;
}
type GameResultScreenProps = RootStackScreenProps<'Result'>;

export default function RenderDarts(props: RenderDartsProps){
  const [dimensions, setDimensions] = useState({x:0, y:0, width:0, height:0})
  var boardRadius = (dimensions.width < dimensions.height ? dimensions.width : dimensions.height) / 2;
  const dartsRadius = 8;
  var r0 = -dartsRadius; //dartsRadiusによる補正
  const data = props.darts;

  const { isAnalysisColor, highlights } = props;

  const normalColors = ["#FF4444", "#44DD44", "#000000", "#FFFF88"];
  const analysisColors = ["#AAFFFF", "#AAAFFF", "#BBBBBB", "#FFFFFF"];
  const highlightColors = ["#FF8888", "#BBFFBB", "#888888", "#FFFFDD"];
  
  const tileColors = [...Array(8)].map((_, i) => [...Array(10)].map((_, j) => isAnalysisColor ? analysisColors[i % 4] : normalColors[i % 4]));
  tileColors.push(isAnalysisColor ? [analysisColors[0], analysisColors[2]] : [normalColors[0], normalColors[2]]);
  highlights.forEach(xy => xy[0] === 8 ? tileColors[xy[0]][xy[1]] = highlightColors[xy[1] * 2]: tileColors[xy[0]][xy[1]] = highlightColors[xy[0] % 4]);
  const textColors = [...Array(20)].map((_, i) => isAnalysisColor ? "transparent" : "#FFFFFF");

  return (
    <View>
      <View style={styles.board}>
        <View style={{width: "100%", height: "100%", position: "absolute"}}
          onLayout={(event) => {
            const {x, y, width, height} = event.nativeEvent.layout;
            setDimensions({x:x, y:y, width:width, height:height});
          }}
        >
          <DartsBoard diameter={2 * boardRadius} tileColors={tileColors} maxZIndex={0} />
        </View>

        <View style={{width: "100%", height: "100%", position: "absolute"}}>
          <BoardNumbers diameter={1.1 * 2 * boardRadius} fontSize={20} textColors={textColors} zIndex={0} />
        </View>

      </View>
      <View style={styles.dartsLayer} >
        {
          data.map( (dartsXY, index) =>
            <View
              key={index}
              style={[
                styles.darts, {
                  width: dartsRadius*2,
                  height: dartsRadius*2,
                  borderRadius: dartsRadius,
                  top: (dartsXY.x*boardRadius +r0),
                  left:(dartsXY.y*boardRadius +r0)
                }
              ]}
            />
          )
        }
      </View>
    </View>
);
}

const styles = StyleSheet.create({
  board: {
    width:  'auto',
    height: '90%',
    aspectRatio: 1,
    opacity: 0.8
  },
  dartsLayer: {
    position: 'absolute',
    zIndex: 10,
    elevation: Platform.OS === 'android' ? 10 : 0,
  },
  darts: {
    position: 'absolute',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'yellow',
  }
});