import React from 'react';
import './IntroTextPage.scss';

import THREE from '../../ThreeFiles/three.js';

// 參考animated-mesh-lines github
import {
    Color, Vector3, SphereBufferGeometry,
    Mesh, Raycaster, MeshBasicMaterial,
} from 'three';

import Engine from '../../animated-mesh-lines/utils/engine';
import Stars from '../../animated-mesh-lines/objects/Stars';
import AnimatedText3D from '../../animated-mesh-lines/objects/AnimatedText3D';
import LineGenerator from '../../animated-mesh-lines/objects/LineGenerator';

import getRandomFloat from '../../animated-mesh-lines/utils/getRandomFloat';
import getRandomItem from '../../animated-mesh-lines/utils/getRandomItem';

import HandleCameraOrbit from '../../animated-mesh-lines/decorators/HandleCameraOrbit';
import FullScreenInBackground from '../../animated-mesh-lines/decorators/FullScreenInBackground';
import PostProcessing from '../../animated-mesh-lines/decorators/PostProcessing';

@FullScreenInBackground
@PostProcessing
@HandleCameraOrbit({ x: 1, y: 1 }, 0.1)
class CustomEngine extends Engine {}

const engine = new CustomEngine();
engine.camera.position.z = 2;
engine.addBloomEffect({
  resolutionScale: 0.5,
  kernelSize: 4,
  distinction: 0.01,
}, 1);

let requestID;
let camera, scene, renderer, controls;

class IntroTextPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount = () => {
        // 為了讓chrome extention Three.js Inspector可以讀到場景
        window.scene = scene;
    }

    render() {
        return (
            <div className="IntroTextPage">

            </div>
        )
    }
}

export default IntroTextPage;