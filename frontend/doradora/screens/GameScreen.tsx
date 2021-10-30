import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { Dimensions, Image, Platform, ImageBackground } from 'react-native';
import ScoreTable from '../components/ScoreTable';
import RenderDarts from '../components/RenderDarts';
import GameComponent from '../components/GameComponent';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const myImg = require('../assets/images/backboard.jpg');

export default function GameScreen() {

  return (
    <View style={styles.container}>
      <ImageBackground source={myImg} resizeMode='cover' style={{width:'100%', height:'100%'}}>
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