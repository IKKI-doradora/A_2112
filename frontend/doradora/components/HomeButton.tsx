import * as React from 'react';
import { Button } from "react-native-elements";
import { useNavigation } from '@react-navigation/core';
import { RootStackScreenProps} from '../types';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type GameScreenProps = RootStackScreenProps<'Game'>;

type Props = {
    top: number,
    left: number
}

export default function HomeButton(props: Props) {
    const navigation = useNavigation<GameScreenProps['navigation']>();
    const { top, left } = props;
    return (
    <Button 
        icon={
        <Icon
            name="home-variant"
            size={25}
        />}
        type="clear"
        containerStyle={{ top: top, left: left }}
        onPress={() => navigation.navigate("Home")}
    />);
}