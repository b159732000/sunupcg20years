import * as THREE from 'three';
import {OrbitControls, MapControls} from './controls/OrbitControls.js';

let three = THREE;
three.OrbitControls = OrbitControls;
three.MapControls = MapControls;

window.THREE = THREE;
// require('./shaders/CopyShader')
// require('./Otherjs/UniformsUtils');
// require('./Loaders/FBXLoader');
// require('./postprocessing/EffectComposer');
// require('./postprocessing/ClearPass');
// require('./postprocessing/TexturePass');
// require('./postprocessing/ShaderPass');
// require('./postprocessing/MaskPass');
// require('./Otherjs/WebGL');
// require('./controls/OrbitControls.js');

// 以下兩個好像不能用
// require('./Loaders/GLTFLoader');
// require('./lights/AmbientLight');

// 使用default export，則引入時可自行定義引入後要叫啥名
export default three;