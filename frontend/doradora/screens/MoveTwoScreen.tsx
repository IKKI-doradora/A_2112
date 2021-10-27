import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'
import { useNavigation, useRoute } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';

type MoveTwoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MoveTwo'>
type MoveTwoScreenRouteProp = RouteProp<RootStackParamList, 'MoveTwo'>;

export default function MoveTwoScreen() {
  const navigation = useNavigation<MoveTwoNavigationProp>()
  const route = useRoute<MoveTwoScreenRouteProp>()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>見本 B</Text>
      <Text style={styles.title}>get props cnt: {route.params.count}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MoveOne")}>
        <Text>Move one!!</Text>
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
