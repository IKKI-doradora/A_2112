import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Image, Platform, LayoutChangeEvent, TouchableOpacity} from 'react-native';
import { View, Text } from '../components/Themed';
import AnalyticsChart from '../components/AnalyticsChart';
import { RootStackScreenProps, GameDetail, Round } from '../types'
import RenderDarts from '../components/RenderDarts';
import { useNavigation, useRoute } from '@react-navigation/core';
import { numberLiteralTypeAnnotation } from '@babel/types';
import { Button } from 'react-native-elements';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

type GameResultScreenProps = RootStackScreenProps<'Result'>;

type RusultProps = {
  totalScore: number;
  rounds: Round[];
  pl: number;
  winner: boolean;
};

function ResultComponent(props:RusultProps){
  const totalScore = props.totalScore;
  const rounds = props.rounds;

  return(
    <View >
      <View style={{flex:2, paddingTop:20}}>
        <Text style={styles.scoreTitle}>{totalScore}</Text>
        <Text style={{color: "#DDDDDD"}}>PLAYER {props.pl}</Text>
      </View>
      <View style={{flex:6, flexDirection:"row", paddingTop:15}}>
        <View style={{flex:1, flexDirection:"column"}}>
        {
          rounds.map( (round, index) => {
            return (index < 4) ? (
              <Text key={index} style={styles.scores}>Round {index+1}  :   {round.score}</Text>
            ) : (null)
          })
        }
        </View>
        <View style={{flex:1, flexDirection:"column"}}>
        {
          rounds.map( (round, index) => {
            return (index >= 4) ? (
              <Text key={index} style={styles.scores}>Round {index+1}  :   {round.score}</Text>
            ) : (null)
          })
        }
        </View>
      </View>
      <Text style={{color: "white", fontSize: 25, padding:12}}>
        {
          props.winner ? ("You Win!") : ("    ")
        }
      </Text>
    </View>
  );
}

export default function GameResultScreen() {
  const navigation = useNavigation<GameResultScreenProps['navigation']>();
  const route = useRoute<GameResultScreenProps['route']>();

  let details = route.params.data;
  // details[1] = details[0]
  const opponentId = details.length - 1;

  return (
    opponentId ? (
      <View style={{flex:1}}>
        <View style={styles.container}>
          <View style={styles.resultContainer}>
            <ResultComponent
              pl={1}
              totalScore={details[0].totalScore}
              rounds={details[0].rounds}
              winner={details[0].totalScore > details[1].totalScore}
            />
          </View>
          <View style={styles.resultContainer}>
            <ResultComponent
              pl={2}
              totalScore={details[1].totalScore}
              rounds={details[1].rounds}
              winner={details[1].totalScore > details[0].totalScore}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.gametype}>Cound-up Game</Text>
          <Button
            style={styles.button2}
            title={"Finish Game"}
            type="clear"
            titleStyle={styles.buttonTitle2}
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </View>
    ) : (
      <View style={{flex:1}}>
        <View style={styles.resultContainer}>
          <ResultComponent
            pl={1}
            totalScore={details[0].totalScore}
            rounds={details[0].rounds}
            winner={false}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.gametype}>Cound-up Game</Text>
          <Button
            style={styles.button2}
            title={"Finish Game"}
            type="clear"
            titleStyle={styles.buttonTitle2}
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#EEEEEE",
  },

	boardContainer: {
    flex: 1,
		padding: 15,
  },

  chartContainer: {
    flex: 1,
    height: '100%',
  },

  resultContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    backgroundColor: "gray",
    borderWidth: 1,
    borderColor: 'white',
  },

	scoreTitle: {
    fontSize: 50,
    color: "white",
  },

	scores: {
    fontSize: RFValue(11,300),
    color: "#DDDDDD",
  },

	separator: {
    marginVertical: 15,
    height: 10,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 10,
  },

	footer: {
    flexDirection: 'row',
    height: "20%",
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    zIndex: 10,
  },


  button2: {
    width: 200,
    height: 60,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    justifyContent: 'center',
    margin: 20
  },

  buttonTitle2: {
    fontSize: 20,
    color:"black",
    fontWeight: 'bold',
  },

  gametype: {
    fontSize: 25,
    padding: 20,
    color:"black",
    // fontWeight: 'bold',
  },
});