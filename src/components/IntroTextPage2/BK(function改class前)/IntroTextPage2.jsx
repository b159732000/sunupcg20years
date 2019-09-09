import React, { useState, useCallback, useEffect, useRef } from "react";
import "./IntroTextPage2.scss";
import { connect } from 'react-redux';
import {
  updateUsrOpenID,
  fromServerUsrName,
  updateFromServerUsrPlanetRadius,
  updateFromServerPlanetTone,
  updateFromServerUsrPlanetMountainHeight,
  updateFromServerUsrPlanetMountainDensity
} from '../../actions/actions.js';

import THREE from 'three';
import { apply, Canvas, useRender, useResource, useThree } from 'react-three-fiber';
import * as resources from '../../react-three-fiber/index.js';
apply(resources);

function Particle({ geometry, material }) {
  let ref = useRef()
  let t = Math.random() * 100
  let speed = 0.01 + Math.random() / 200
  let factor = 20 + Math.random() * 100
  let xFactor = -50 + Math.random() * 100
  let yFactor = -50 + Math.random() * 100
  let zFactor = -30 + Math.random() * 60
  useRender(() => {
    t += speed
    const s = Math.cos(t)
    ref.current.scale.set(s, s, s)
    ref.current.rotation.set(s * 5, s * 5, s * 5)
    ref.current.position.set(
      xFactor + Math.cos((t / 30) * factor) + (Math.sin(t * 1) * factor) / 10,
      yFactor + Math.sin((t / 20) * factor) + (Math.cos(t * 2) * factor) / 10,
      zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 20
    )
  })
  return <mesh ref={ref} material={material} geometry={geometry} />
}

function Swarm({ mouse }) {
  const light = useRef()
  const [geometryRef, geometry] = useResource()
  const [materialRef, material] = useResource()
  useRender(() => light.current.position.set(mouse.current[0] / 20, -mouse.current[1] / 20, 0))
  return (
    <>
      <pointLight ref={light} distance={50} intensity={1.5} color="white" />
      <spotLight intensity={0.5} position={[10, 10, 40]} penumbra={1} />
      <mesh>
        <planeGeometry attach="geometry" args={[10000, 10000]} />
        <meshPhongMaterial attach="material" color="#575757" depthTest={false} />
      </mesh>
      <dodecahedronBufferGeometry ref={geometryRef} args={[0.8, 0]} />
      <meshPhysicalMaterial ref={materialRef} />
      {geometry && new Array(2000).fill().map((_, index) => <Particle key={index} material={material} geometry={geometry} />)}
    </>
  )
}

function Effect() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useRender(({ gl }) => void ((gl.autoClear = true), composer.current.render()), true)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <waterPass attachArray="passes" factor={2} />
      <afterimagePass attachArray="passes" factor={0.7} />
      <shaderPass attachArray="passes" args={[resources.FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} renderToScreen />
    </effectComposer>
  )
}

// 將接收到的state(包含在store內)放為本頁的state
function mapStateToProps(state) {
  // 將所有state傳入 <- 不能這樣傳，會不起作用
  // return state

  // 只傳入state中指定的值
  return {
    usrOpenID: state.myFirstReducers.usrOpenID,
    fromServerUsrName: state.myFirstReducers.fromServerUsrName,
    fromServerUsrPlanetRadius: state.myFirstReducers.fromServerUsrPlanetRadius,
    fromServerUsrPlanetTone: state.myFirstReducers.fromServerUsrPlanetTone,
    fromServerUsrPlanetMountainHeight: state.myFirstReducers.fromServerUsrPlanetMountainHeight,
    fromServerUsrPlanetMountainDensity: state.myFirstReducers.fromServerUsrPlanetMountainDensity,
  }
}

export default function IntroTextPage2() {
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])

  // 目前顯是第幾行以前的文字
  const [currentShowingSentence, setCurrentShowingSentence] = useState(0);

  // 每次渲染後執行，就像componentDidMount and componentDidUpdate
  useEffect(() => {
    // 定義目前顯是第幾行字
    const timer = setInterval(() => {
      setCurrentShowingSentence(currentShowingSentence + 1);
      console.log(currentShowingSentence);
    }, 1600);

    console.log(fromServerUsrName);

    // 在下次執行useEffects前
    return () => {
      // 清除計時器(定義目前顯是第幾行字)
      clearInterval(timer);
    }
  })

  // useEffect後面帶參數，代表此參數改變時執行此useEffect
  // useEffect(() => {
  //   console.log('only fired when `count` changed');
  // }, [count]);

  return (
    <div className="IntroTextPage2" onMouseMove={onMouseMove}>
      {/* <Canvas camera={{ fov: 75, position: [0, 0, 50] }}>
        <Swarm mouse={mouse} />
        <Effect />
      </Canvas> */}

      <div className="bg">
        <img src={require('../../images/BG.jpg')} alt=""/>
      </div>
      
      <div className="sentenceContainer">
        <div className={(currentShowingSentence>=1)?("sentence show"):("sentence")}>Hi国禾</div>
        <div className={(currentShowingSentence>=2)?("sentence show"):("sentence")}>今天是你在骄阳的第365天</div>
        <div className={(currentShowingSentence>=3)?("sentence show"):("sentence")}>也是骄阳的20岁生日</div>
        <div className={(currentShowingSentence>=4)?("sentence show"):("sentence")}>为了感谢一直以来努力付出的你</div>
        <div className={(currentShowingSentence>=5)?("sentence show"):("sentence")}>同时跟你一起分享骄阳成年的喜悦</div>
        <div className={(currentShowingSentence>=6)?("sentence show"):("sentence")}>我们决定送你一个小小的礼物做为纪念</div>
        <div className={(currentShowingSentence>=7)?("sentence show"):("sentence")}>不过这个礼物我们必须一起完成</div>
        <div className={(currentShowingSentence>=8)?("sentence show"):("sentence")}>话不多说，我们就直接开始吧</div>
      </div>
    </div>
  );
}