import * as React from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import { HomeTabScreenProps, RootStackParamList } from '../types';
import { Button,  Text} from 'react-native-elements';
import { View } from '../components/Themed';
import { useState } from 'react';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeGameTabScreenProps = HomeTabScreenProps<'GameTab'>;

type SelectGameButtonProps = {
    navigation: HomeGameTabScreenProps['navigation'];
    to: keyof RootStackParamList;
    title: string;
};

export default function SelectGameButton(props: SelectGameButtonProps) {
  const [modalVisible, setVisible]  = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonTitle} >{props.title}</Text>
      </TouchableOpacity>
      <Overlay
        isVisible={modalVisible}
        onBackdropPress={() => setVisible(false)}
        animationType="fade"
        supportedOrientations={['portrait', 'landscape']}
      >
        <View>
          <Button
            style={styles.button2}
            onPress={() => {
              setVisible(false);
              props.navigation.navigate(props.to);
            }}
            title={" 1P mode"}
            type="clear"
            titleStyle={styles.buttonTitle2}
            icon={
              <Icon
                name='account'
                size={40}
              />
            }
          /> 
          <Button
            style={styles.button2}
            onPress={() => {
              setVisible(false);
              props.navigation.navigate("RoomSelect");
            }}
            title={" VS mode"}
            type="clear"
            titleStyle={styles.buttonTitle2}
            icon={
              <Icon
                name='account-supervisor'
                size={40}
              />
            }
          />
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  button: {
    width: 200,
    height: 100,
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
    backgroundColor: '#BBBBBB',
    justifyContent: 'center',
    margin: 20
  },
  buttonTitle2: {
    fontSize: 26,
    color:"white",
    // fontWeight: 'bold',
  },
});

