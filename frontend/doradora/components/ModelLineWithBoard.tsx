import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import React, { useState, useEffect } from 'react';
import * as THREE from "three";
import ExpoTHREE from 'expo-three';
import { Renderer } from 'expo-three';

import { ViewStyle } from "react-native";

type LineGeometryAttribute = {
    positions: Float32Array,
    prevPositions: Float32Array,
    nextPositions: Float32Array,
    signs: Float32Array,
    indices: Uint16Array,
}

type ModelLineProps = {
    jointTimeLine: any,
    arrowTimeLine: any,
    isCameraTP: Boolean, 
    cameraPosition: number,
    animationStepSize: number,
    armLengthCm: number,
    boardHeightPix: number,
    maxHeightPix: number,
    style: ViewStyle,
}

export default function ModelLineWithBoard(props: ModelLineProps) {
    const boardDistanceCm = 237;
    const boardHeightCm = 173;
    const zScale = 200;

    const { jointTimeLine, arrowTimeLine, cameraPosition, isCameraTP, animationStepSize, armLengthCm, boardHeightPix, maxHeightPix, style } = props;
    const [ glContext, setGlContext] = useState<ExpoWebGLRenderingContext | null>(null);
    useEffect(() => {if(glContext) _onGLContextCreate(glContext)}, [glContext, cameraPosition, isCameraTP, animationStepSize]);

    const wristXYZ = jointTimeLine["16"][0];
    const elbowXYZ = jointTimeLine["14"][0];
    const armLengthPix = Math.sqrt(Math.pow(wristXYZ[0] - elbowXYZ[0], 2) + Math.pow(wristXYZ[1] - elbowXYZ[1], 2) + Math.pow(wristXYZ[2] - elbowXYZ[2], 2));
    const PixToCm = armLengthCm / armLengthPix;

    const earHeightPix = jointTimeLine["7"][0][1];
    const earHeightCm = boardHeightCm * earHeightPix / boardHeightPix;

    const earXYZ = jointTimeLine["7"][0]
    earXYZ[1] = maxHeightPix - earXYZ[1];

    const _normalizeJoint = (pos: number, xyz: number) => {
        let temp = pos;
        if(xyz === 1) temp = maxHeightPix - pos;
        temp -= earXYZ[xyz];
        temp *= PixToCm;
        if(xyz === 1) temp += earHeightCm;
        if(xyz === 2) temp *= zScale;
        return temp;
    }

 

    type JointKeys = keyof typeof jointTimeLine;
    const jointList: JointKeys[] = ["22", "16", "18", "20", "16", "14", "12", "11", "13", "15", "17", "19", "15", "21", "15", "13", "11", "23", "24", "12"];

    const _onGLContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x666666 );

        const camera = new THREE.PerspectiveCamera(
            75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000
        );
        if(isCameraTP){
            camera.position.x = -100;
            camera.position.y = 100;
            camera.position.z = cameraPosition;
        } else {
            
            camera.position.x = _normalizeJoint(jointTimeLine["7"][0][0], 0);
            camera.position.y = earHeightCm;
            camera.rotation.y = Math.PI / 2;
        }
            
        const createLineSegments = (segmentNum: number) => {
            const segments = new Float32Array(segmentNum * 3);
            for (let i = 0; i < segmentNum; ++i) {
                const joints = jointTimeLine[jointList[i]]
                for(let j=0; j<3; j++){
                    segments[3 * i + j] = _normalizeJoint(joints[0][j], j)
                }
            }
            return segments;
        }

        const updateLineSegments = (segments: Float32Array, time: number) => {
            const segmentNum = segments.length / 3;
            const preTime = Math.floor(time);
            const nextTime = Math.ceil(time);
            for (let i = 0; i < segmentNum; ++i) {
                const joints = jointTimeLine[jointList[i]]
                for(let j=0; j<3; j++){
                    segments[3 * i + j] = _normalizeJoint(joints[preTime][j], j) * (nextTime - time) + _normalizeJoint(joints[nextTime][j], j) * (time - preTime);
                }
            }
        };

        const createLineGeometryAttributes = (segments: Float32Array) => {
            const segmentNum = segments.length / 3;
            const vertexNum = 2 * segmentNum;
            const indexNum = 6 * (segmentNum - 1);
            const positions = new Float32Array(vertexNum * 3);
            const prevPositions = new Float32Array(vertexNum * 3);
            const nextPositions = new Float32Array(vertexNum * 3);
            const signs = new Float32Array(vertexNum);
            const indices = new Uint16Array(indexNum);

            const setPosAt = (pos: Float32Array, i: number, j: number) => {
                pos[6 * i] = pos[6 * i + 3] = segments[3 * j];
                pos[6 * i + 1] = pos[6 * i + 4] = segments[3 * j + 1];
                pos[6 * i + 2] = pos[6 * i + 5] = segments[3 * j + 2];
            };

            for (let i = 0; i < segmentNum; ++i) {
                setPosAt(positions, i, i);
                setPosAt(prevPositions, i, i !== 0 ? i - 1 : 0);
                setPosAt(nextPositions, i, i !== segmentNum - 1 ? i + 1 : segmentNum - 1);
                signs[2 * i] = 1.0;
                signs[2 * i + 1] = -1.0;
            }

            for (let i = 0; i < segmentNum - 1; ++i) {
                indices[6 * i] = 2 * i;
                indices[6 * i + 1] = indices[6 * i + 5] = 2 * i + 1;
                indices[6 * i + 2] = indices[6 * i + 4] = 2 * i + 2;
                indices[6 * i + 3] = 2 * i + 3;
            }

            return {
                positions,
                prevPositions,
                nextPositions,
                signs,
                indices,
            }
        };

        const updateLineGeometryAttributes = (segments: Float32Array, attributes: LineGeometryAttribute) => {
            const segmentNum = segments.length / 3;
            const vertexNum = 2 * segmentNum;
          
            const setPosAt = (pos: Float32Array, i: number, j: number) => {
                pos[6 * i] = pos[6 * i + 3] = segments[3 * j];
                pos[6 * i + 1] = pos[6 * i + 4] = segments[3 * j + 1];
                pos[6 * i + 2] = pos[6 * i + 5] = segments[3 * j + 2];
            };
          
            for (let i = 0; i < segmentNum; ++i) {
                setPosAt(attributes.positions, i, i);
                setPosAt(attributes.prevPositions, i, i !== 0 ? i - 1 : 0);
                setPosAt(attributes.nextPositions, i, i !== segmentNum - 1 ? i + 1 : segmentNum - 1);
            }
        }

        const updateGeometry = (time: number) => {
            updateLineSegments(segments, time);
            updateLineGeometryAttributes(segments, {
              positions: positionAttribute.array,
              prevPositions: prevPositionAttribute.array,
              nextPositions: nextPositionAttribute.array,
            });
            positionAttribute.needsUpdate = true;
            nextPositionAttribute.needsUpdate = true;
            prevPositionAttribute.needsUpdate = true;
        };
        
        const segmentNum = jointList.length;
        const segments = createLineSegments(segmentNum);
        const attributes = createLineGeometryAttributes(segments);

        const geometry = new THREE.BufferGeometry();
        const positionAttribute = new THREE.BufferAttribute(attributes.positions, 3);
        geometry.setAttribute('position', positionAttribute);
        const prevPositionAttribute = new THREE.BufferAttribute(attributes.prevPositions, 3);
        geometry.setAttribute('prevPosition', prevPositionAttribute);
        const nextPositionAttribute =  new THREE.BufferAttribute(attributes.nextPositions, 3);
        geometry.setAttribute('nextPosition', nextPositionAttribute);
        geometry.setAttribute('sign', new THREE.BufferAttribute(attributes.signs, 1));
        geometry.setIndex(new THREE.BufferAttribute(attributes.indices, 1));

        const vertexShader = 
        `attribute vec3 position;
        attribute vec3 prevPosition;
        attribute vec3 nextPosition;
        attribute float sign;

        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform vec3 cameraPosition;

        uniform float lineWidth;

        void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vec4 worldPrevPos = modelMatrix * vec4(prevPosition, 1.0);
        vec4 worldNextPos = modelMatrix * vec4(nextPosition, 1.0);
        vec3 prevPosDir = worldPos.xyz - worldPrevPos.xyz;
        prevPosDir = length(prevPosDir) > 1e-8 ? normalize(prevPosDir) : vec3(0.0); // to avoid division by zero
        vec3 nextPosDir = worldNextPos.xyz - worldPos.xyz;
        nextPosDir = length(nextPosDir) > 1e-8 ? normalize(nextPosDir) : vec3(0.0); // to avoid division by zero
        vec3 posDir = prevPosDir + nextPosDir;
        vec3 viewDir = cameraPosition - worldPos.xyz;
        vec3 linePlaneDir = cross(viewDir, posDir);
        linePlaneDir = length(linePlaneDir) > 1e-8 ? normalize(linePlaneDir) : vec3(0.0); // to avoid division by zero
        worldPos.xyz += lineWidth * 0.5 * sign * linePlaneDir;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
        `;

        const fragmentShader =
        `precision highp float;

        uniform vec3 color;

        void main() {
        gl_FragColor = vec4(color, 1.0);
        }
        `

        const material = new THREE.RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
                lineWidth: { value: 1 }
            },
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry( 2, 32, 16 ),
            new THREE.MeshBasicMaterial({color: 0xFF0000})
        );
        scene.add(sphere);
        sphere.position.x = 10000;
        sphere.position.y = 10000;

        let t = 0;
        const maxTime = jointTimeLine["0"].length;

        let date = new Date();
        let start = date.getMilliseconds();
    
        const animate = () => {
            requestAnimationFrame(animate);

            date = new Date();
            if(Math.abs(start - date.getMilliseconds()) > 10){
                start = date.getMilliseconds();
                if(t < maxTime - 1 - animationStepSize) t += animationStepSize;
                else t = 0;
            } else{
                return;
            }

            updateGeometry(t);

            if(arrowTimeLine[Math.floor(t)][0] === null){
                sphere.position.x = 10000;
                sphere.position.y = 10000;
            } else {
                sphere.position.x = _normalizeJoint(arrowTimeLine[Math.floor(t)][0], 0);
                sphere.position.y = _normalizeJoint(arrowTimeLine[Math.floor(t)][1], 1);
            }
    
            renderer.render(scene, camera);
            gl.endFrameEXP();
        }
        animate();

        const loader = new THREE.TextureLoader();
        const cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(20, 20, 2, 20),
            new THREE.MeshBasicMaterial({color: 0xFFFFCC})
        );
        cylinder.position.x = -boardDistanceCm;
        cylinder.position.y = boardHeightCm;
        cylinder.rotation.z = -Math.PI / 2;
        scene.add(cylinder);

    };

  
    return (
        <GLView
            style={style}
            onContextCreate={setGlContext}
        />
    )
}
