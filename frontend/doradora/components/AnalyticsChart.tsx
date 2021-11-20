import * as React from 'react';
import { useState, useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { GameDetail } from '../types';

type AnalyticsChartProps = {
  width: number; // グラフをおく場所の幅
  height: number; // グラフを置く場所の高さ
  details: GameDetail[]; // 特定のプレイヤーのゲーム情報列
  isRound: boolean; // Round モードか否か
  backHomeButtonFn: () => void; // Back ボタンを押した時に呼ぶ関数
};

export default function AnalyticsChart(props: AnalyticsChartProps) {
  const [isRound, setIsRound] = useState<boolean>(props.isRound);

  const m: number = props.details.length;
  const segments: number = 3; // y軸ラベル数 - 1

  const [roundData, roundDataMax] = useMemo<[number[], number]>(() => {
    if (m == 0) return [Array<number>(1), 0];
    let sum = 0;
    const data = props.details[m-1].rounds.map(v => sum += v.score);
    return [data, sum];
  }, [props.details]);

  const [totalData, totalDataMax] = useMemo<[number[], number]>(() => {
    if (m == 0) return [Array<number>(1), 0];
    let max = 0;
    const data = props.details.map(v => {max = Math.max(max, v.totalScore); return v.totalScore;});
    return [data, max];
  }, [props.details]);

  return (
    <View style={styles.container}>
      {m == 0 ? (
        <Text /> // no data
      ) : (
        <ScoreChart
          data={isRound ? roundData : totalData}
          segments={segments}
          yMaxValue={isRound ? roundDataMax : totalDataMax}
          legend={isRound ? "Round Score" : "Total Score"}
          width={props.width}
          height={props.height}
        /> // コンポーネントのMemo化した方が良いかも？
      )}
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

type ScoreChartProps = {
  data: number[];
  segments: number; // yラベル数
  yMaxValue: number;
  legend: string;
  width: number;
  height: number;
};

function ScoreChart(props: ScoreChartProps) {
  const xLabel = Array<string>(props.data.length).fill("");
  function* yLabel() { yield* Array<number>(props.segments + 1).fill(1).map((_, i) => Math.round(props.yMaxValue / props.segments * i));}; // yラベル
  const yLabelIterator = yLabel();

  return (
    <LineChart
      data={{
        labels: xLabel,
        datasets: [{
          data: props.data,
          color: (opacity = 1) => `rgba(150, 150, 255, ${opacity})`,
          strokeWidth: 2
        }],
        legend: [props.legend]
      }}
      segments={props.segments}
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
};

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
});