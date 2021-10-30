import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Text, View } from '../components/Themed';
import { Dart, Round, GameDetail, RootStackScreenProps } from '../types';
import { useState } from 'react';
import { Button, Badge } from 'react-native-elements';
import ScoreTable from '../components/ScoreTable';
import RenderDarts from '../components/RenderDarts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { DartsCamera } from '../screens/DartsCamera';

import HomeButton from "./HomeButton";
import { PushGameDetail } from '../hooks/firebase'

type GameScreenProps = RootStackScreenProps<'Game'>;

const Data = {
  uids: {
    "320": {
      positions: [
        [[0.0, 0.0], [0.1, 0.1], [0.2, 0.2]],
        [[0.3, 0.3], [-0.5, 0.4], [0.5, 0.5]],
        [[-0.3, 0.3], [-0.5, 0.2], [-0.6, 0.5]],
        [[0.3, -0.3], [0.4, 0.1], [0.7, -0.5]],
        [[-0.8, -0.3], [-0.4, -0.4], [-0.5, -0.5]],
        [[0.4, 0.1], [0.3, 0.9], [0.2, -0.5]],
        [[0.3, 0.2], [-0.4, 0.4], [0.5, -0.5]],
        [[-0.6, 0.1], [0.7, 0.0], [0.8, 0.0]]
      ],
      scores: [
        [12, 20, 34], [32, 10, 44], [10, 40, 4], [14, 9, 23],
        [40, 24, 34], [42, 10, 4], [18, 40, 44], [26, 2, 14]
      ],
      totalScore: 0
    }
  }
};

export default function GameComponent() {
  const navigation = useNavigation<GameScreenProps['navigation']>();

  const initDart = { x: -2, y: -2, score: 0 };
  const initRound = { darts: [initDart, initDart, initDart], score: 0 };
  const initTable = { rounds: Array(8).fill(initRound), totalScore: 0 };

  const [Table, setTable] = useState<GameDetail>(initTable);
  const [Dart, setDart] = useState<Dart>(initDart);
  const [RoundGame, setRoundGame] = useState<Round>(initRound);
  const [Round, setRound] = useState<number>(0);
  const [Count, setCount] = useState<number>(0);
  const [FinButton, setFinButton] = useState<string>("Round Fin");
  const uid = "320";

  const refCameraStart = React.useRef<() => void>(null!);

  const handleThrow = (position: Dart) => {
    console.log(position)
  }

  const on3Throw = () => {
    if (Count == 4) {
      // Jump Result
      navigation.navigate("Result", { data: Table })
    } else {
      // Tableを更新
      const newTable = { ...Table };
      newTable.rounds[Round] = RoundGame;
      newTable.totalScore += RoundGame.score;
      setTable(newTable);

      // Roundを空に
      setRoundGame(initRound);
      setCount(0);

      if (Round < 7) {
        setRound(Round + 1);
      }
      else {
        setFinButton("Game Fin");
        setCount(4);
        // ここで　firebase に uids を送信
        PushGameDetail(uid, newTable);
      }
    }
  }

  const onGetData = () => {
    // とりあえずダミーデータから値を取得
    const x = Data.uids[uid].positions[Round][Count][0];
    const y = Data.uids[uid].positions[Round][Count][1];
    const score = Data.uids[uid].scores[Round][Count];

    // 1投を更新
    const newDart = { x: x, y: y, score: score };
    setDart(newDart);

    // Roundを更新
    const newRoundGame = { ...RoundGame };
    newRoundGame.darts[Count] = newDart;
    newRoundGame.score += newDart.score;
    setRoundGame(newRoundGame);
    setCount(Count + 1);
  }

  return (
    <View style={styles.scoreContainer}>
      <View style={{ position: "absolute", zIndex: -10, width: 40, height: 30 }}>
        <DartsCamera onThrow={handleThrow} _ref={(r: () => void) => { refCameraStart.current = r }} />
      </View>
      <View style={styles.leftContainer}>
        <View style={{position: "absolute",}}>
          <HomeButton top={-160} left={-170}/>
        </View>
        <Badge
          value={`R ${Round + 1}`}
          status="error"
          containerStyle={{ top: 10, left: 160 }}
        />
        <RenderDarts darts={RoundGame.darts} isAnalysisColor={false}/>
      </View >
    <View style={styles.rightContainer}>
      <Button
        title="Throwed"
        disabled={Count >= 3}
        onPress={() => onGetData()}
      />
      <Button
        disabled={Count < 3}
        onPress={() => on3Throw()}
        title={FinButton}
      />
      <ScoreTable scores={Table} />
    </View>
    </View >
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    // position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  leftContainer: {
    // position: 'absolute',

    flex: 3,
    padding: 10,
  },
  rightContainer: {
    // position: 'absolute',

    flex: 2,
    alignItems: 'stretch',
  },
});