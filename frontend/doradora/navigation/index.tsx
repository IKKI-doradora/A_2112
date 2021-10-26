/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
// import TabOneScreen from '../screens/TabOneScreen';
// import TabTwoScreen from '../screens/TabTwoScreen';
import TopScreen from '../screens/TopScreen';
import HomeGameTabScreen from '../screens/HomeGameTabScreen';
import HomeScoreTabScreen from '../screens/HomeScoreTabScreen';
import CalibrationScreen from '../screens/CalibrationScreen';
import GameScreen from '../screens/GameScreen';
import GameResultScreen from '../screens/GameResultScreen';
import { RootStackParamList, HomeTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Top" component={TopScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Calibration" component={CalibrationScreen} options={{ title: '較正' }} />
      <Stack.Screen name="Game" component={GameScreen} options={{ title: 'ゲーム' }} />
      <Stack.Screen name="Result" component={GameResultScreen} options={{ title: '結果' }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<HomeTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="GameTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="GameTab"
        component={HomeGameTabScreen}
        options={{
          title: 'Game',
          tabBarIcon: ( props ) => <FontAwesome style={styles.tabBarIcon} name="gamepad" size={props.size} color={props.color} />
        }}
      />
      <BottomTab.Screen
        name="ScoreTab"
        component={HomeScoreTabScreen}
        options={{
          title: 'Score',
          tabBarIcon: ( props ) => <Ionicons style={styles.tabBarIcon} name="analytics" size={props.size} color={props.color}/>,
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
