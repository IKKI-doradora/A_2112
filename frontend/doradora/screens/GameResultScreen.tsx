import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Image, Platform, LayoutChangeEvent, TouchableOpacity, Text } from 'react-native';
import { View } from '../components/Themed';
import AnalyticsChart from '../components/AnalyticsChart';
import { RootStackScreenProps, GameDetail, Game } from '../types'
import RenderDarts from '../components/RenderDarts';
import { useNavigation, useRoute } from '@react-navigation/core';

type GameResultScreenProps = RootStackScreenProps<'Result'>;

export default function GameResultScreen() {
  const navigation = useNavigation<GameResultScreenProps['navigation']>();
  const route = useRoute<GameResultScreenProps['route']>();

  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
    setChartHeight(e.nativeEvent.layout.width);
  };

  const darts = route.params.data.rounds.flatMap(v => v.darts);

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <RenderDarts darts={darts} isAnalysisColor={true}/>
      </View>
      <View style={styles.chartContainer} onLayout={onLayout}>
        <AnalyticsChart
          width={chartWidth}
          height={chartHeight}
          details={[route.params.data]}
          isRound={true}
          backHomeButtonFn={() => navigation.navigate("Home")}
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
		padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chartContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});