/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Top: 'top',
      Home: {
        screens: {
          GameTab: 'gameTab',
          AnalyticsTab: 'analyticsTab',
        },
      },
      Calibration: 'calibration',
      Game: 'game',
      Result: 'result',
      Analytics: 'analytics',
      Trajectory: 'trajectory',
      RoomSelect: 'roomselect',
    },
  },
};

export default linking;
