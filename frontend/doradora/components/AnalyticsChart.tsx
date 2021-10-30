import * as React from 'react';
import { useState, useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { GameDetail } from '../types';

type AnalyticsChartProps = {
  width: number;
  height: number;
  details: GameDetail[];
  uid: string;
  isRound: boolean;
  backHomeButtonFn: () => void;
};

// const InvalidDetail: GameDetail = {
//   rounds: [{
//     darts: [{x: 0, y: 0, score: 0}, {x: 0, y: 0, score: 0}, {x: 0, y: 0, score: 0}],
//     score: -1,
//   }],
//   totalScore: -1,
// }

export default function AnalyticsChart(props: AnalyticsChartProps) {
  const [isRound, setIsRound] = useState<boolean>(props.isRound);
  // const details = useMemo<GameDetail[]>(() => props.games.map(v => v.uids.get(props.uid) ?? InvalidDetail).filter(v => v.totalScore > 0), [props.games, props.uid])  // ダーツの情報を抜き取る

  return (
    <View style={styles.container}>
      {isRound ? <GameRoundScoreChart {...props} /> : <GameTotalScoreChart {...props} />}
      <View style={styles.buttonContainer} >
          <TouchableOpacity style={[styles.button, {width: props.width * 0.9, height: props.height * 0.12}]} onPress={props.backHomeButtonFn} >
            <Text style={styles.buttonTitle} >Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {width: props.width * 0.9, height: props.height * 0.12}]} onPress={() => setIsRound(!isRound)} >
            <Text style={styles.buttonTitle} >{isRound ? "Total" : "Round"}</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

type GameTotalScoreChartProps = {
  details: GameDetail[];
  uid: string;
  width: number;
  height: number;
};

function GameTotalScoreChart(props: GameTotalScoreChartProps) {
  const segments: number = 3; // yラベル数

  const m: number = props.details.length;
  if (m == 0) {return <Text></Text>;} // no data

  const data: number[] = props.details.map(v => v.totalScore); // これさえあれば良い
  const yMaxValue: number = Math.ceil(data.reduce((max, v) => max > v ? max : v, 100) / 50) * 50; // y軸の最大値

  function* yLabel() { yield* Array<number>(segments + 1).fill(1).map((_, i) => Math.round(yMaxValue / segments * i));}; // yラベル
  const yLabelIterator = yLabel();
  const xLabel = Array<string>(m).fill(""); // xラベル

  return (
    <LineChart
      data={{
        labels: xLabel,
        datasets: [{
          data: data,
          color: (opacity = 1) => `rgba(150, 150, 255, ${opacity})`,
          strokeWidth: 2
        }],
        legend: ["total score"]
      }}
      segments={segments}
      width={props.width * 1.1}
      height={props.height * 0.8}
      chartConfig={{
        backgroundGradientFrom: "black",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "black",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(150, 150, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.5,
      }}
      fromZero={true}
      formatYLabel={() => String(yLabelIterator.next().value)}
      withVerticalLines={false}
      style={{marginBottom: -40}}
    />
  );
}


type GameRoundScoreChartProps = {
  details: GameDetail[];
  uid: string;
  width: number;
  height: number;
};

function GameRoundScoreChart(props: GameRoundScoreChartProps) {
  const segments: number = 3; // yラベル数

  const m: number = props.details.length;
  if (m == 0) {return <Text></Text>;} // no data
  const lastGame: GameDetail = props.details[m-1];

  let yMaxValue: number = 0; // y軸の最大値
  const data: number[] = lastGame.rounds.map(v => yMaxValue += v.score); // これさえあれば良い
  yMaxValue = Math.ceil(yMaxValue / 50) * 50;

  function* yLabel() { yield* Array<number>(segments + 1).fill(1).map((_, i) => Math.round(yMaxValue / segments * i));}; // yラベル
  const yLabelIterator = yLabel();
  const xLabel = Array<string>(lastGame.rounds.length).fill(""); // xラベル

  return (
    <LineChart
      data={{
        labels: xLabel,
        datasets: [{
          data: data,
          color: (opacity = 1) => `rgba(150, 150, 255, ${opacity})`,
          strokeWidth: 2
        }],
        legend: ["round score"]
      }}
      segments={segments}
      width={props.width * 1.1}
      height={props.height * 0.8}
      chartConfig={{
        backgroundGradientFrom: "black",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "black",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(150, 150, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.5,
      }}
      fromZero={true}
      formatYLabel={() => String(yLabelIterator.next().value)}
      withVerticalLines={false}
      style={{marginBottom: -40}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
  },

  buttonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
})