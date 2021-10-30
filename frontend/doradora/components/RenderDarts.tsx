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
}
type GameResultScreenProps = RootStackScreenProps<'Result'>;

export default function RenderDarts(props: RenderDartsProps){
  const [dimensions, setDimensions] = useState({x:0, y:0, width:0, height:0})
  var boardRadius = (dimensions.width < dimensions.height ? dimensions.width : dimensions.height) / 2;
  const dartsRadius = 8;
  var r0 = -dartsRadius; //dartsRadiusによる補正
  const data = props.darts;

  const { isAnalysisColor } = props;

  const normalColors = ["#FF4444", "#44FF4F", "#000000", "#FFFFF8"]
  const analysisColors = ["#AAFFFF", "#AAAFFF", "#BBBBBB", "#FFFFFF"]
  const tileColors = [
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[0] : normalColors[0]),
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[1] : normalColors[1]),
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[2] : normalColors[2]),
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[3] : normalColors[3]),
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[0] : normalColors[0]),
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[1] : normalColors[1]),
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[2] : normalColors[2]),
    [...Array(10)].map((_, i) => isAnalysisColor ? analysisColors[3] : normalColors[3]),
    isAnalysisColor ? [analysisColors[0], analysisColors[2]] : [normalColors[0], normalColors[2]]
  ];
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
                  bottom: (dartsXY.y*boardRadius +r0),
                  left:(dartsXY.x*boardRadius +r0)
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