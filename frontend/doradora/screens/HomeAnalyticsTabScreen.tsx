import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { HomeTabScreenProps } from '../types';
import { Text } from 'react-native-elements';
import { View } from '../components/Themed';

type HomeAnalyticsTabScreenProps = HomeTabScreenProps<'AnalyticsTab'>;
const myImg = require('../assets/images/backboard.jpg');

export default function HomeAnalyticsTabScreen() {
  const navigation = useNavigation<HomeAnalyticsTabScreenProps['navigation']>();

  return (
    <ImageBackground source={myImg} resizeMode='cover' style={styles.container}>
      <View style={styles.buttonContainer}>
        <SelectGameButton title={"Count up"} onPress={() => navigation.navigate('Analytics', {type: 0})} />
        <SelectGameButton title={"X01"} onPress={() => {}} />
        <SelectGameButton title={"Cricket"} onPress={() => {}} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.trajectoryButton} onPress={() => navigation.navigate('Trajectory')} >
          <Text style={styles.buttonTitle} >Trajectory</Text>
        </TouchableOpacity>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    height:'100%',
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    margin: 3
  },

  trajectoryButton: {
    width: 600,
    height: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },
});