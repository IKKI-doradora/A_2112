import React, {useEffect, useState} from "react";
import { TimeCalibration } from "../components/TimeCalibration";
import { CameraCapturedPicture } from "expo-camera";

export const TimeCaribrationScreen: React.FC<{}> = ({}) => {
    const [pictures, setPictures] = useState<Array<CameraCapturedPicture | null>>(new Array(10));
    const [diffs, setdiffs] = useState<Array<number>>(new Array(10));
    const [threshold, setThreshold] = useState<number>(1);
    
    useEffect(() => {
        // 各画像と前の画像との差分が閾値を超えるか計算する
        // インデックスが5の画像と前の画像との差分が閾値を超えたと想定
        for(let i=0; i<diffs.length; i++) diffs[i] = i * 0.1;
    }, [pictures]);
    return(
        <TimeCalibration pictures={pictures} setPictures={setPictures} threshold={threshold} setThreshold={setThreshold} diffs={diffs}/>
    )
}