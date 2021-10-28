
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions, StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import { Camera, CameraCapturedPicture } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import { CapturedPicture } from 'expo-camera/build/Camera.types'

import { CustomTensorCamera } from '../components/CustomTensorCamera';
import { useTensorFlowLoaded } from '../hooks/useTensorFlow'

type Position = {
  x: number,
  y: number
}

type DartsCallBack = (position: Position) => void;
type Darts = {
  start: VoidFunction,
  stop: VoidFunction,
  subscribe: (callback: DartsCallBack) => void,
}

const takePictureAsync = async () => {
  return new Promise<CameraCapturedPicture>((resolve, reject) => {
    const dummy: CameraCapturedPicture = {
      width: 1920,
      height: 1440,
      uri: 'data://null',
    }
    setTimeout(() => {
      resolve(dummy)
    }, 1000);
  })
}


export function useDarts(): Darts {
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();
  const [handleChange, setHandleChange] = useState<DartsCallBack | undefined>(undefined);

  // const []



  const start = () => {
    const interval = 1000;
    const interval_id = setInterval(async () => {
      const pic = await takePictureAsync();
      console.log(pic)
      if (handleChange) {
        handleChange({ x: 1, y: 2 })
      }
    }, interval)

    setIntervalId(interval_id)
  }

  const stop = () => {


    setIntervalId(null);
  }

  const subscribe = (callback: DartsCallBack) => {
    setHandleChange(callback);
  }



  return { start, stop, subscribe };
}

function ModelCamera() {
  const raf = React.useRef<number>(0);
  const size = useWindowDimensions();
  const isTensorflowLoaded = useTensorFlowLoaded();


  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const onReady = React.useCallback(
    (images) => {
      const loop = async () => {
        const nextImageTensor = images.next().value;
        // console.log(nextImageTensor.arraySync()[0][0].length);
        console.log(nextImageTensor)
        // nextImageTensor
        // const predictions = await model.classify(nextImageTensor);
        // setPredictions(predictions);
        raf.current = requestAnimationFrame(loop);
      };
      loop();
    },
    []
  );

  return React.useMemo(
    () => (
      <CustomTensorCamera
        width={size.width}
        onReady={onReady}
        autorender={false}
      />
    ),
    [onReady, size.width, isTensorflowLoaded]);
}

export default function GameTest() {

  return (
    <View>
      <ModelCamera />
    </View>
  )
}