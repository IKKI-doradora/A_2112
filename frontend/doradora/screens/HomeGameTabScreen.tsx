import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, TouchableOpacity  } from 'react-native';

import { Text, View } from '../components/Themed';
import { HomeTabScreenProps, RootStackParamList } from '../types';

type HomeGameTabScreenProps = HomeTabScreenProps<'GameTab'>;

export default function HomeGameTabScreen() {
  const navigation = useNavigation<HomeGameTabScreenProps['navigation']>();

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Game Start</Text> */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.buttonContainer}>
        <SelectGameButton navigation={navigation} to="Calibration" title="Count-up GAMES" />
        <SelectGameButton navigation={navigation} to="Home" title="X01 GAMES" />
        <SelectGameButton navigation={navigation} to="Home" title="Cricket GAMES" />
      </View>
    </View>
  );
}

/**
 * ボタンをコンポーネント化する？
 */
type SelectGameButtonProps = {
  navigation: HomeGameTabScreenProps['navigation'];
  to: keyof RootStackParamList;
  title: string;
};

function SelectGameButton(props: SelectGameButtonProps) {
  return (
    <View>
      <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate(props.to)}
      >
        <Text style={styles.buttonTitle} >{props.title}</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
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
