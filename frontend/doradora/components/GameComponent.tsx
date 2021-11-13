import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Dart, Round, GameDetail } from '../types';
import { useState, useEffect } from 'react';
import { Button, Badge } from 'react-native-elements';
import ScoreTable from '../components/ScoreTable';
import RenderDarts from '../components/RenderDarts';
import { DartsCamera } from '../screens/DartsCamera';

import HomeButton from "./HomeButton";
import { useStore } from '../hooks/useStore';
import { RegisterRound, ObserveRoundAdded } from '../hooks/firebase';

type GameComponentProps = {
  gameId: string;
  ToResultFn: (detail: GameDetail) => void;
  isMyFirst: boolean;
  opponentId?: string;
};

// 初期値
const initDart = { x: -2, y: -2, score: 0 };
const initRound = { darts: [initDart, initDart, initDart], score: 0 };
const initDetail = { rounds: Array(8).fill(initRound), totalScore: 0 };

export default function GameComponent(props: GameComponentProps) {
  // ゲーム情報 [自分の，相手の]
  const [details, setDetails] = useState<GameDetail[]>(Array(props.opponentId ? 2 : 1).fill(initDetail));

  const [round, setRound] = useState<Round>(initRound); // 現在のラウンドのデータ
  const [roundCount, setRoundCount] = useState<number>(0); // 現在何ラウンド消化したか
  const [dartsCount, setDartsCount] = useState<number>(0); // 現在のラウンドで既に何投したか
  const [finButtonText, setFinButtonText] = useState<string>("Round Fin");

  const [isMyTurn, setIsMyTurn] = useState(props.isMyFirst) // 自分の手番かどうか
  const user = useStore(e => e.user);

  const refCameraStart = React.useRef<() => void>(null!);

  const on3Throw = () => {
    if (roundCount == 8) {
      props.ToResultFn(details[0]); // Jump Result
    } else {
      // Tableを更新
      const newDetails = [...details];
      newDetails[0].rounds[roundCount] = round;
      newDetails[0].totalScore += round.score;
      setDetails(newDetails);

      if (user && user.uid) RegisterRound(props.gameId, user.uid, roundCount, round); // round を DB に追加
      if (!props.opponentId) setIsMyTurn(false); // 相手がいたら待機状態に

      setRound(initRound); // Roundを空に
      if (roundCount == 7) setFinButtonText("Game Fin"); // 8ラウンド目終了した時
      setRoundCount(roundCount + 1);
      setDartsCount(0);
    }
    refCameraStart.current();
  }

  const onGetData = (dart: Dart) => {
    // Roundを更新
    console.log(dart);
    if (dart.x) {
      if (dartsCount > 2) return; // 既に3投していたら飛ばす
      const newRound = {...round};
      newRound.darts[dartsCount] = dart;
      newRound.score += dart.score;
      setRound(newRound);
      setDartsCount(dartsCount + 1);
    }
  };

  // 対戦相手がいて自分のターンじゃないとき監視を行う．
  useEffect(() => {
    if (!props.opponentId || isMyTurn) return;
    return ObserveRoundAdded(props.gameId, props.opponentId, (snapshot) => {
      const opponentRound = props.isMyFirst ? roundCount - 1 : roundCount;
      const keyRound = parseInt(snapshot.key ?? "-1");
      if (keyRound != opponentRound) return; //

      const newDetails = [...details];
      const val: Round = snapshot.val();
      console.log("opponent: ", snapshot.key, val);
      newDetails[1].rounds[keyRound] = val;
      newDetails[1].totalScore += val.score;
      setDetails(newDetails);
      setIsMyTurn(true) // 自分の番にする
    });
  }, [isMyTurn]);

  return (
    <View style={styles.scoreContainer}>
      <View style={{ position: "absolute", zIndex: -10, width: 40, height: 30 }}>
        <DartsCamera onThrow={(d)=>onGetData(d)} _ref={(r) => { refCameraStart.current = r }} />
      </View>
      <View style={styles.leftContainer}>
        <View style={{position: "absolute",}}>
          <HomeButton top={-160} left={-170}/>
        </View>
        <Badge
          value={`R ${roundCount + 1}`}
          status="error"
          containerStyle={{ top: 10, left: 160 }}
        />
        <RenderDarts darts={round.darts} isAnalysisColor={false}/>
      </View >
      <View style={styles.rightContainer}>
        <Button title={finButtonText} disabled={dartsCount < 3} onPress={on3Throw}/>
        <ScoreTable details={details} />
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  leftContainer: {
    flex: 3,
    padding: 10,
  },

  rightContainer: {
    flex: 2,
    alignItems: 'stretch',
  },
});