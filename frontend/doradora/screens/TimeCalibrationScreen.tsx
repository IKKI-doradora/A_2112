import React, {useEffect, useState} from "react";
import { TimeCalibration } from "../components/TimeCalibration";
import { CameraCapturedPicture } from "expo-camera";

export const TimeCaribrationScreen: React.FC<{}> = ({}) => {
    const [pictures, setPictures] = useState<Array<CameraCapturedPicture | null>>(new Array(30));
    const [isPicturesActive, setPicturesActive] = useState<Array<Boolean>>(new Array(30));
    const [threshold, setThreshold] = useState<number>(0);
    
    useEffect(() => {
        // 各画像と前の画像との差分が閾値を超えるか計算する
        // インデックスが5の画像と前の画像との差分が閾値を超えたと想定
        for(let i=0; i<isPicturesActive.length; i++) isPicturesActive[i] = i === 5;
    }, [threshold]);
    return(
        <TimeCalibration pictures={pictures} setPictures={setPictures} threshold={threshold} setThreshold={setThreshold} isPicturesActive={isPicturesActive}/>
    )
}