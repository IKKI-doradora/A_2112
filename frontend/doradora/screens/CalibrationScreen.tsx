import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

type CalibrationScreenProps = RootStackScreenProps<'Calibration'>;

export default function CalibrationScreen() {
  const navigation = useNavigation<CalibrationScreenProps['navigation']>()

  return (
    <View style={styles.buttonContainer} >
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonTitle} onPress={() => navigation.navigate("Game")} >To Game Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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

  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});