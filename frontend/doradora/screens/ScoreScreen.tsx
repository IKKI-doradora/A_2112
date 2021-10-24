import * as React from 'react';
import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';


function ScoreTable({ score }: { score: string }) {
  return (
    <View style={styles.table}>
      <Text style={styles.title} >{score}</Text>
      <Text style={styles.title} >{score}</Text>

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
					<Image
						style={styles.board}
						// resizeMode={'contain'}
						source={require('../assets/images/board_c2.png')}
					/>
				</View>
				<View style={styles.rightContainer}>
					<Text>Score Sheet</Text>
					<ScoreTable score="12" />
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
		// padding: 20,
    width:  'auto',
		height: '100%',
		aspectRatio: 1,
    justifyContent: 'center',
  },
	titleContainer: {
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
	scoreContainer: {
		flex: 8,
    flexDirection: 'row',
    // justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
	table: {
		flex: 1,
    alignItems: 'center'
	},
});
