import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { Dimensions, Image, Platform, ImageBackground } from 'react-native';
import ScoreTable from '../components/ScoreTable';
import RenderDarts from '../components/RenderDarts';
import GameComponent from '../components/GameComponent';
import { useState} from 'react';


type GameScreenProps = RootStackScreenProps<'Game'>;

const DartsData = {
  uids: 23,
  rounds: [1, 2, 3],
  position: [[[0.0, 0.0],[0.1, 0.1],[0.2, 0.2]],[[0.3, 0.3],[0.4, 0.4],[0.5, 0.5]],[[0.6, 0.6],[0.7, 0.7],[0.8, 0.8]]],
  score: [[12,20,34],[12,20,34],[12,20,34]]
};

export default function GameScreen() {
  const navigation = useNavigation<GameScreenProps['navigation']>();

return (
  <View style={styles.container}>
    <ImageBackground source={require('../assets/images/backboard.jpg')} resizeMode='cover' style={{width:'100%', height:'100%'}}>
      <GameComponent/> 
    </ImageBackground>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});