import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet,  TouchableOpacity, Text } from 'react-native';
import { View } from '../components/Themed';
import  {Image}  from 'react-native';
import { RootStackScreenProps } from '../types';

type TopScreenProps = RootStackScreenProps<'Top'>;
const myImg = require('../assets/images/logo3.png');

export default function TopScreen() {
  const navigation = useNavigation<TopScreenProps['navigation']>()

  return (
    <View style={styles.container}>
      <View style={{flex: 2, width: "100%", backgroundColor: 'rgba(50,50,50,1)'}}>
        <Image style={styles.logo} source={myImg}/>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')} >
          <Text style={styles.buttonTitle}>START!!</Text>
        </TouchableOpacity>
      </View>
      {/* <Image style={styles.logo} source={myImg} /> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 0,
    width: "100%",
    // padding: 20,
    flex: 1,
    backgroundColor: "#DDDDDD",
  },

  logo: {
    width:  '90%',
    height: '90%',
    // aspectRatio: 1,
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