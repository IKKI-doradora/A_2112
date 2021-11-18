import { useNavigation, useRoute } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { ImageBackground } from 'react-native';
import GameComponent from '../components/GameComponent';

const myImg = require('../assets/images/backboard.jpg');
type GameScreenProps = RootStackScreenProps<'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<GameScreenProps['navigation']>();
  const route = useRoute<GameScreenProps['route']>();

  return (
    <View style={styles.container}>
      <ImageBackground source={myImg} resizeMode='cover' style={{width:'100%', height:'100%'}}>
        <GameComponent
          gameId={route.params.gameId}
          ToResultFn={(detail) => {navigation.navigate('Result', {data: detail})}}
          opponentId={route.params.opponentId}
          isMyFirst={route.params.isMyFirst}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});