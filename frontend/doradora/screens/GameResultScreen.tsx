import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

type GameResultScreenProps = RootStackScreenProps<'Result'>;

export default function GameResultScreen() {
  const navigation = useNavigation<GameResultScreenProps['navigation']>()

  return (
    <View style={styles.buttonContainer} >
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonTitle} onPress={() => navigation.navigate("Home")} >To Home Screen</Text>
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