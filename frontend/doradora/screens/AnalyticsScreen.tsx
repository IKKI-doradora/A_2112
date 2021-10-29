import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Image, Platform, LayoutChangeEvent, TouchableOpacity, Text } from 'react-native';
import { View } from '../components/Themed';
import AnalyticsChart from '../components/AnalyticsChart';
import { GameDetail, Game } from '../types'
import RenderDarts from '../components/RenderDarts';

function makeDemoData(): Game {
  let uids = new Map<string, GameDetail>();
  uids.set("0", {
    rounds: Array(8).fill({
      darts: [{x: 1, y: 0, score: 0}, {x: 0, y: 0, score: 0}, {x: 0, y: 0, score: 0}],
      score: Math.round(Math.random() * 100),
    }),
    totalScore: Math.round(Math.random() * 100)
  })

  return ({
    game_id: "0",
    type: 0,
    n_rounds: 8,
    uids: uids,
  });
}

export default function AnalyticsScreen() {
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);
  const [isCountUp, setIsCountUp] = useState<boolean>(false)

  const onLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
    setChartHeight(e.nativeEvent.layout.width);
  }

  const demoData = Array(10).fill(1).map(() => makeDemoData());

  return (
    isCountUp ? (
      <View style={styles.container}>
        <View style={styles.boardContainer}>
          <RenderDarts darts={demoData[0].uids.get("0")?.rounds[0]?.darts ?? [{x: 0, y: 0, score: 0}]} />
        </View>
        <View style={styles.chartContainer} onLayout={onLayout}>
          <AnalyticsChart
            width={chartWidth}
            height={chartHeight}
            games={demoData}
            uid={"0"}
            isRound={false}
            backHomeButtonFn={() => setIsCountUp(false)}
          />
        </View>
      </View>
    ) : (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => setIsCountUp(true)} >
            <Text style={styles.buttonTitle} >Count up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}} >
            <Text style={styles.buttonTitle} >X01</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}} >
            <Text style={styles.buttonTitle} >Cricket</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

	board: {
    width:  'auto',
		height: '100%',
		aspectRatio: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },

	boardContainer: {
    flex: 3,
		padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  chartContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
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
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  button: {
    width: 200,
    height: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },
});