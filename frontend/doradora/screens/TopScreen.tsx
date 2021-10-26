import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

type TopScreenProps = RootStackScreenProps<'Top'>;

export default function TopScreen() {
  const navigation = useNavigation<TopScreenProps['navigation']>()

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/images/icon.png')} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')} >
        <Text style={styles.buttonTitle} >START!!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 300,
    height: 300,
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