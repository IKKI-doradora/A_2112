import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeTabScreenProps } from '../types';

type HomeScoreTabScreenProps = HomeTabScreenProps<'ScoreTab'>;

export default function HomeScoreTabScreen() {
  const navigation = useNavigation<HomeScoreTabScreenProps['navigation']>();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => navigation.navigate('Analytics', {type: 0})} >
          <Text style={styles.buttonTitle} >Count up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}} >
          <Text style={styles.buttonTitle} >X01</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}} >
          <Text style={styles.buttonTitle} >Cricket</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => navigation.navigate('Trajectory')} >
          <Text style={styles.buttonTitle} >Trajectory</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },
});