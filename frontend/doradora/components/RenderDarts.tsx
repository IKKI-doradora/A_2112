import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
// import { DartsParamList } from '../types';
import { Dimensions, Image, Platform, ImageBackground } from 'react-native';
import { useState} from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';


export default function RenderDarts(props){
  const [dimensions, setDimensions] = useState({x:0, y:0, width:0, height:0})
  var boardRadius = (dimensions.width < dimensions.height ? dimensions.width : dimensions.height) / 2;
  const dartsRadius = 6;
  // var r0 = boardRadius -dartsRadius; //dartsRadiusによる補正
  var r0 = -dartsRadius; //dartsRadiusによる補正 

  // const positions = props.data.uids[320].positions;
  const data = props.data;


  return (   
    <View>
      <Image
        onLayout={(event) => {
          const {x, y, width, height} = event.nativeEvent.layout;
          setDimensions({x:x, y:y, width:width, height:height});
        }}
        style={styles.board}
        source={require('../assets/images/board_c2.png')}
      />
      <View style={styles.dartsLayer} >
        {
          data.map( dartsXY => (
            <View 
              style={[styles.darts, 
              { width: dartsRadius*2,
                height: dartsRadius*2,
                borderRadius: dartsRadius,
                top: (dartsXY.x*boardRadius +r0), 
                left:(dartsXY.y*boardRadius +r0)
              }
            ]}/>
          ))
        }
      </View>
    </View>
);
}

const styles = StyleSheet.create({
  board: {
    width:  'auto',
    height: '100%',
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