import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from "react-native"
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import TrajectoryScreen from './screens/TrajectoryScreen';
import DartsBoard from './components/DartsBoard';
import BoardNumbers from './components/BoardNumbers';


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const colors = [...Array(20)].map((_, i) => "#000000");
  const colors0 = [...Array(10)].map((_, i) => "#FF4444");
  const colors1 = [...Array(10)].map((_, i) => "#44FF44");
  const colors2 = [...Array(10)].map((_, i) => "#000000");
  const colors3 = [...Array(10)].map((_, i) => "#FFFF88");
  const colors4 = [...Array(10)].map((_, i) => "#FF4444");
  const colors5 = [...Array(10)].map((_, i) => "#44FF44");
  const colors6 = [...Array(10)].map((_, i) => "#000000");
  const colors7 = [...Array(10)].map((_, i) => "#FFFF88");
  const colors8 = ["#FF4444", "#000000"]
  const colorses = [colors0, colors1, colors2, colors3, colors4, colors5, colors6, colors7, colors8];

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      // <SafeAreaProvider>
        
        
      //   <Navigation colorScheme={colorScheme} />
      //   <StatusBar />
      // </SafeAreaProvider>
      <View>
        <View style={{position: "absolute", top: 50, left: 50}}>
          <DartsBoard diameter={300} maxZIndex={0} colorses={colorses}/>
        </View>
        <View style={{position: "absolute", top: 50, left: 50}}>
          <BoardNumbers diameter={300} fontSize={25} colors={colors} zIndex={0} />
        </View>
      </View>
      // <TrajectoryScreen />
      // <View style={{alignItems: "center", justifyContent: "center"}}>
      //   <DartsBoard diameter={300} maxZIndex={0}/>
      // </View>

    );
  }
}
