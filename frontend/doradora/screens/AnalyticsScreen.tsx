import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, LayoutChangeEvent } from 'react-native';
import { View } from '../components/Themed';
import AnalyticsChart from '../components/AnalyticsChart';
import { GameDetail, Game, RootStackScreenProps } from '../types'
import RenderDarts from '../components/RenderDarts';
import { useNavigation, useRoute } from '@react-navigation/core';

type AnalyticsScreenProps = RootStackScreenProps<'Analytics'>;

function makeDemoData(): Game {
  let uids = new Map<string, GameDetail>();
  uids.set("0", {
    rounds: Array(8).fill(1).map(() => ({
      darts: Array(3).fill(1).map(() => {return {x: Math.random()*1.5-0.75, y: Math.random()*1.5-0.75, score: 0}}),
      score: Math.round(Math.random() * 100),
    })),
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
  const navigation = useNavigation<AnalyticsScreenProps['navigation']>();
  const route = useRoute<AnalyticsScreenProps['route']>();
  const type = route.params.type;

  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);
  // const [isCountUp, setIsCountUp] = useState<boolean>(type == 0)

  const onLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
    setChartHeight(e.nativeEvent.layout.height);
  }

  // uid と gameの配列 から そのプレイヤーのGameDetailのみを取り出す
  const uid = "0";
  const demoData = Array(10).fill(1).map(() => makeDemoData());

  const InvalidDetail: GameDetail = {
    rounds: [{
      darts: [{x: 0, y: 0, score: 0}, {x: 0, y: 0, score: 0}, {x: 0, y: 0, score: 0}],
      score: -1,
    }],
    totalScore: -1,
  }
  const details = demoData.map(v => v.uids.get(uid) ?? InvalidDetail).filter(v => v.totalScore > 0)  // ダーツの情報を抜き取る
  const darts = details.flatMap(v => v.rounds.flatMap(vv => vv.darts));

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <RenderDarts darts={darts} isAnalysisColor={true}/>
      </View>
      <View style={styles.chartContainer} onLayout={onLayout}>
        <AnalyticsChart
          width={chartWidth}
          height={chartHeight}
          details={details}
          isRound={false}
          backHomeButtonFn={() => navigation.navigate("Home", {screen: "ScoreTab"})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

	boardContainer: {
    flex: 3,
		padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chartContainer: {
    flex: 3,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});