import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Text } from 'react-native-elements';
import { View } from '../components/Themed';
import { HomeTabScreenProps } from '../types';

type HomeGameTabScreenProps = HomeTabScreenProps<'GameTab'>;
const myImg = require('../assets/images/backboard.jpg');

export default function HomeGameTabScreen() {
  const navigation = useNavigation<HomeGameTabScreenProps['navigation']>();

  return (
    <ImageBackground source={myImg} resizeMode='cover' style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text h1 style={styles.title}>Which Game Play ?</Text>
      <View style={styles.buttonContainer}>
        <SelectGameButton title="Count-up GAMES" onPress={() => navigation.navigate("Calibration")} />
        <SelectGameButton title="X01 GAMES" onPress={() => {}} />
        <SelectGameButton title="Cricket GAMES" onPress={() => {}} />
      </View>
    </ImageBackground>
  );
};

type SelectGameButtonProps = {
  title: string;
  onPress: () => void;
};

function SelectGameButton(props: SelectGameButtonProps) {
  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={props.onPress}>
        <Text style={styles.buttonTitle} >{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    height:'100%',
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

  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  button: {
    width: 200,
    height: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
});
