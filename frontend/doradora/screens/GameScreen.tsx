import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { Dimensions, Image, Platform } from 'react-native';
import ScoreTable from '../components/ScoreTable';

type GameScreenProps = RootStackScreenProps<'Game'>;

function RenderDarts() {
  const windowWidth = Dimensions.get('window').width / 2;
  const windowHeight = Dimensions.get('window').height;
  // const radius = (windowWidth < windowHeight ? windowWidth : windowHeight) / 2;
  const radius = 142;

  return (
    <View>
      <Image
        style={styles.board}
        source={require('../assets/images/board_c2.png')}
      />
      <View style={styles.dartsLayer} >
        <View style={[styles.darts, {top: radius, left: 0}]} />
        <View style={[styles.darts, {top: 0, left: radius}]} />
        <View style={[styles.darts, {top: radius, left: radius*2}]} />
        <View style={[styles.darts, {top: radius / 2, left: radius / 2}]} />
        <View style={[styles.darts, {top: radius * 1.5, left: radius * 1.2}]} />
      </View>
    </View>
);
}

export default function GameScreen() {
  const navigation = useNavigation<GameScreenProps['navigation']>()

return (
  <View style={styles.container}>
    {/* <View style={styles.titleContainer}>
      <Text style={styles.title}>Score Board</Text>
    </View> */}
    <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
  },
	board: {
    width:  'auto',
		height: '100%',
		aspectRatio: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
	titleContainer: {
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
	scoreContainer: {
		flex: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
	leftContainer: {
    flex: 3,
		padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  rightContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  dartsLayer: {
    position: 'absolute',
    zIndex: 10,
    elevation: Platform.OS === 'android' ? 10 : 0,
    backgroundColor: 'green',
  },
  darts: {
    position: 'absolute',
    borderRadius: 10,
    width: 20,
    height: 20,
    backgroundColor: 'cyan',
  }
});