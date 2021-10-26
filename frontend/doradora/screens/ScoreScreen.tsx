import * as React from 'react';
import { Dimensions, StyleSheet, Image, Platform } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ScoreTable from '../components/ScoreTable';


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

export default function ScoreScreen() {

  return (
    <View style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Score Board</Text>
			</View>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<View style={styles.scoreContainer}>
				<View style={styles.leftContainer}>
          <RenderDarts/>
				</View>
				<View style={styles.rightContainer}>
					<ScoreTable/>
				</View>
			</View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'red',
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
