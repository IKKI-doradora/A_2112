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
import { RegisterDart, RegisterRoundScore, RegisterTotalScore, ObserveDartAdded } from '../hooks/firebase';

type GameComponentProps = {
  gameId: string;
  ToResultFn: (details: GameDetail[]) => void;
  isMyFirst: boolean;
  opponentId?: string;
};

// 初期値
const initDart = { x: -2, y: -2, score: 0 };

function makeInitRound(): Round {
  return {
    darts: Array(3).fill(null).map(() => {return {...initDart}}),
    score: 0,
  };
};

function makeInitDetail(): GameDetail {
  return {
    rounds: Array(8).fill(null).map(makeInitRound),
    totalScore: 0,
  }
};

export default function GameComponent(props: GameComponentProps) {
  // ゲーム情報 [自分の，相手の]
  const [details, setDetails] = useState<GameDetail[]>(Array(props.opponentId ? 2 : 1).fill(null).map(makeInitDetail));

  const [round, setRound] = useState<Round>(makeInitRound()); // 現在のラウンドのデータ
  const [roundCount, setRoundCount] = useState<number>(0); // 現在何ラウンド消化したか
  const [dartsCount, setDartsCount] = useState<number>(0); // 現在のラウンドで既に何投したか
  const [finButtonText, setFinButtonText] = useState<string>("Round Fin");

  const [isMyTurn, setIsMyTurn] = useState(props.isMyFirst) // 自分の手番かどうか
  const user = useStore(e => e.user);

  const refCameraStart = React.useRef<() => void>(null!);

  const on3Throw = () => {
    if (roundCount == 8) {
      if (user?.uid) RegisterTotalScore(props.gameId, user.uid, details[0].totalScore); // totalScore の 登録
      props.ToResultFn(details); // Jump Result
    } else {
      // Tableを更新
      const newDetails = [...details];
      newDetails[0].rounds[roundCount] = round;
      newDetails[0].totalScore += round.score;
      setDetails(newDetails);

      if (user?.uid) {
        for (let i = dartsCount; i < 3; i += 1) { // 投げ足りない分をDBに登録
          RegisterDart(props.gameId, user.uid, roundCount, i, initDart);
        }
        RegisterRoundScore(props.gameId, user.uid, roundCount, round.score); // score の登録
      }

      if (props.opponentId) setIsMyTurn(false); // 相手がいたら待機状態に
      setRound(makeInitRound); // Roundを空に
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

      if (user?.uid) RegisterDart(props.gameId, user.uid, roundCount, dartsCount, dart); // DBに保存
      setRound(newRound);
      setDartsCount(dartsCount + 1);
    }
  };

  // 対戦相手がいて自分のターンじゃないとき監視を行う．
  useEffect(() => {
    if (!props.opponentId || isMyTurn) return;
    const opponentRound = props.isMyFirst ? roundCount - 1 : roundCount;
    return ObserveDartAdded(props.gameId, props.opponentId, opponentRound, dartsCount, (snapshot) => {
      // DBから値を取得．score だけとか一部だけない場合はエラー吐くから注意
      const val: Dart | null = snapshot.val();
      console.log("opponent: ", val);
      if (!val) return; // 相手がDBに未保存の場合何もしない

      const newRound = {...round};
      newRound.darts[dartsCount] = val;
      newRound.score += val.score;

      if (dartsCount < 2) {
        setRound(newRound);
        setDartsCount(dartsCount + 1);
      } else { // 相手が3回投げたら detail を更新
        const newDetails = [...details];
        newDetails[1].rounds[opponentRound] = newRound;
        newDetails[1].totalScore += newRound.score;

        setDetails(newDetails);
        setRound(makeInitRound());
        setDartsCount(0);
        setIsMyTurn(true);
      }
    });
  });

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
        <ScoreTable details={details} />
        <Button 
          style={styles.button} 
          titleStyle={styles.buttonTitle}
          type={"clear"} title={finButtonText}
          disabled={!isMyTurn && roundCount < 8} 
          onPress={on3Throw}
        />
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
  buttonTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: "black",
  },
  button: {
    padding: 5,
    // borderRadius: 10,
    borderColor: "white",
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
});