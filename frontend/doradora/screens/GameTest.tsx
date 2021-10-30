
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

type Position = {
  x: number,
  y: number,
  score: number
}

type DartsCallBack = (position: Position) => void;


let camera: Camera | null;

// const takePictureAsync = async () => {
//   return new Promise<CameraCapturedPicture>((resolve, reject) => {
//     const dummy: CameraCapturedPicture = {
//       width: 1920,
//       height: 1440,
//       uri: 'data://null',
//     }
//     setTimeout(() => {
//       resolve(dummy)
//     }, 1000);
//   })
// }

// type Darts = {
//   start: VoidFunction,
//   stop: VoidFunction,
//   subscribe: (callback: DartsCallBack) => void,
// }

// export function useDarts(): Darts {
//   const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>();
//   const [handleChange, setHandleChange] = useState<DartsCallBack | undefined>(undefined);
//   // const []
//   const start = () => {
//     const interval = 1000;
//     const interval_id = setInterval(async () => {
//       const pic = await takePictureAsync();
//       console.log(pic)
//       if (handleChange) {
//         handleChange({ x: 1, y: 2 })
//       }
//     }, interval)
//     setIntervalId(interval_id)
//   }
//   const stop = () => {
//     setIntervalId(null);
//   }
//   const subscribe = (callback: DartsCallBack) => {
//     setHandleChange(callback);
//   }
//   return { start, stop, subscribe };
// }

function useMotionDetect(onDetect: () => void, frame_rate = 20, threshold = 0.5) {
  type Buff = Float32Array
  const refTFStreamBuff = useRef<Array<Buff>>([]);
  const refDiffBuff = useRef<Array<number>>([]);
  const refTFSumBuff = useRef<Buff>(null!);
  const refPreview = useRef<Buff>(null!);
  const refNumBuff = useRef<number>(0);

  function clearBuff() {
    // console.log('clear buff')
    // refTFStreamBuff.current.forEach(e => {
    //   // e.dispose()
    // });
    refTFStreamBuff.current.length = 0
  }

  const PERIOD = 1000
  const N_FRAME = Math.floor(frame_rate / 2);

  // function calc(frame: tf.Tensor3D) {

  //   if (refPreview.current == null) {
  //     refPreview.current = frame.slice([0, 0, 2], [-1, -1, 1])
  //   } else {
  //     tf.sub(frame.slice([0, 0, 1], [-1, -1, 1]), refPreview.current).mean().array().then(console.log)
  //     // console.log(tf.sub(refPreview.current,frame))

  //     refPreview.current = frame.slice([0, 0, 2], [-1, -1, 1])
  //   }


  // }


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

    // if (refTFSumBuff.current == null) {
    //   refTFSumBuff.current = frame
    // } else {
    //   refTFSumBuff.current = tf.add(refTFSumBuff.current, frame)
    //   frame.dispose()
    // }


    // console.log(frame);
    // preview+=1
    // calc()

  }

  return { addFrame }
}


// class MotionDetect {

//   TFStreamBuff = Array<tf.Tensor3D>();

//   constructor() {
//   }


// }


// const refTFStreamBuff = useRef<Array<tf.Tensor3D>>([]);
// const refPreview = useRef<tf.Tensor>(null!);

// function clearBuff() {
//   console.log('clear buff')
//   refTFStreamBuff.current.forEach(e => {
//     e.dispose()
//   });
//   refTFStreamBuff.current.length = 0
// }

// const PERIOD = 1000

// function calc() {
//   if (refTFStreamBuff.current.length == 0) {

//   } else {
//     if (refPreview.current) {
//       refPreview.current.dispose();
//     }
//     const mean = tf.stack(refTFStreamBuff.current).mean(0);
//     console.log(mean);
//     refPreview.current = mean;
//     clearBuff();
//   }
// }

// React.useEffect(() => {
//   const interval_id = setInterval(() => {
//     calc();
//   }, PERIOD)


//   return (() => {
//     clearInterval(interval_id);
//     clearBuff()
//   })
// }, [])


// function addFrame(frame: tf.Tensor3D): void {
//   refTFStreamBuff.current.push(frame)
//   console.log('add frame');
//   // console.log(preview);
//   // preview+=1

// }

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

  const FRAME_RATE = 30;
  const ORG_FRAME_RATE = 60;
  const INTERVAL = 3;
  const SCALE_FR = Math.round(ORG_FRAME_RATE / FRAME_RATE);

  function submitPictures(pre: string, then: string) {
    console.log('submit here');
    console.log(pre, then);
    // const url = 'http://proc.memotube.xyz/arrow'
    const url = 'http://192.168.0.162:5000/arrow'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ base64ImagePrev: pre, base64Image: then }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      console.log('response here',res,'aaa');
      console.log(res)
    })
  }

  function handleMotionDetect() {
    if (refCamera.current) {
      if (isInterval.current == false) {
        refCamera.current.takePictureAsync({ base64: true }).then((pic) => {
          // console.log(refCaptured.current)
          submitPictures(refCaptured.current[refCaptured.current.length - 1], pic.base64 as string)
          refCaptured.current.push(pic.base64 as string);
        })
        isInterval.current = true
        setTimeout(() => {
          isInterval.current = false
        }, INTERVAL * 1000)
      }
    }
  }



  const { addFrame } = useMotionDetect(handleMotionDetect, FRAME_RATE, 0.45);
  // const motionDetercter = new MotionDetect();
  // const addFrame = motionDetercter.addFrame;

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      console.log('stoped??')
    };
  }, [isActivated]);

  const start = () => {
    if (refCamera.current) {
      refCamera.current.takePictureAsync({ base64: true }).then(pic => {
        refCaptured.current.push(pic.base64 as string);
      })
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
        width={size.width}
        onReady={onReady}
        autorender={true}
        _ref={(r) => { if (r) refCamera.current = r.camera }}
      />
    ),
    [onReady, size.width, isTensorflowLoaded, isActivated]);
}

export default function GameTest() {

  const refCameraStart = useRef<() => void>(null!);

  const handleThrow = (position: Position) => {
    console.log(position)
  }


  return (
    <View>
      <Button onPress={() => { if (refCameraStart.current) { refCameraStart.current() } }} />
      <DartsCamera onThrow={handleThrow} _ref={(r: () => void) => { refCameraStart.current = r }} />
    </View>
  )
}