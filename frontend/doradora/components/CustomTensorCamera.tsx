import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Camera } from 'expo-camera';
import React from 'react';

// const TEXTURE_SIZE = { width: 1440, height: 1920 };
const TEXTURE_SIZE = { width: 1280, height: 960 };
// const TEXTURE_SIZE = { width: 1080, height: 1920 };

const TENSOR_WIDTH = 52;

const CAMERA_RATIO = TEXTURE_SIZE.height / TEXTURE_SIZE.width;

const TENSOR_SIZE = {
  width: TENSOR_WIDTH,
  height: TENSOR_WIDTH * CAMERA_RATIO,
};

const TensorCamera = cameraWithTensors(Camera);

type Props = {
  // useCustomShadersToResize,
  // style,
  width: number,
  autorender: boolean,
  onReady: (images: any) => void,
  _ref?: (r: any) => void,
}

export function CustomTensorCamera(props: Props) {
  const sizeStyle = React.useMemo(() => {
    const ratio = props.width / TEXTURE_SIZE.width;
    const cameraWidth = TEXTURE_SIZE.width * ratio;
    const cameraHeight = TEXTURE_SIZE.height * ratio;
    return {
      maxWidth: cameraWidth,
      minWidth: cameraWidth,
      maxHeight: cameraHeight,
      minHeight: cameraHeight,
    };
  }, [props.width]);

  return (
    <TensorCamera
      {...props}
      ref={props._ref}
      useCustomShadersToResize={false}
      style={[styles.camera, sizeStyle]}
      cameraTextureWidth={TEXTURE_SIZE.width}
      cameraTextureHeight={TEXTURE_SIZE.height}
      resizeWidth={TENSOR_SIZE.width}
      resizeHeight={TENSOR_SIZE.height}
      resizeDepth={3}
      type={Camera.Constants.Type.back}
      ratio={'16:9'}
    />
  );
}


const styles = StyleSheet.create({
  camera: {
    zIndex: 0,
    // height:40,
    // width:30,
  },
});
