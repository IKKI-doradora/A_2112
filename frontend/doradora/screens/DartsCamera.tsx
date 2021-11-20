
import { StatusBar } from 'expo-status-bar'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { useWindowDimensions, StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import { Camera, CameraCapturedPicture } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import { CapturedPicture } from 'expo-camera/build/Camera.types'

import { CustomTensorCamera } from '../components/CustomTensorCamera';
import { useTensorFlowLoaded } from '../hooks/useTensorFlow'
import * as tf from "@tensorflow/tfjs";
import { repeatVector } from '@tensorflow/tfjs-layers/dist/exports_layers'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { useStore } from '../hooks/useStore'

type Dart = {
  x: number,
  y: number,
  score: number
}

type DartsCallBack = (position: Dart) => void;


let camera: Camera | null;


function useMotionDetect(onDetect: () => void, frame_rate = 20, threshold = 0.9) {
  type Buff = Float32Array
  const refTFStreamBuff = useRef<Array<Buff>>([]);
  const refDiffBuff = useRef<Array<number>>([]);
  const refTFSumBuff = useRef<Buff>(null!);
  const refPreview = useRef<Buff>(null!);
  const refNumBuff = useRef<number>(0);

  function clearBuff() {
    refTFStreamBuff.current.length = 0
  }

  const PERIOD = 1000
  const N_FRAME = Math.floor(frame_rate / 2);


  function calc() {
    let diff = 0;
    const num_frames = refTFStreamBuff.current.length
    const num_pixels = refTFStreamBuff.current[0].length
    const means = new Float32Array(num_pixels).fill(0);
    refTFStreamBuff.current.forEach(buff => {
      for (let i = 0; i < buff.length; i++) {
        means[i] += buff[i] / num_frames
      }
    })

    if (refPreview.current != null) {
      // calc diff
      for (let i = 0; i < num_pixels; i++) {
        diff += Math.min(Math.abs(refPreview.current[i] - means[i]), 10);
      }
      diff = diff / num_pixels
      refDiffBuff.current.push(diff)
      refDiffBuff.current = refDiffBuff.current.slice(-3);
    }

    if (refDiffBuff.current.length >= 3) {
      const _move = [0.1, 0.1, 0.8]
      const moveAverage = refDiffBuff.current.reduce((sum, e, i) => sum + e * _move[i], 0);
      console.log(moveAverage)
      if (moveAverage > threshold) {
        onDetect()
      }
    }

    refPreview.current = means;
    clearBuff();
  }

  React.useEffect(() => {
    // const interval_id = setInterval(() => {
    //   // calc();
    // }, PERIOD)


    return (() => {
      // clearInterval(interval_id);
      clearBuff()
    })
  }, [])


  const addFrame = (frame: tf.Tensor3D): void => {
    frame.mean(2).data().then((data) => {
      // console.log('add frame');
      // console.log(data)
      refTFStreamBuff.current.push(data as Buff)
      frame.dispose()
    })

    if (refNumBuff.current == N_FRAME) {
      calc()

      refNumBuff.current = 0
    } else {
      refNumBuff.current += 1
    }

  }

  return { addFrame }
}



type DartsCameraProps = {
  onThrow: DartsCallBack,
  _ref: (callBack: VoidFunction) => void,
}

export function DartsCamera(props: DartsCameraProps) {
  const raf = React.useRef<number>(0);
  const size = useWindowDimensions();
  const isTensorflowLoaded = useTensorFlowLoaded();
  const [isActivated, setActivated] = useState(true);
  const isInterval = useRef(false);
  const refNumFrames = useRef(0);
  const refCamera = useRef<Camera | null>();
  const refCaptured = useRef<Array<string>>([]);
  const user = useStore(e => e.user);

  const FRAME_RATE = 30;
  const ORG_FRAME_RATE = 60;
  const INTERVAL = 3;
  const SCALE_FR = Math.round(ORG_FRAME_RATE / FRAME_RATE);

  function submitPictures(pre: string, then: string) {
    console.log('submit here');
    // console.log(pre, then);
    // const url = 'http://proc.memotube.xyz/arrow'
    const url = 'http://192.168.0.162:5000/arrow'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ base64ImagePrev: pre, base64Image: then, uid: user?.uid }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      console.log('response here', res, 'aa');
      console.log(res.json().then((dart:Dart)=>{
        props.onThrow(dart)
        console.log(dart)
      }))
    })
  }

  function handleMotionDetect() {
    if (refCamera.current) {
      if (isInterval.current == false) {
        refCamera.current.takePictureAsync({ base64: true }).then((pic) => {
          ImageManipulator.manipulateAsync(
            pic.uri,
            [{ resize: { width: pic.width / 3, height: pic.height / 3 } },],
            // [{ resize: { width: 450, height: 900 } },],
            { base64: true, compress: 1 }
          ).then((res) => {
            // console.log(refCaptured.current)
            // console.log(res.height, res.width)
            if(refCaptured.current.length>=1){
              submitPictures(refCaptured.current[refCaptured.current.length - 1], res.base64 as string)
            }
            refCaptured.current.push(res.base64 as string);
          }
          )
        })
        isInterval.current = true
        setTimeout(() => {
          isInterval.current = false
        }, INTERVAL * 1000)
      }
    }
  }



  const { addFrame } = useMotionDetect(handleMotionDetect, FRAME_RATE, 0.45);


  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      console.log('stoped??')
    };
  }, [isActivated]);

  const start = () => {
    if (refCamera.current) {
      refCaptured.current.length=0
      handleMotionDetect()
    }
  }
  props._ref(start)


  const onReady = React.useCallback(
    (images) => {
      const loop = async () => {
        const nextImageTensor = images.next().value;
        // console.log(nextImageTensor.arraySync()[0][0].length);
        // console.log(nextImageTensor)

        // console.log(refNumFrames.current)
        refNumFrames.current = 1 + refNumFrames.current;
        if (isActivated && ((refNumFrames.current % SCALE_FR) == 0)) {
          // console.log(nextImageTensor);
          addFrame(nextImageTensor);
        }

        // const predictions = await model.classify(nextImageTensor);
        // setPredictions(predictions);
        raf.current = requestAnimationFrame(loop);
      };
      loop().catch((e) => {
        // TODO
        console.log(e)
      });
    },
    [isActivated]
  );

  return React.useMemo(
    () => (
      <CustomTensorCamera
        // width={size.width}
        width={10}
        onReady={onReady}
        autorender={false}
        _ref={(r) => { if (r) refCamera.current = r.camera }}
      />
    ),
    [onReady, size.width, isTensorflowLoaded, isActivated]);
}

function GameTest() {

  const refCameraStart = useRef<() => void>(null!);

  const handleThrow = (position: Dart) => {
    console.log(position)
  }


  return (
    <View>
      <Button onPress={() => { if (refCameraStart.current) { refCameraStart.current() } }} />
      <DartsCamera onThrow={handleThrow} _ref={(r: () => void) => { refCameraStart.current = r }} />
    </View>
  )
}