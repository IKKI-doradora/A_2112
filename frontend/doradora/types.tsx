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
  Result: {data: GameDetail;};
  Analytics: {type: 0 | 1 | 2;};
  Trajectory: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type HomeTabParamList = {
  GameTab: undefined;
  AnalyticsTab: undefined;
};

export type HomeTabScreenProps<Screen extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type Dart = {
  x: number;
  y: number;
  score: number;
}

export type Round = {
  darts: Dart[];
  score: number; // 3本の合計
}

export type GameDetail = {
  rounds: Round[];
  totalScore: number; // roundの合計
};

export type Game = {
  gameId: string;
  type: 0 | 1 | 2;
  nRounds: number;
  uids: Map<string, GameDetail>;
};
