import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from "react-native"
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  Asset.loadAsync(require('./assets/images/backboard.jpg'));
  Asset.loadAsync(require('./assets/images/icon.png'));
  Asset.loadAsync(require('./assets/images/board_c.png'));

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
