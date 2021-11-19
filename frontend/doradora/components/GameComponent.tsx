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
import { RegisterDart, RegisterRoundScore, RegisterTotalScore, ObserveDartAdded, ObserveRoundScore } from '../hooks/firebase';

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
  const [isMyTurn, setIsMyTurn] = useState(props.isMyFirst) // 自分の手番かどうか
  const user = useStore(e => e.user);

  const refCameraStart = React.useRef<() => void>(null!);

  const on3Throw = () => {
    setRoundCount(_roundCount => {
      if (_roundCount == 8) {
        setDetails(_details => {
          if (user?.uid) RegisterTotalScore(props.gameId, user.uid, _details[0].totalScore); // totalScore の 登録
          props.ToResultFn(_details); // Jump Result
          return _details;
        })
        return _roundCount;
      } else {
      // Tableを更新
        setRound(_round => {
          setDetails(_details => {
            const newDetails = [..._details];
            newDetails[0].rounds[_roundCount] = _round;
            newDetails[0].totalScore += _round.score;
            return newDetails;
          });

          _round.score = _round.darts[0].score + _round.darts[1].score + _round.darts[2].score;
          if (user?.uid) {
            // 投げ足りない分をDBに登録
            for (let i = dartsCount; i < 3; i += 1) RegisterDart(props.gameId, user.uid, _roundCount, i, initDart);
            RegisterRoundScore(props.gameId, user.uid, _roundCount, _round.score); // score の登録
          }
          return makeInitRound();
        });

        if (props.opponentId) setIsMyTurn(() => false); // 相手がいたら待機状態に
        setDartsCount(() => 0);
        return _roundCount + 1;
    }});
    refCameraStart.current();
  }

  const onGetData = (dart: Dart) => {
    // Roundを更新
    console.log(dart);
    if (dart.x) {
      setDartsCount(_dartsCount => {
        if (_dartsCount > 2) return _dartsCount; // 既に3投していたら飛ばす

        setRoundCount(_roundCount => {
          if (user?.uid) RegisterDart(props.gameId, user.uid, _roundCount, _dartsCount, dart); // DBに保存

          setRound(_round => {
            const newRound = {..._round};
            newRound.darts[_dartsCount] = dart;
            return newRound;
          });
          return _roundCount;
        });
        return _dartsCount + 1;
      });
    }
  };

  // 対戦相手がいて自分のターンじゃないとき監視を行う．
  useEffect(() => {
    if (!props.opponentId || isMyTurn) return;

    const opponentRound = props.isMyFirst ? roundCount - 1 : roundCount;
    return ObserveDartAdded(props.gameId, props.opponentId ?? "", opponentRound, dartsCount, (snapshot) => {
      // DBから値を取得．score だけとか一部だけない場合はエラー吐くから注意
      const val: Dart | null = snapshot.val();
      console.log("opponent: ", val);
      if (!val) return; // 相手がDBに未保存の場合何もしない

      setDartsCount(_dartsCount => {
        setRound(_round => {
          const newRound = {..._round};
          newRound.darts[_dartsCount] = val;
          newRound.score += val.score;
          if (_dartsCount < 2) return newRound;

          setDetails(_details => {
            const newDetails = [..._details];
            newDetails[1].rounds[opponentRound] = newRound;
            newDetails[1].totalScore += newRound.score;
            // setIsMyTurn(() => true);
            return newDetails;
          });
          return makeInitRound();
        });
        return (_dartsCount + 1) % 3;
      });
    });
  });

  useEffect(() => {
    if (!props.opponentId || isMyTurn) return;
    if (dartsCount < 2) return;

    const opponentRound = props.isMyFirst ? roundCount - 1 : roundCount;
    return ObserveRoundScore(props.gameId, props.opponentId, opponentRound, (snapshot) => {
      const score: number | null = snapshot.val();
      if (score == null) return;
      setIsMyTurn(true);
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
        <RenderDarts darts={round.darts} isAnalysisColor={!isMyTurn}/>
      </View >
      <View style={styles.rightContainer}>
        <ScoreTable details={details} />
        <Button
          style={styles.button}
          titleStyle={styles.buttonTitle}
          type={"clear"}
          title={roundCount == 8 ? "Game Fin" : "Round Fin"}
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