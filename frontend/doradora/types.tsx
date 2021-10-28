/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Top: undefined;
  Home: NavigatorScreenParams<HomeTabParamList> | undefined;
  Calibration: undefined;
  Game: undefined;
  Result: undefined;
  Analytics: undefined;
  MoveOne: undefined;
  MoveTwo: {count: number};
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type HomeTabParamList = {
  GameTab: undefined;
  ScoreTab: undefined;
};

export type HomeTabScreenProps<Screen extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type Position = {
  x: number;
  y: number;
}

export type DartsProps = {
  positions: Array<Array<Position>>;
  scores: Array<Array<number>>;
  totalScore: number;
};

export type GameProps = {
  game_id: string;
  type: 0 | 1 | 2;
  n_rounds: number;
  uids: Map<string, DartsProps>;
};