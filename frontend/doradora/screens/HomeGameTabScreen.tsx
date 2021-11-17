import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import { Button,  Text} from 'react-native-elements';
import { View } from '../components/Themed';
import { HomeTabScreenProps, RootStackParamList } from '../types';
import SelectGameButton from '../components/SelectGameButton';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

type HomeGameTabScreenProps = HomeTabScreenProps<'GameTab'>;
const myImg = require('../assets/images/backboard.jpg');

export default function HomeGameTabScreen() {
  const navigation = useNavigation<HomeGameTabScreenProps['navigation']>();

  return (
    <View style={styles.container}>
      <ImageBackground source={myImg} resizeMode='cover' style={{width:'100%', height:'100%'}}>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text h1 style={styles.title}>Which Game Play ?</Text>
        <View style={styles.buttonContainer}>
          <SelectGameButton navigation={navigation} to="Calibration" title="Count-up GAMES" />
          <SelectGameButton navigation={navigation} to="Home" title="X01 GAMES" />
          <SelectGameButton navigation={navigation} to="Home" title="Cricket GAMES" />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  title: {
    flex: 1,
    color: "white",
    fontStyle: "italic",
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 3
  },
});
