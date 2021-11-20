import * as React from 'react';
import { useState, useRef , useEffect, Ref,  } from 'react';
import { StyleSheet, Image, Platform, LayoutChangeEvent, TouchableOpacity, Alert, GestureResponderEvent, TextInput } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types'
import { useNavigation } from '@react-navigation/core';

import { CreateRoom, CreateGame, ObserveRoomJoined, JoinRoom } from '../hooks/firebase';
import { useStore } from '../hooks/useStore';

type HomeGameTabScreenProps = RootStackScreenProps<'RoomSelect'>;

export default function RoomSelectScreen() {
  const navigation = useNavigation<HomeGameTabScreenProps['navigation']>();
  const [roomId, setRoomId]  = useState("");
  const gameId = useRef("");
  const inputText = useRef("");
  const user = useStore(e => e.user);

  useEffect(() => {
    if (!roomId) return;
    return ObserveRoomJoined(roomId, (opponentId) => {
      if (!opponentId) return;
      // to Calibration Screen as host
      navigation.navigate("Calibration", {gameId: gameId.current, opponentId: opponentId, isMyFirst: true});
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.roomContainer}>
        <View>
          <Button
            style={styles.button2}
            title={roomId ? "Please wait" : "Create Room"}
            disabled={!!roomId} // 一度生成したら生成できない様にする
            type="clear"
            titleStyle={styles.buttonTitle2}
            onPress={() => {
              if (roomId) {
                Alert.alert("Already Created");
              } else if (user?.uid)  {
                gameId.current = CreateGame(0, 8) ?? "";
                CreateRoom(gameId.current, user.uid).then(newRoomId => setRoomId(newRoomId));
              } else {
                Alert.alert("login error");
              }
            }}
          />
          <Text style={styles.title}>{roomId}</Text>
          <View style={styles.separator}/>
        </View>
        <View>
          <Button
            style={styles.button2}
            title={"Join Room"}
            type="clear"
            titleStyle={styles.buttonTitle2}
            onPress={() => {
              if (user?.uid) {
                JoinRoom(inputText.current, user.uid).then(result => {
                  if (result.joined) { // 参加した
                    // to calibration screen as opponent
                    navigation.navigate("Calibration", {gameId: result.gameId ?? "", opponentId: result.host, isMyFirst: false});
                  } else if (result.isExist) { // 満員
                    Alert.alert("room is full");
                  } else { // 部屋なし
                    Alert.alert("room is not found");
                  }
                });
              } else {
                Alert.alert("login error");
              }
            }}
          />
          <Input
            placeholder='Room ID'
            onChangeText={(e) => {inputText.current = e}}
          />
        </View>
      </View>
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