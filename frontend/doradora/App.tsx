import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from "react-native"
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import TrajectoryScreen from './screens/TrajectoryScreen';
import DartsBoard from './components/DartsBoard';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <TrajectoryScreen />
        {/* <View style={{alignItems: "center", justifyContent: "center"}}>
          <DartsBoard diameter={300} maxZIndex={0}/>
        </View> */}
        {/* <Navigation colorScheme={colorScheme} /> */}
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
