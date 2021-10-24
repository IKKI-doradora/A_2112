import * as React from 'react';
import { StyleSheet, TouchableOpacity  } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
// import SelectGamesButton from '../components/SelectGameButton';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

function SelectGamesButton({ path, title }: { path: string, title: string }) {
  return (
    <View>
      <TouchableOpacity 
          style={styles.button}
          // onPress={() => navigation.navigate({path})}
      >
        <Text style={styles.buttontitle} >{title}</Text>
      </TouchableOpacity>
    </View>
  );
}


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Start</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* SelectGameButton でゲーム選択*/}
      {/* path指定で画面遷移できる？ */}
      <View style={styles.buttoncontainer}>
        <SelectGamesButton path="count" title="Count-up GAMES" />
        <SelectGamesButton path="x01" title="X01 GAMES" />
        <SelectGamesButton path="cricket" title="Cricket GAMES" />
      </View>
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
  buttoncontainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  buttontitle: {
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
