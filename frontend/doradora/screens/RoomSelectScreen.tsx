import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Image, Platform, LayoutChangeEvent, TouchableOpacity} from 'react-native';
import { Button, Text, Input} from 'react-native-elements';
import { View } from '../components/Themed';
import { RootStackScreenProps, HomeTabScreenProps } from '../types'
import { useNavigation, useRoute } from '@react-navigation/core';

type HomeGameTabScreenProps = HomeTabScreenProps<'GameTab'>;

export default function RoomSelectScreen() {
  const navigation = useNavigation<HomeGameTabScreenProps['navigation']>();
  const [roomId, setRoomId]  = useState("-----");

  return (
    <View style={styles.container}>
      <View style={styles.roomContainer}>
        <View>
          <Button
            style={styles.button2}
            title={"Create Room"}
            onPress={() => setRoomId("35012")}
            type="clear"
            titleStyle={styles.buttonTitle2}
          /> 
          <Text style={styles.title}>{roomId}</Text>
          <View style={styles.separator}/>
        </View>
        <View>
          <Button
            style={styles.button2}
            title={"Join Room"}
            // onPress={() => }
            type="clear"
            titleStyle={styles.buttonTitle2}
          />
          <Input
            placeholder='Room ID'
          />
        </View>
      </View>
      <Button
        style={styles.button}
        title={"Game Start"}
        onPress={() => navigation.navigate("Calibration")}
        type="clear"
        titleStyle={styles.buttonTitle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#FFDBC9',
  },
	roomContainer: {
		padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: '80%',
    backgroundColor: '#AAAAAA',
  },
  title: {
    fontSize: 21,
    // fontWeight: 'bold',
    color:"black", 
  },
  buttonTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color:"black", 
  },
  button: {
    width: 200,
    height: 60,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  button2: {
    width: 200,
    height: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#AAAAAA',
    justifyContent: 'center',
    margin: 20
  },
  buttonTitle2: {
    fontSize: 26,
    color:"white",
    // fontWeight: 'bold',
  },
});