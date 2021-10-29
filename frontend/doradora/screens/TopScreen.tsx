import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet,  TouchableOpacity, Text } from 'react-native';
import { View } from '../components/Themed';
import  {Image}  from 'react-native';
import { RootStackScreenProps } from '../types';

type TopScreenProps = RootStackScreenProps<'Top'>;
const myImg = require('../assets/images/icon.png');

export default function TopScreen() {
  const navigation = useNavigation<TopScreenProps['navigation']>()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')} >
        <Text style={styles.buttonTitle} >START!!</Text>
      </TouchableOpacity>
      <Image style={styles.logo} source={myImg} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flexDirection: 'row',
    flex: 1,
  },

  logo: {
    width: 400,
    height: 400,
  },

  button: {
    width: 200,
    height: 80,
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