import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import React, { useState, useEffect } from 'react';
import * as THREE from "three";
import ExpoTHREE from 'expo-three';
import { Renderer } from 'expo-three';
import { ResponderProps } from 'react-native-svg';

import {View, TouchableOpacity } from "react-native";

import { Text } from "../components/Themed"
import { numberTypeAnnotation } from '@babel/types';

type LineGeometryAttribute = {
    positions: Float32Array,
    prevPositions: Float32Array,
    nextPositions: Float32Array,
    signs: Float32Array,
    indices: Uint16Array,
}

type ModelLineProps = {
    jointTimeLine: any,
    rotationX: number,
    rotationY: number,
    rotationZ: number,
    cameraPosition: number,
    animationStepSize: number,
    style: any,
}

export default function ModelLine(props: ModelLineProps) {
    const { jointTimeLine, rotationX, rotationY, rotationZ, cameraPosition, animationStepSize, style } = props;
    const [ glContext, setGlContext] = useState<ExpoWebGLRenderingContext | null>(null);
    useEffect(() => {if(glContext) _onGLContextCreate(glContext)}, [glContext, rotationX, rotationY, rotationZ, cameraPosition, animationStepSize, style]);

    const centerXYZ = new Array(3);
    for(let i=0; i<3; i++){
        centerXYZ[i] = (jointTimeLine["11"][0][i] + jointTimeLine["12"][0][i]) / 2;
    }

    const _normalizeJoint = (pos: number, xyz: number) => {
        let temp = pos - centerXYZ[xyz];
        if(xyz == 1) return -temp;
        if(xyz == 2) return -200 * temp;
        return temp;
    }

    type JointKeys = keyof typeof jointTimeLine;
    const jointList: JointKeys[] = ["22", "16", "18", "20", "16", "14", "12", "11", "13", "15", "17", "19", "15", "21", "15", "13", "11", "23", "24", "12"];
    
    const _onGLContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x888888 );

        const camera = new THREE.PerspectiveCamera(
            75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000
        );
        
        camera.position.z = cameraPosition;
            
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
                lineWidth: { value: 50 }
            },
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let t = 0;
        const maxTime = jointTimeLine["0"].length;
        
        mesh.rotation.x = rotationX;
        mesh.rotation.y = rotationY;
        mesh.rotation.z = rotationZ;

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
    
            renderer.render(scene, camera);
            gl.endFrameEXP();
        }
        animate();
    };
  
    return (
        <View>
        <GLView
            style={ style }
            onContextCreate={setGlContext}
        />
        </View>
    )
}
