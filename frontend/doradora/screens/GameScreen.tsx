import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { Dimensions, Image, Platform, ImageBackground } from 'react-native';
import ScoreTable from '../components/ScoreTable';
import { useState} from 'react';


type GameScreenProps = RootStackScreenProps<'Game'>;

const DartsData = {
  name: 'YJ',
  times: [1, 2, 3, 4],
  position: [[-0.2, 0.1],[0.4, 0.8],[0.0, 0.0],[-0.7, -0.4]],
  score: [12,20,34,21]
};

function RenderDarts() {
  const [dimensions, setDimensions] = useState({x:0, y:0, width:0, height:0})
  var boardRadius = (dimensions.width < dimensions.height ? dimensions.width : dimensions.height) / 2;
  const dartsRadius = 6;
  var r0 = boardRadius -dartsRadius; //dartsRadiusによる補正

  return ( 
    <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
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
          DartsData.position.map((position,index) => (
            <View 
              style={[styles.darts, 
              { width: dartsRadius*2,
                height: dartsRadius*2,
                borderRadius: dartsRadius,
                top: (position[0]*boardRadius +r0), 
                left:(position[1]*boardRadius +r0)
              }
            ]}/>
          ))
        }
      </View>
    </View>
);
}

export default function GameScreen() {
  const navigation = useNavigation<GameScreenProps['navigation']>()

return (
  <View style={styles.container}>
    <ImageBackground source={require('../assets/images/backboard.jpg')} resizeMode='cover' style={{width:'100%', height:'100%'}}>
    <View style={styles.scoreContainer}>
      <View style={styles.leftContainer}>
        <RenderDarts/>
      </View>
      <View style={styles.rightContainer}>
        <ScoreTable/>
        <TouchableOpacity style={styles.button} >
          <Text style={styles.buttonTitle} onPress={() => navigation.navigate("Result")} >To Result Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  </View>
);
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    width: 250,
    height: 50,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },

  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
	board: {
    width:  'auto',
		height: '100%',
		aspectRatio: 1,
    justifyContent: 'center',
  },
	scoreContainer: {
		flex: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
	leftContainer: {
    flex: 3,
		padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)' 
  },
  rightContainer: {
    flex: 2,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)' 
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