import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useState } from 'react';
import { Text, View } from '../components/Themed';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'
import { useNavigation } from '@react-navigation/core';

type MoveOneNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MoveOne'>

export default function MoveOneScreen() {
  const navigation = useNavigation<MoveOneNavigationProp>()
  const [counter, setCounter] = useState<number>(0)

  const onPress = () => {
    setCounter(counter + 1);
    navigation.navigate("MoveTwo", {cnt: counter})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>見本 A</Text>
      <Text style={styles.title}>count: {counter}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity style={styles.button} onPress={() => onPress()}>
        <Text>Move Two!!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
});
