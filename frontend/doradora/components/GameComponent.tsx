import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { Dimensions, Image, Platform, ImageBackground } from 'react-native';
import { useState} from 'react';
import { Button,Badge} from 'react-native-elements';
import ScoreTable from '../components/ScoreTable';
import RenderDarts from '../components/RenderDarts';


type GameScreenProps = RootStackScreenProps<'Game'>;

const Data = {
  uids: {
    320: {
      positions: [[[0.0, 0.0],[0.1, 0.1],[0.2, 0.2]],[[0.3, 0.3],[0.4, 0.4],[0.5, 0.5]],[[0.6, 0.6],[0.7, 0.7],[0.8, 0.8]]],
      scores: [[12,20,34],[12,20,34],[12,20,34]],
      totalScore: 0
    }
  }
};

export default function GameComponent(){
  const navigation = useNavigation<GameScreenProps['navigation']>();

  const [Round, setRound] = useState<number>(1)
  const [Positions, setPositions] = useState([[],[],[]]);
  const [Scores, setScores] = useState([[],[],[]]);
  const [Darts, setDarts] = useState([[],[],[]]);
  const [Count, setCount] = useState<number>(0);


  const on3Throw = () => {
    setRound(Round + 1);
    setDarts([[],[],[]]);
    if( Round > 7){
      // ここで　firebase に uids を送信
      // Result に　props を渡す
      navigation.navigate("Result")
    }
  }

//   const onGetData = (x,y,score) => {
//     setPositions(Positions[Round].push([x,y]));
//     setScores(Scores[Round].push(score);
//     Data.uids[320].totalScore += score; 
//     if(Count < 3){
//       setDarts(Darts[Count]=[x,y]);
//       setCount(Count+1);
//     }else{
//       setCount(0);
//     }
//   }
// }

  return (
    <View style={styles.scoreContainer}>
      <View style={styles.leftContainer}>
        <Badge 
          value={`R ${Round}`} 
          status="error" 
          containerStyle={{ top: 30, left: 160 }}
        />
        <RenderDarts data = {Data}/>
      </View>
      <View style={styles.rightContainer}>
        <Button 
          title="Throwed" 
          onPress={() => on3Throw()}
        />
        <ScoreTable/>
        <Button 
          title="To Result" 
          onPress={() => navigation.navigate("Result")}
        />
      </View>
    </View>
);
}

const styles = StyleSheet.create({
  scoreContainer: {
		flex: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.6)' 
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