import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity} from 'react-native';

// import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'
import { useNavigation } from '@react-navigation/core';

type ModalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Modal'>

export default function ModalScreen() {
  const navigation = useNavigation<ModalScreenNavigationProp>()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MoveOne")}>
        <Text>Move One!!</Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
