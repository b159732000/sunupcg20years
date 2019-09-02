import React from 'react';
import './FinalPage.scss';
import THREE from '../../ThreeFiles/three.js';
import {TweenMax, TimelineMax, Linear, Power2} from 'gsap';
// import TWEEN from '@tweenjs/tween.js';

// const TWEEN = require('@tweenjs/tween.js');

// THREE文字
const createGeometry = require('three-bmfont-text');
const loadFont = require('load-bmfont');

// THREE知識

// !!!相機!!!
// 正投影 THREE.OrthographicCamera
// 透視投影 THREE.PerspectiveCamera (符合一般視角) - PerspectiveCamera( fov, aspect(寬高比), near, far ) 
// 更新相機視角的方法 方法一camera.position.z = 5000 方法二camera.position.set(1000, 1000, 1000);
// 
// 實作相機 - 要唯一确定一个相机的位置与方向，position、up、lookAt三个属性是缺一不可的。 
// {//简单的正交投影相机，正对着视口的中心，视口大小与Canvas大小相同。
// camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
// //设置相机的位置
// camera.position.x = 0;
// camera.position.y = 0;
// camera.position.z = 200;
// //设置相机的上方向
// camera.up.x = 0;
// camera.up.y = 1;
// camera.up.z = 0;
// //设置相机聚焦的位置(其实就是确定一个方向)
// camera.lookAt({
//     x: 0,
//     y: 0,
//     z: 0})}
// 
// !!!幾何!!!
// 球體
// SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
// 
// 無厚度平面 (地面)
// PlaneBufferGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
// 
// 圓柱
// CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
// 
// !!!材質!!!
// 基本材质 MeshBasicMaterial - 地面材質: 無光照亮暗、無陰影，始終保持材質原始顏色
// 前面也说过，使用基本材质的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。故这里我们是可以看到地板的颜色的。
// var meshMaterial = new THREE.({color:0xeeefff});
// 
// 霧面表面材質 MeshLambertMaterial - 可接受光照，但無无光泽表面、镜面高光的材质
// 这种材质可以用来创建暗淡的并不光亮的表面。
// 这可以很好地模拟一些表面（如未经处理的木材或石头），但不能用镜面高光（如上漆木材）模拟光泽表面。
// 该材质非常易用，而且会对场景中的光源产生反应。
// var cubeMaterial = new THREE.({color: 0x00ffff});//实例化一个蓝色的材质
// 
// 金屬鏡面材質 MeshPhongMaterial - 可接受光照，且有光澤度，適用金屬、鏡面
// 
// 可以反射的材質之一 = NEW THREE.MeshPhysicalMaterial({metalness: 0~1})
// 
// 法向量材質 MeshNormalMaterial - 受光照的部分呈現出物體原本顏色，無陰影
// 可以将材质的颜色设置为其法向量的方向，有时候对于调试很有帮助
// 材质的颜色与照相机与该物体的角度相关
// 
// 材質紋理貼圖
// 使用图像作为材质，就需要导入图像作为纹理贴图，并添加到相应的材质中
// 
// !!!光源!!!
// 在Three.js中，能形成阴影的光源只有THREE.DirectionalLight与THREE.SpotLight。而相对地，能表现阴影效果的材质只有THREE.LambertMaterial与THREE.PhongMaterial。
// 环境光(AmbientLight) - AmbientLight( color : Integer, intensity強度預設1 : Float )
// 点光源(PointLight) - 有陰影
// 聚光灯(SpotLight) - 有陰影
// 平行光(DirectionalLight) - 有陰影 - (顏色, 強度0~1, 光照距離預設0, 強度衰減量預設1)
// 半球光(HemisphereLight)
// 
// !!!要有陰影的前提!!!
// 1. 对光源启用阴影
// 2. 对被照射的物体启用阴影的产生
// 3. 对投射的物体启用接受阴影
// // 对cube启用阴影的产生
// cube.castShadow = true; 
// // 对floor接受阴影
// floor.receiveShadow = true;
// // 光源设置
// light.castShadow = true;
// // 光源的阴影设置
// light.shadow.mapSize.width = 512;  // default
// light.shadow.mapSize.height = 512; // default
// light.shadow.camera.near = 0.5;       // default
// light.shadow.camera.far = 500      // default
// shadow.mapSize.width：阴影映射宽度
// shadow.mapSize.height：阴影映射高度
// shadow.camera.near:投影近点，距离光源多近能产生阴影
// shadow.camera.far：投影远点，到哪一点为止不再产生阴影
// shadow.camera.fov：投影视场，聚光的角度大小
// 
// renderer.shadowMapEnabled = true;
// renderer.shadowMapSoft = false;
// 
// renderer.shadowCameraNear = 3;
// renderer.shadowCameraFar = camera.far;
// renderer.shadowCameraFov = 50;
// 
// renderer.shadowMapBias = 0.0039;
// renderer.shadowMapDarkness = 0.5;
// renderer.shadowMapWidth = 1024;
// renderer.shadowMapHeight = 1024;
// 
// !!!RENDER!!!
// 場景有變化後(物體移動等等也算)，要再調用一次
// renderer.render(scene, camera);

let requestID;
let camera, scene, renderer, controls;
let base, geometryBase, baseMat;    //地球藍海的OBJECT, GEOMETRY, MATERIAL
let terran, terranGeom, material;   //翠綠山的OBJECT, GEOMETRY, MATERIAL

// 載入畫面
let loadingPercentage = 0;

class FinalPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Debug用
            isDebugMode: false,              //是否在debug模式
            orbitControlsIsOpen: true,       //是否開啟OrbitControls

            // 我自己的設定
            myPlanetAutoRotate: false,       //主要星球是否自轉
            antialias: false,                //是否開啟反鋸齒
            sceneBackground: 0x3a3a3a,       //場景背景色(0x3a3a3a深灰、0xffffff白色)
            directionalShadow: true,         //直射光陰影

            // 預設的星球資訊
            planetRadius: 400,               //星球半徑
            greenMountainDensity: 10,
            greenMountainHeight: 100,

            // 使用者調整後的星球資訊
            usrPlanetRadius: 400,            //星球半徑

            // 系統紀錄的狀態
            usrCustomizePlanetControlsIsOpen: false,    // 使用者自訂參數層是否開啟
            currentCameraView: 'viewMyPlanet',          // 目前的相機視角 (看自己的星球viewMyPlanet, 看全部的星球viewAllPlanet)
            currentLoadingPercentage: 0,                       //目前載入的%數
            isLoadingDone: false,                     //載入完成(載入完成則載入頁隱藏)
            loadingPageShowing: true,                  //是否顯示載入畫面
        }
    }

    componentDidMount = () => {
        this.init();
        this.animate();

        // 為了讓chrome extention Three.js Inspector可以讀到場景
        window.scene = scene;

        // 更新THREE長寬及比例
        window.addEventListener('resize', this.windowOnResize);

        // 火箭人
        this.rocketManAnimation();

        // 更新載入頁面載入進度
        this.updateCurrentLoadingPercentage();
    }

    componentWillUnmount = () => {
        cancelAnimationFrame(requestID);
        window.removeEventListener('resize', this.windowOnResize);
        this.threeCanvasDOMElement.removeChild(renderer.domElement);
    }

    windowOnResize = () => {
        // 更新THREE長寬及比例
        if (this.threeCanvasDOMElement) {
            let threeWidth, threeHeight, threeAspectRatio;
            threeWidth = this.threeCanvasDOMElement.clientWidth;
            threeHeight = this.threeCanvasDOMElement.clientHeight;
            threeAspectRatio = threeWidth / threeHeight;
            renderer.setSize(threeWidth, threeHeight);
            camera.aspect = threeAspectRatio;
            camera.updateProjectionMatrix();
        }
    }

    // THREE初始化
    init = () => {
        // - Render定義渲染器
        renderer = new THREE.WebGLRenderer({
            alpna: true,
            antialias: this.state.antialias,
        });
        renderer.setSize(this.threeCanvasDOMElement.clientWidth, this.threeCanvasDOMElement.clientHeight);
        this.threeCanvasDOMElement.appendChild(renderer.domElement);
        // 啟用渲染器陰影
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        // 設定背景色
        // renderer.setClearColor(0xe8e8e8, 1);
        // renderer.setClearColor(0x000000, 0); //default

        // - 創建相機
        camera = new THREE.PerspectiveCamera(50, this.threeCanvasDOMElement.clientWidth / this.threeCanvasDOMElement.clientHeight, 1, 10000);
        // 相機位置和朝向
        camera.position.z = 2000;
        camera.position.y = 700;
        // camera.position.set(2104.940, 1144.108, 1624.405);

        // 相机注视点(会被animate中的注视点覆盖)
        camera.lookAt(new THREE.Vector3(0, this.state.planetRadius, 0));    //注視主星球球心()
        // camera.lookAt(new THREE.Vector3(0, 0, 0));    //注視原点

        // 創建場景
        scene = new THREE.Scene();
        scene.name = 'MainScene';
        scene.background = new THREE.Color(this.state.sceneBackground);

        // - 創建基本球體 (地球藍藍的海)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        geometryBase = new THREE.SphereGeometry(this.state.planetRadius, 50, 56);
        // geometryBase.vertices.forEach((v) => {
        //     v[['x', 'y', 'z'][~~(Math.random() * 5)]] += Math.random() * 10;
        // })
        baseMat = new THREE.MeshLambertMaterial({
            color: 0x76acda,
            // shading: THREE.FlatShading,
        });
        base = new THREE.Mesh(geometryBase, baseMat);
        base.name = 'base';
        geometryBase.name = 'geometryBase';
        baseMat.name = 'baseMat';
        base.position.y = this.state.planetRadius;
        // 接收陰影
        base.receiveShadow = true;
        // 可創造陰影
        base.castShadow = true;
        scene.add(base);

        // - 創建terran球體 (翠綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        terranGeom = new THREE.SphereGeometry(this.state.planetRadius - 2, 30, 30);
        terranGeom.vertices.forEach((g) => {
            // g[['x', 'y', 'z'][~~(Math.random() * 10密度數字越小越密)]] += Math.random() * 40山的高度數字越大越高;
            g[['x', 'y', 'z'][~~(Math.random() * this.state.greenMountainDensity)]] += Math.random() * this.state.greenMountainHeight;
        })
        material = new THREE.MeshLambertMaterial({
            color: 0xb8b658,
            // shading: THREE.FlatShading
        })
        terran = new THREE.Mesh(terranGeom, material);
        terran.name = 'terran';
        // 物體接收陰影
        terran.receiveShadow = true;
        // 物體產生陰影
        terran.castShadow = true;
        base.add(terran);

        // - 創建highTerran球體 (黃綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let highTerran, terranHighGeom, highTerranMat;
        terranHighGeom = new THREE.SphereGeometry(this.state.planetRadius - 10, 30, 30);
        terranHighGeom.vertices.forEach((g) => {
            g[['x', 'y', 'z'][~~(Math.random() * 10)]] += Math.random() * 40;
        })
        highTerranMat = new THREE.MeshLambertMaterial({
            color: 0xe3c97f,
        });
        highTerran = new THREE.Mesh(terranHighGeom, highTerranMat);
        highTerran.name = 'highTerran';
        // 物體產生陰影
        highTerran.castShadow = true;
        // 物體接收陰影
        highTerran.receiveShadow = true;
        base.add(highTerran);

        // 創建背景球
        this.addBgPlanetFirst();
        this.addBgPlanetSecond();
        this.addBgPlanetThird();
        this.addBgPlanetForth();

        // 渲染文字到Three中
        this.renderThreeText();

        // - 創建場景的地面
        // 開發模式中地面面積小，正式版地面面積大
        let ground, groundGeo, groundMat;
        if (this.state.isDebugMode) {
            groundGeo = new THREE.CylinderGeometry(500, 500, 1, 20);
        } else {
            groundGeo = new THREE.CylinderGeometry(50000, 50000, 1, 40);
        }
        groundMat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });
        ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -1;
        // 地面接收陰影
        ground.receiveShadow = true;
        // 創造陰影
        // ground.castShadow = true;
        ground.name = 'ground';
        scene.add(ground);

        // - 創建大陸

        // - 創建雲層

        // - 創建環境光AmbientLight
        let fillLight;
        fillLight = new THREE.AmbientLight(0xffffff, 0.5);
        fillLight.name = 'fillLight';
        scene.add(fillLight);

        // - 創建直射光DirectionalLight
        let light;
        light = new THREE.DirectionalLight(0xffffff, 0.7);
        // light = new THREE.PointLight(0xffffff, 0.7);
        light.position.set(500, 1000, 500);
        light.target.position.set(0, 0, 0);
        // light.position.set(1, 1, 1);
        if (this.state.directionalShadow) {
            // 光線產生陰影 (產生陰影的區塊會是一塊面對攝影機的長方體)
            light.castShadow = true;            //這道光線要有陰影
            // 定義陰影細節
            light.shadow.camera.near = 20;      //離相機最近多少距離開始產生陰影
            light.shadow.camera.far = 10000;       //離相機最遠多少距離還是要有陰影
            light.shadow.camera.top = 10000;       //離相機往上多少距離以內要有陰影    (用spotLight時無效)
            light.shadow.camera.right = 10000;     //離相機往右多少距離以內要有陰影    (用spotLight時無效)
            light.shadow.camera.bottom = -10000;    //離相機往下多少距離以內要有陰影    (用spotLight時無效)
            light.shadow.camera.left = -10000;      //離相機往左多少距離以內要有陰影    (用spotLight時無效)
            light.shadow.mapSize.height = 2048;  //決定用多少像素生成陰影
            light.shadow.mapSize.width = 2048;   //決定用多少像素生成陰影
        }
        light.name = 'light';
        scene.add(light);

        // Three.js 提供很多种辅助函数(helper)，它有助于调试
        // 创建坐标轴（RGB颜色 分别代表 XYZ轴）
        let axesHelper = new THREE.AxesHelper(6);       //舊版叫做axisHelper
        axesHelper.name = 'axesHelper';
        // 将立方体网格加入到场景中
        scene.add(axesHelper)

        // 影子相機助手
        let helper;
        helper = new THREE.CameraHelper(light.shadow.camera);
        helper.name = 'cameraHelper';
        scene.add(helper);

        // 加入相機控制
        if (this.state.orbitControlsIsOpen) {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.target = new THREE.Vector3(0, this.state.planetRadius, 0);       //控制焦点始終正對原點
            controls.enableDamping = false;      //是否啟用阻尼(慣性)
            // controls.dampingFactor = 0.25;      //阻尼大小
            // //是否可以缩放
            // controls.enableZoom = true;
            // //是否自动旋转
            // controls.autoRotate = false;
            // //设置相机距离原点的最远距离
            // controls.minDistance = 50;
            // //设置相机距离原点的最远距离
            // controls.maxDistance = 200;
            // //是否开启右键拖拽
            // controls.enablePan = true;
            controls.update();
        }

        // 正式渲染到螢幕上
        renderer.render(scene, camera);
    }

    // THREE每影格更新
    animate = () => {
        requestID = requestAnimationFrame(this.animate);

        // required if controls.enableDamping or controls.autoRotate are set to true
        if (this.state.orbitControlsIsOpen) {
            controls.target = new THREE.Vector3(0, this.state.planetRadius, 0);       //控制焦点始終正對主星球球心
            // controls.target = new THREE.Vector3(0, 0, 0);       //控制焦点始終正對原點
            controls.update();
        }

        // Tween起作用必須設定
        // TWEEN.update();

        // 地球自轉 (繞著y軸轉)
        if (this.state.myPlanetAutoRotate) {
            base.rotation.y += 0.003;
        }

        renderer.render(scene, camera);
    }

    // 創建背景球一
    addBgPlanetFirst = () => {
        // - 創建基本球體 (地球藍藍的海)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgFirstGeometryBase = new THREE.SphereGeometry(this.state.planetRadius, 50, 56);
        // bgFirstGeometryBase.vertices.forEach((v) => {
        //     v[['x', 'y', 'z'][~~(Math.random() * 5)]] += Math.random() * 10;
        // })
        let bgFirstBaseMat = new THREE.MeshLambertMaterial({
            color: 0x76acda,
            // shading: THREE.FlatShading,
        });
        let bgFirstBase = new THREE.Mesh(bgFirstGeometryBase, bgFirstBaseMat);
        bgFirstBase.name = 'bgFirstBase';
        bgFirstGeometryBase.name = 'bgFirstGeometryBase';
        bgFirstBaseMat.name = 'bgFirstBaseMat';
        bgFirstBase.position.y = this.state.planetRadius;
        // 接收陰影
        bgFirstBase.receiveShadow = true;
        // 可創造陰影
        bgFirstBase.castShadow = true;
        bgFirstBase.position.z = -3000;
        bgFirstBase.position.x = -2000;
        scene.add(bgFirstBase);

        // - 創建terran球體 (翠綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgFirstTerranGeom = new THREE.SphereGeometry(this.state.planetRadius - 2, 30, 30);
        bgFirstTerranGeom.vertices.forEach((g) => {
            // g[['x', 'y', 'z'][~~(Math.random() * 10密度數字越小越密)]] += Math.random() * 40山的高度數字越大越高;
            g[['x', 'y', 'z'][~~(Math.random() * this.state.greenMountainDensity)]] += Math.random() * this.state.greenMountainHeight;
        })
        material = new THREE.MeshLambertMaterial({
            color: 0xb8b658,
            // shading: THREE.FlatShading
        })
        let bgFirstTerran = new THREE.Mesh(bgFirstTerranGeom, material);
        bgFirstTerran.name = 'bgFirstTerran';
        // 物體接收陰影
        bgFirstTerran.receiveShadow = true;
        // 物體產生陰影
        bgFirstTerran.castShadow = true;
        bgFirstBase.add(bgFirstTerran);

        // - 創建highTerran球體 (黃綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let highTerran, terranHighGeom, highTerranMat;
        terranHighGeom = new THREE.SphereGeometry(this.state.planetRadius - 10, 30, 30);
        terranHighGeom.vertices.forEach((g) => {
            g[['x', 'y', 'z'][~~(Math.random() * 10)]] += Math.random() * 40;
        })
        highTerranMat = new THREE.MeshLambertMaterial({
            color: 0xe3c97f,
        });
        highTerran = new THREE.Mesh(terranHighGeom, highTerranMat);
        highTerran.name = 'highTerran';
        // 物體產生陰影
        highTerran.castShadow = true;
        // 物體接收陰影
        highTerran.receiveShadow = true;
        bgFirstBase.add(highTerran);
    }

    // 創建背景球二
    addBgPlanetSecond = () => {
        // - 創建基本球體 (地球藍藍的海)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgSecondGeometryBase = new THREE.SphereGeometry(this.state.planetRadius, 50, 56);
        // bgSecondGeometryBase.vertices.forEach((v) => {
        //     v[['x', 'y', 'z'][~~(Math.random() * 5)]] += Math.random() * 10;
        // })
        let bgSecondBaseMat = new THREE.MeshLambertMaterial({
            color: 0x76acda,
            // shading: THREE.FlatShading,
        });
        let bgSecondBase = new THREE.Mesh(bgSecondGeometryBase, bgSecondBaseMat);
        bgSecondBase.name = 'bgSecondBase';
        bgSecondGeometryBase.name = 'bgSecondGeometryBase';
        bgSecondBaseMat.name = 'bgSecondBaseMat';
        bgSecondBase.position.y = this.state.planetRadius;
        // 接收陰影
        bgSecondBase.receiveShadow = true;
        // 可創造陰影
        bgSecondBase.castShadow = true;
        bgSecondBase.position.z = -3700;
        bgSecondBase.position.x = -700;
        scene.add(bgSecondBase);

        // - 創建terran球體 (翠綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgSecondTerranGeom = new THREE.SphereGeometry(this.state.planetRadius - 2, 30, 30);
        bgSecondTerranGeom.vertices.forEach((g) => {
            // g[['x', 'y', 'z'][~~(Math.random() * 10密度數字越小越密)]] += Math.random() * 40山的高度數字越大越高;
            g[['x', 'y', 'z'][~~(Math.random() * this.state.greenMountainDensity)]] += Math.random() * this.state.greenMountainHeight;
        })
        material = new THREE.MeshLambertMaterial({
            color: 0xb8b658,
            // shading: THREE.FlatShading
        })
        let bgSecondTerran = new THREE.Mesh(bgSecondTerranGeom, material);
        bgSecondTerran.name = 'bgSecondTerran';
        // 物體接收陰影
        bgSecondTerran.receiveShadow = true;
        // 物體產生陰影
        bgSecondTerran.castShadow = true;
        bgSecondBase.add(bgSecondTerran);

        // - 創建highTerran球體 (黃綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let highTerran, terranHighGeom, highTerranMat;
        terranHighGeom = new THREE.SphereGeometry(this.state.planetRadius - 10, 30, 30);
        terranHighGeom.vertices.forEach((g) => {
            g[['x', 'y', 'z'][~~(Math.random() * 10)]] += Math.random() * 40;
        })
        highTerranMat = new THREE.MeshLambertMaterial({
            color: 0xe3c97f,
        });
        highTerran = new THREE.Mesh(terranHighGeom, highTerranMat);
        highTerran.name = 'highTerran';
        // 物體產生陰影
        highTerran.castShadow = true;
        // 物體接收陰影
        highTerran.receiveShadow = true;
        bgSecondBase.add(highTerran);
    }

    // 創建背景球三
    addBgPlanetThird = () => {
        // - 創建基本球體 (地球藍藍的海)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgThirdGeometryBase = new THREE.SphereGeometry(this.state.planetRadius, 50, 56);
        // bgThirdGeometryBase.vertices.forEach((v) => {
        //     v[['x', 'y', 'z'][~~(Math.random() * 5)]] += Math.random() * 10;
        // })
        let bgThirdBaseMat = new THREE.MeshLambertMaterial({
            color: 0x76acda,
            // shading: THREE.FlatShading,
        });
        let bgThirdBase = new THREE.Mesh(bgThirdGeometryBase, bgThirdBaseMat);
        bgThirdBase.name = 'bgThirdBase';
        bgThirdGeometryBase.name = 'bgThirdGeometryBase';
        bgThirdBaseMat.name = 'bgThirdBaseMat';
        bgThirdBase.position.y = this.state.planetRadius;
        // 接收陰影
        bgThirdBase.receiveShadow = true;
        // 可創造陰影
        bgThirdBase.castShadow = true;
        bgThirdBase.position.z = -3700;
        bgThirdBase.position.x = 700;
        scene.add(bgThirdBase);

        // - 創建terran球體 (翠綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgThirdTerranGeom = new THREE.SphereGeometry(this.state.planetRadius - 2, 30, 30);
        bgThirdTerranGeom.vertices.forEach((g) => {
            // g[['x', 'y', 'z'][~~(Math.random() * 10密度數字越小越密)]] += Math.random() * 40山的高度數字越大越高;
            g[['x', 'y', 'z'][~~(Math.random() * this.state.greenMountainDensity)]] += Math.random() * this.state.greenMountainHeight;
        })
        material = new THREE.MeshLambertMaterial({
            color: 0xb8b658,
            // shading: THREE.FlatShading
        })
        let bgThirdTerran = new THREE.Mesh(bgThirdTerranGeom, material);
        bgThirdTerran.name = 'bgThirdTerran';
        // 物體接收陰影
        bgThirdTerran.receiveShadow = true;
        // 物體產生陰影
        bgThirdTerran.castShadow = true;
        bgThirdBase.add(bgThirdTerran);

        // - 創建highTerran球體 (黃綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let highTerran, terranHighGeom, highTerranMat;
        terranHighGeom = new THREE.SphereGeometry(this.state.planetRadius - 10, 30, 30);
        terranHighGeom.vertices.forEach((g) => {
            g[['x', 'y', 'z'][~~(Math.random() * 10)]] += Math.random() * 40;
        })
        highTerranMat = new THREE.MeshLambertMaterial({
            color: 0xe3c97f,
        });
        highTerran = new THREE.Mesh(terranHighGeom, highTerranMat);
        highTerran.name = 'highTerran';
        // 物體產生陰影
        highTerran.castShadow = true;
        // 物體接收陰影
        highTerran.receiveShadow = true;
        bgThirdBase.add(highTerran);
    }

    // 創建背景球四
    addBgPlanetForth = () => {
        // - 創建基本球體 (地球藍藍的海)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgForthGeometryBase = new THREE.SphereGeometry(this.state.planetRadius, 50, 56);
        // bgForthGeometryBase.vertices.forEach((v) => {
        //     v[['x', 'y', 'z'][~~(Math.random() * 5)]] += Math.random() * 10;
        // })
        let bgForthBaseMat = new THREE.MeshLambertMaterial({
            color: 0x76acda,
            // shading: THREE.FlatShading,
        });
        let bgForthBase = new THREE.Mesh(bgForthGeometryBase, bgForthBaseMat);
        bgForthBase.name = 'bgForthBase';
        bgForthGeometryBase.name = 'bgForthGeometryBase';
        bgForthBaseMat.name = 'bgForthBaseMat';
        bgForthBase.position.y = this.state.planetRadius;
        // 接收陰影
        bgForthBase.receiveShadow = true;
        // 可創造陰影
        bgForthBase.castShadow = true;
        bgForthBase.position.z = -3000;
        bgForthBase.position.x = 2000;
        scene.add(bgForthBase);

        // - 創建terran球體 (翠綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let bgForthTerranGeom = new THREE.SphereGeometry(this.state.planetRadius - 2, 30, 30);
        bgForthTerranGeom.vertices.forEach((g) => {
            // g[['x', 'y', 'z'][~~(Math.random() * 10密度數字越小越密)]] += Math.random() * 40山的高度數字越大越高;
            g[['x', 'y', 'z'][~~(Math.random() * this.state.greenMountainDensity)]] += Math.random() * this.state.greenMountainHeight;
        })
        material = new THREE.MeshLambertMaterial({
            color: 0xb8b658,
            // shading: THREE.FlatShading
        })
        let bgForthTerran = new THREE.Mesh(bgForthTerranGeom, material);
        bgForthTerran.name = 'bgForthTerran';
        // 物體接收陰影
        bgForthTerran.receiveShadow = true;
        // 物體產生陰影
        bgForthTerran.castShadow = true;
        bgForthBase.add(bgForthTerran);

        // - 創建highTerran球體 (黃綠色山)
        // 創建球體幾何
        // 對幾何的頂點做出高低位移變化
        // 創建球體材質
        // 合併材質和幾何到OBJECT(Mesh)
        // 添加名字給這個物件、幾何、材質
        // 啟用陰影 (尚未做)
        // 添加到場景中
        let highTerran, terranHighGeom, highTerranMat;
        terranHighGeom = new THREE.SphereGeometry(this.state.planetRadius - 10, 30, 30);
        terranHighGeom.vertices.forEach((g) => {
            g[['x', 'y', 'z'][~~(Math.random() * 10)]] += Math.random() * 40;
        })
        highTerranMat = new THREE.MeshLambertMaterial({
            color: 0xe3c97f,
        });
        highTerran = new THREE.Mesh(terranHighGeom, highTerranMat);
        highTerran.name = 'highTerran';
        // 物體產生陰影
        highTerran.castShadow = true;
        // 物體接收陰影
        highTerran.receiveShadow = true;
        bgForthBase.add(highTerran);
    }

    // 使用者移動地球size調整桿時觸發
    handlePlanetSizeOnInput = () => {
        // 讀取前一刻的滑桿數值是啥
        let lastValue;
        if (this.planetValueHistory) {
            lastValue = this.planetValueHistory;
        } else {
            lastValue = this.state.planetRadius;
        }

        // 更改地球(base)大小
        // 從DOM讀取最新滑桿數字
        let usrPlanetSizeInput = this.planetSizeInputDOMElement.value;
        // 計算星球的縮放比率 (用滑桿最新數字與預設地球大小比較)
        let usrBaseScale = usrPlanetSizeInput / this.state.planetRadius;

        // 更改星球縮放
        base.scale.set(usrBaseScale, usrBaseScale, usrBaseScale);
        // 更改地球位置
        base.translateY(usrPlanetSizeInput - lastValue);

        // 將滑桿數值放入滑桿數值紀錄中
        this.planetValueHistory = usrPlanetSizeInput;
    }

    // 使用者移動翠綠山密度調整桿觸發
    handleGreenMountainDensityBarScroll = () => {
        // this.GreenMountainGeoDensityBarDOMElement
        if (terran) {
            // 釋放舊的綠高山幾何記憶體
            terran.geometry.dispose();

            // 創造新的綠高山幾何
            terranGeom = new THREE.SphereGeometry(this.state.planetRadius - 2, 30, 30);
            terranGeom.vertices.forEach((g) => {
                // g[['x', 'y', 'z'][~~(Math.random() * 10密度數字越小越密)]] += Math.random() * 40山的高度數字越大越高;
                g[['x', 'y', 'z'][~~(Math.random() * this.GreenMountainGeoDensityBarDOMElement.value)]] += Math.random() * this.GreenMountainGeoHeightBarDOMElement.value;
            })

            terran.geometry = terranGeom;
        }

        console.log(this.GreenMountainGeoDensityBarDOMElement.value);
    }

    // 使用者移動翠綠山高度調整桿觸發
    handleGreenMountainHeightBarScroll = () => {
        // this.GreenMountainGeoDensityBarDOMElement
        if (terran) {
            // 釋放舊的綠高山幾何記憶體
            terran.geometry.dispose();

            // 創造新的綠高山幾何
            terranGeom = new THREE.SphereGeometry(this.state.planetRadius - 2, 30, 30);
            terranGeom.vertices.forEach((g) => {
                // g[['x', 'y', 'z'][~~(Math.random() * 10密度數字越小越密)]] += Math.random() * 40山的高度數字越大越高;
                g[['x', 'y', 'z'][~~(Math.random() * this.GreenMountainGeoDensityBarDOMElement.value)]] += Math.random() * this.GreenMountainGeoHeightBarDOMElement.value;
            })

            terran.geometry = terranGeom;
        }

        console.log(this.GreenMountainGeoHeightBarDOMElement.value);
    }

    // 保持原樣按鈕按下觸發
    handleUsrCancelButtonOnClick = () => {
        // 關閉使用者自訂星球介面
        this.setState({
            usrCustomizePlanetControlsIsOpen: false
        })
    }

    // 確定新樣式按鈕按下觸發
    handleUsrConfirmButtonOnClick = () => {
        // 關閉使用者自訂星球介面
        this.setState({
            usrCustomizePlanetControlsIsOpen: false
        })
    }

    // 切換相機位置 (看自己的星球viewMyPlanet, 看所有的星球viewAllPlanet)
    changeCameraPositionTo = (changeToView) => {
        let newCameraPositionVector;

        switch (changeToView) {
            case 'viewMyPlanet':
                // 注視自己的星球
                newCameraPositionVector = { x: 0, y: 700, z: 2000 };
                this.setState({
                    currentCameraView: 'viewMyPlanet'
                })
                break;
            case 'viewAllPlanet':
                // 注視全部的星球
                newCameraPositionVector = { x: 0, y: 2200, z: 3500 };
                this.setState({
                    currentCameraView: 'viewAllPlanet'
                })
                break;
            default:
                if (this.state.currentCameraView === 'viewMyPlanet') {
                    // 注視全部的星球
                    newCameraPositionVector = { x: 0, y: 2200, z: 3500 };
                    this.setState({
                        currentCameraView: 'viewAllPlanet'
                    })
                } else if (this.state.currentCameraView === 'viewAllPlanet') {
                    // 注視自己的星球
                    newCameraPositionVector = { x: 0, y: 700, z: 2000 };
                    this.setState({
                        currentCameraView: 'viewMyPlanet'
                    })
                }
                break;
        }

        // 設定相機到新的位置
        // let tween = new TWEEN.Tween(camera.position)
        //     .to(newCameraPositionVector, 1000)
        //     .easing(TWEEN.Easing.Cubic.Out)
        //     .start();
    }

    // 打開關閉使用者自訂參數層 ('open', 'close', 無參數則切為反向狀態)
    changeUsrCustomizePlanetControlsOpenCloseTo = (status) => {
        switch (status) {
            case 'open':
                this.setState({
                    usrCustomizePlanetControlsIsOpen: true
                })
                break;
            case 'close':
                this.setState({
                    usrCustomizePlanetControlsIsOpen: false
                })
                break;
            default:
                this.setState({
                    usrCustomizePlanetControlsIsOpen: !this.state.usrCustomizePlanetControlsIsOpen,
                })
                break;
        }
    }

    // 渲染文字到Three中
    renderThreeText = () => {
        loadFont(require('../../fonts/DejaVu-sdf.fnt'), function (err, font) {
            let geometry = createGeometry({
                width: 300,
                align: 'center',
                font: font
            });

            geometry.update('Lorem ipsum\nDolor sit amet.');

            console.log(geometry.layout.height);
            console.log(geometry.layout.descender);

            let textureLoader = new THREE.TextureLoader();
            textureLoader.load(require('../../fonts/DejaVu-sdf.png'), function (texture) {
                let material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    color: 0xff0000
                });

                let mesh = new THREE.Mesh(geometry, material);

                // mesh.position.y = 700;
                mesh.name = 'bmFont';
                mesh.castShadow = true;
                scene.add(mesh);
            })
        })
    }

    // 火箭人动画
    rocketManAnimation = () => {
        
var jetBubbles = document.getElementsByClassName('jetBubble');
var rocketManSVG = document.querySelector('.rocketManSVG');
var shakeGroup = document.querySelector('.shakeGroup');
var star = document.querySelector('.star');
var satellite = document.querySelector('.satellite');
var astronaut = document.querySelector('.astronaut');
var starContainer = document.querySelector('.starContainer');
var badgeLink = document.querySelector('#badgeLink');

TweenMax.to(astronaut, 0.05, {
  y:'+=4',
  repeat:-1, 
  yoyo:true
})
var mainTimeline = new TimelineMax({repeat:-1});
var mainSpeedLinesTimeline = new TimelineMax({repeat:-1, paused:false});

mainTimeline.timeScale(6).seek(100);

function createJets(){
  TweenMax.set(jetBubbles, {
    attr:{
      r:'-=5'
    }
  })
 //jet bubbles
  for(var i = 0; i < jetBubbles.length; i++){    
    var jb = jetBubbles[i];    
    var tl = new TimelineMax({repeat:-1});
    tl.to(jb, 1 , {
      attr:{
        r:'+=15'
      },
      ease:Linear.easeNone
    })
    .to(jb, 1 , {
      attr:{
        r:'-=15'
      },
      ease:Linear.easeNone
    })
    
    mainTimeline.add(tl, i/4)
  }
  //speed lines
	for(var i = 0; i < 7; i++){
    var sl = document.querySelector('#speedLine' + i);

    var stl = new TimelineMax({repeat:-1, repeatDelay:Math.random()});
    stl.set(sl, {
      drawSVG:false
    })
    .to(sl, 0.05, {
      drawSVG:'0% 30%',
      ease:Linear.easeNone
    })
    .to(sl, 0.2, {
      drawSVG:'70% 100%',
      ease:Linear.easeNone
    })  
    .to(sl, 0.05, {
      drawSVG:'100% 100%',
      ease:Linear.easeNone
    })
     .set(sl, {
      drawSVG:'-1% -1%'
    });

    mainSpeedLinesTimeline.add(stl, i/23);
}  
  //stars
	for(var i = 0; i < 7; i++){
    
    var sc = star.cloneNode(true);
    starContainer.appendChild(sc);
    var calc = (i+1)/2;
   
    TweenMax.fromTo(sc, calc, {
      x:Math.random()*600,
      y:-30,
      scale:3 - calc
    }, {
      y:(Math.random() * 100) + 600,
      repeat:-1,
      repeatDelay:1,
      ease:Linear.easeNone
    })
  }
  
  rocketManSVG.removeChild(star);
}


var satTimeline = new TimelineMax({repeat:-1});
satTimeline.to(satellite, 46, {
  rotation:360,
  transformOrigin:'50% 50%',
  ease:Linear.easeNone
})

TweenMax.staggerTo('.pulse', 0.8, {
  alpha:0,
  repeat:-1,
  ease:Power2.easeInOut,
  yoyo:false
}, 0.1);

TweenMax.staggerTo('.satellitePulse', 0.8, {
  alpha:0,
  repeat:-1,
  ease:Power2.easeInOut,
  yoyo:false
}, 0.1)

createJets();
    }

    // 更新目前載入進度
    updateCurrentLoadingPercentage() {
        var LoadingPageTimer = setInterval(() => {
            loadingPercentage += 1;
            // console.log(loadingPercentage);

            // 更新到this.state.currentLoadingPercentage
            this.setState({
                currentLoadingPercentage: loadingPercentage,
            })

            // 更改進度條長度
            // if (this.loadingBarDOMElement !== null) {
            //     this.loadingBarDOMElement.style.width = loadingPercentage + '%';
            // }

            // 如果百分比>=100, 隱藏此畫面, 清除此計數器
            if (loadingPercentage >= 100) {
                // 隱藏此畫面
                this.setState({
                    // loadingPageShowing: false,
                    loadingText: "载入完成!",
                    isLoadingDone: true,
                })
                setTimeout(this.setState({
                    loadingPageShowing: false
                }), 500)
                // 清除此計數器
                clearInterval(LoadingPageTimer);
            }
        }, 13);
    }

    render() {
        return (
            <div className="FinalPageContainer">

                {/* 载入画面 */}
                <div className={(this.state.loadingPageShowing)?("loadingPage"):("loadingPage hide")}>
                    
                <svg className="rocketManSVG" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 600 600">
  <defs>
    <path id="rocketClip" d="M300,465.7L300,465.7c-13.8,0-25-11.3-25-25V249.4c0-13.7,11.3-25,25-25h0c13.7,0,25,11.2,25,25v191.3
  C325,454.5,313.8,465.7,300,465.7z" />
    <clipPath id="rainbowClip">
      <use xlinkHref="#rocketClip" overflow="visible" />
    </clipPath>
</defs>
  <polygon className="star" opacity="0.5" fill="#ECB447" points="1.2,0 1.6,0.8 2.4,0.9 1.8,1.5 1.9,2.3 1.2,1.9 0.5,2.3 0.6,1.5 0,0.9 0.8,0.8 " />
  <g className="starContainer" />
  <g className="satellite">
    <g className="satellitePulses" stroke="#2d2d2d">
      <path className="satellitePulse" fill="none" strokeWidth="1.5814" strokeLinejoin="round" strokeMiterlimit={10} d="M156.3,131.8
    c-2.8,2.8-7.2,2.8-10,0" />
      <path className="satellitePulse" fill="none" strokeWidth="1.5814" strokeLinejoin="round" strokeMiterlimit={10} d="M158.6,134
    c-4,4-10.5,4-14.4,0" />
      <path className="satellitePulse" fill="none" strokeWidth="1.5814" strokeLinejoin="round" strokeMiterlimit={10} d="M160.8,136.3
    c-5.2,5.2-13.7,5.2-18.9,0" />
    </g>
    <path fill="#2d2d2d" d="M106.7,91.3h-8.2v-8.2h8.2V91.3z M116.8,83.1h-8.2v8.2h8.2V83.1z M126.8,83.1h-8.2v8.2h8.2V83.1z
 M136.9,83.1h-8.2v8.2h8.2V83.1z M106.7,93.2h-8.2v8.2h8.2V93.2z M116.8,93.2h-8.2v8.2h8.2V93.2z M126.8,93.2h-8.2v8.2h8.2V93.2z
 M136.9,93.2h-8.2v8.2h8.2V93.2z M106.7,103.3h-8.2v8.2h8.2V103.3z M116.8,103.3h-8.2v8.2h8.2V103.3z M126.8,103.3h-8.2v8.2h8.2
V103.3z M136.9,103.3h-8.2v8.2h8.2V103.3z M173.7,83.1h-8.2v8.2h8.2V83.1z M183.8,83.1h-8.2v8.2h8.2V83.1z M193.8,83.1h-8.2v8.2h8.2
V83.1z M203.9,83.1h-8.2v8.2h8.2V83.1z M173.7,93.2h-8.2v8.2h8.2V93.2z M183.8,93.2h-8.2v8.2h8.2V93.2z M193.8,93.2h-8.2v8.2h8.2
V93.2z M203.9,93.2h-8.2v8.2h8.2V93.2z M173.7,103.3h-8.2v8.2h8.2V103.3z M183.8,103.3h-8.2v8.2h8.2V103.3z M193.8,103.3h-8.2v8.2
h8.2V103.3z M203.9,103.3h-8.2v8.2h8.2V103.3z M161.8,113.1V81c0-2.6-2.1-4.7-4.7-4.7h-11.7c-2.6,0-4.7,2.1-4.7,4.7v32.1
c0,2.6,2.1,4.7,4.7,4.7h11.7C159.7,117.8,161.8,115.7,161.8,113.1z M165.6,96.3h-28.7v2.1h28.7V96.3z M152.3,117.8h-2.2v12.1h2.2
V117.8z" />
  </g>
  <g className="speedLines" stroke="#3e3e3e" strokeWidth={2} strokeLinejoin="round">
    <line id="speedLine0" fill="none" strokeMiterlimit={10} x1="252.5" y1={324} x2="252.5" y2={566} />
    <line id="speedLine1" fill="none" strokeMiterlimit={10} x1="299.5" y1={500} x2="299.5" y2={557} />
    <line id="speedLine2" fill="none" strokeMiterlimit={10} x1="347.5" y1={324} x2="347.5" y2={529} />
    <line id="speedLine3" fill="none" strokeMiterlimit={10} x1="74.5" y1={45} x2="74.5" y2={500} />
    <line id="speedLine4" fill="none" strokeMiterlimit={10} x1="544.5" y1={29} x2="544.5" y2={574} />
    <line id="speedLine5" fill="none" strokeMiterlimit={10} x1="415.5" y1={8} x2="415.5" y2={440} />
    <line id="speedLine6" fill="none" strokeMiterlimit={10} x1="165.5" y1={142} x2="165.5" y2={574} />
  </g>
  <rect x={275} y="263.3" clipPath="url(#rainbowClip)" fill="#CC583F" width={10} height="212.7" />
  <rect x={285} y="263.3" clipPath="url(#rainbowClip)" fill="#ECB447" width={10} height="212.7" />
  <rect x={295} y="263.3" clipPath="url(#rainbowClip)" fill="#75C095" width={10} height="212.7" />
  <rect x={305} y="263.3" clipPath="url(#rainbowClip)" fill="#5991AA" width={10} height="212.7" />
  <rect x={315} y="263.3" clipPath="url(#rainbowClip)" fill="#7D6AAD" width={10} height="212.7" />
  <g className="astronaut">
    <g className="pulseSVG" opacity="0.2" stroke="#ededed">
      <path className="pulse" fill="none" strokeWidth={3} strokeLinejoin="round" strokeMiterlimit={10} d="M289.9,188.7
    c5.2-5.2,13.7-5.2,18.9,0" />
      <path className="pulse" fill="none" strokeWidth={3} strokeLinejoin="round" strokeMiterlimit={10} d="M285.6,184.5
    c7.6-7.6,19.8-7.6,27.4,0" />
      <path className="pulse" fill="none" strokeWidth={3} strokeLinejoin="round" strokeMiterlimit={10} d="M281.4,180.3
    c9.9-9.9,26-9.9,35.9,0" />
    </g>
    <g>
      <g>
        <g>
          <path fill="#CCCCCC" d="M265,320.7c0,0,0.1,0,0.1,0h0.2c0,0,0,0,0,0l0.2,0c0,0,0,0,0,0v-16.1h-21.4c0.9,3.7,2.8,6.9,5.6,9.8
          C254,318.6,259.1,320.7,265,320.7 M334.9,320.7c0,0,0.1,0,0.1,0c5.9,0,11-2.1,15.2-6.3c2.9-2.9,4.7-6.1,5.6-9.8h-21.4v16.1
          l0.2,0c0,0,0,0,0,0h0h0H334.9 M271.8,224.4c-4.3,0.9-8.1,2.9-11.4,6.2c-4.5,4.5-6.7,9.9-6.7,16.2v13.6c3.3-2.1,7.1-3.2,11.3-3.2
          h0c0.9,0,1.7,0,2.6,0.1c-1.5-3.9-2.3-8.2-2.3-12.7C265.3,237,267.5,230.3,271.8,224.4 M346.3,260.4v-13.6
          c0-6.3-2.2-11.7-6.7-16.2c-3-3-6.5-5.1-10.4-6l-0.2,0.8c3.9,5.6,5.8,12,5.8,19.2c0,4.2-0.7,8.1-2,11.8l0.1,0.8
          c0.7-0.1,1.4-0.1,2.2-0.1h0C339.2,257.2,342.9,258.3,346.3,260.4z" />
          <path fill="#FFFFFF" d="M299.9,210.1c0,0-0.1,0-0.1,0c-9.5,0-17.6,3.4-24.3,10.1c-1.3,1.3-2.5,2.7-3.6,4.2
          c-4.3,5.9-6.5,12.6-6.5,20.3c0,4.6,0.8,8.8,2.3,12.7c0.2,0.6,0.5,1.2,0.8,1.8c1.7,3.6,4,6.9,7.1,9.9c3.3,3.3,6.8,5.7,10.7,7.4
          c0.1,0,0.2,0.1,0.2,0.1c0.8,0.3,1.6,0.7,2.5,0.9c3.4,1.1,7.1,1.7,11,1.7c9.5,0,17.7-3.4,24.4-10.1c3.6-3.6,6.2-7.5,7.9-11.8
          c0.1-0.3,0.2-0.6,0.3-0.9c1.3-3.6,1.9-7.6,1.9-11.7c0-7.2-1.9-13.5-5.7-19.1l-0.2-0.2c0,0,0-0.1-0.1-0.1l0,0l-0.1-0.1l-0.1-0.1
          c0,0,0,0,0,0l-0.1-0.1c0-0.1-0.1-0.1-0.1-0.2c0,0,0-0.1-0.1-0.1c-1.1-1.5-2.3-2.9-3.7-4.3C317.5,213.5,309.4,210.1,299.9,210.1
           M350.1,263.5c-1.2-1.2-2.5-2.3-3.9-3.1c-3.3-2.1-7.1-3.2-11.3-3.2h0c-0.7,0-1.5,0-2.2,0.1c-0.1,0-0.2,0-0.3,0c0,0-0.1,0-0.1,0
          l-0.3-0.1c-1.7,4.3-4.3,8.3-7.9,11.8c-6.7,6.7-14.9,10.1-24.4,10.1c-3.9,0-7.6-0.6-11-1.7c-0.8-0.3-1.7-0.6-2.5-0.9
          c-0.1,0-0.2-0.1-0.2-0.1c-3.9-1.7-7.5-4.2-10.7-7.4c-3-3-5.4-6.3-7.1-9.9c-0.3-0.6-0.5-1.2-0.8-1.8c-0.8-0.1-1.7-0.1-2.6-0.1h0
          c-4.2,0-8,1.1-11.3,3.2c-1.4,0.9-2.7,1.9-3.9,3.1c-4.2,4.2-6.3,9.2-6.3,15.2v20.6c0,1.9,0.2,3.7,0.6,5.4h21.4v-22.6v22.6v16.1
          V338c0.6,3.3,2.2,6.2,4.7,8.7c3.3,3.4,7.3,5,12,5c4.7,0,8.9-1.8,12.7-5.3c2.8-2.6,4.5-5.5,5-8.7v-15.9h-12.7H300h13h-13v15.9
          c0.5,3.2,2.2,6.1,5,8.7c3.8,3.5,8,5.3,12.7,5.3c4.7,0,8.7-1.7,12-5c2.5-2.5,4-5.4,4.7-8.7v-17.3v-16.1v-22.6v22.6h21.4
          c0.4-1.7,0.6-3.5,0.6-5.4v-20.6C356.4,272.8,354.3,267.7,350.1,263.5 M300,311.1v-30.1V311.1z" />
          <path fill="#2D2D2D" d="M299.7,195.5c-1.1,0-2,0.4-2.7,1.1c-0.7,0.7-1.1,1.6-1.1,2.7c0,1.1,0.4,2,1.1,2.7
          c0.7,0.7,1.6,1.1,2.7,1.1c1.1,0,2-0.4,2.7-1.1c0.7-0.7,1.1-1.6,1.1-2.7c0-1.1-0.4-2-1.1-2.7
          C301.7,195.8,300.8,195.5,299.7,195.5z" />
        </g>
      </g>
      <path fill="none" stroke="#2D2D2D" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" d="M355.8,304.6
  c0.4-1.7,0.6-3.5,0.6-5.4v-20.6c0-5.9-2.1-11-6.3-15.2c-1.2-1.2-2.5-2.3-3.9-3.1c-3.3-2.1-7.1-3.2-11.3-3.2h0
  c-0.7,0-1.5,0-2.2,0.1c-0.1,0-0.2,0-0.3,0c0,0-0.1,0-0.1,0 M332.1,257.3c-1.7,4.3-4.3,8.3-7.9,11.8c-6.7,6.7-14.9,10.1-24.4,10.1
  c-3.9,0-7.6-0.6-11-1.7c-0.8-0.3-1.7-0.6-2.5-0.9c-0.1,0-0.2-0.1-0.2-0.1c-3.9-1.7-7.5-4.2-10.7-7.4c-3-3-5.4-6.3-7.1-9.9
  c-0.3-0.6-0.5-1.2-0.8-1.8c-0.8-0.1-1.7-0.1-2.6-0.1h0c-4.2,0-8,1.1-11.3,3.2c-1.4,0.9-2.7,1.9-3.9,3.1c-4.2,4.2-6.3,9.2-6.3,15.2
  v20.6c0,1.9,0.2,3.7,0.6,5.4h21.4v-22.6 M346.3,260.4v-13.6c0-6.3-2.2-11.7-6.7-16.2c-3-3-6.5-5.1-10.4-6 M328.9,225.4
  c3.9,5.6,5.8,12,5.8,19.2c0,4.2-0.7,8.1-2,11.8 M299.7,203.1c-1.1,0-2-0.4-2.7-1.1c-0.7-0.7-1.1-1.6-1.1-2.7c0-1.1,0.4-2,1.1-2.7
  c0.7-0.7,1.6-1.1,2.7-1.1c1.1,0,2,0.4,2.7,1.1c0.7,0.7,1.1,1.6,1.1,2.7c0,1.1-0.4,2-1.1,2.7C301.7,202.7,300.8,203.1,299.7,203.1
  v7.1c0,0,0.1,0,0.1,0c9.5,0,17.7,3.4,24.4,10.1c1.4,1.4,2.6,2.8,3.7,4.3c0,0,0,0.1,0.1,0.1c0,0.1,0.1,0.1,0.1,0.2l0.1,0.1
  c0,0,0,0,0,0c0,0,0.1,0.1,0.1,0.1c0,0,0,0,0,0c0,0,0,0,0,0l0.1,0.1l0,0c0,0,0,0,0.1,0.1l0.2,0.2c3.8,5.6,5.7,12,5.7,19.1
  c0,4.2-0.6,8.1-1.9,11.7c-0.1,0.3-0.2,0.6-0.3,0.9 M329.2,224.6L329.2,224.6C329.1,224.6,329.1,224.6,329.2,224.6
  C329.1,224.6,329.1,224.6,329.2,224.6c-0.3-0.1-0.6-0.1-0.8-0.2c0,0-0.1,0-0.2,0c0,0,0,0.1,0.1,0.1c0,0,0,0.1,0,0.1
  c0.1,0.1,0.2,0.3,0.3,0.4c0,0,0,0,0,0l0,0c0.1,0.1,0.2,0.3,0.3,0.4c0,0,0,0,0,0 M271.8,224.4c1.1-1.4,2.3-2.8,3.6-4.2
  c6.7-6.7,14.8-10.1,24.3-10.1 M253.7,260.4v-13.6c0-6.3,2.2-11.7,6.7-16.2c3.3-3.3,7.1-5.4,11.4-6.2c-4.3,5.9-6.5,12.6-6.5,20.3
  c0,4.6,0.8,8.8,2.3,12.7 M332.7,256.5C332.7,256.5,332.7,256.5,332.7,256.5L332.7,256.5c0,0,0,0.1,0,0.1c0,0,0,0,0,0.1l-0.2,0.5
  c0,0.1-0.1,0.1-0.1,0.2 M334.7,320.7h0.2c0,0,0.1,0,0.1,0c5.9,0,11-2.1,15.2-6.3c2.9-2.9,4.7-6.1,5.6-9.8h-21.4v16.1l0.2,0
   M334.6,320.7L334.6,320.7 M287.3,321.8H300h13 M300,337.8c0.5,3.2,2.2,6.1,5,8.7c3.8,3.5,8,5.3,12.7,5.3c4.7,0,8.7-1.7,12-5
  c2.5-2.5,4-5.4,4.7-8.7v-17.3 M265.6,320.7V338c0.6,3.3,2.2,6.2,4.7,8.7c3.3,3.4,7.3,5,12,5c4.7,0,8.9-1.8,12.7-5.3
  c2.8-2.6,4.5-5.5,5-8.7v-15.9 M265.6,320.7C265.6,320.7,265.6,320.7,265.6,320.7l-0.3,0c0,0,0,0,0,0h-0.2c0,0-0.1,0-0.1,0
  c-5.9,0-11-2.1-15.2-6.3c-2.9-2.9-4.7-6.1-5.6-9.8 M265.6,304.6v16.1 M334.4,282.1v22.6 M300,311.1v-30.1" />
    </g>
    <g>
      <path fill="#7592A0" d="M324.5,261.6c6.8-4.3,10.2-9.5,10.2-15.5c0-5.1-2.4-9.6-7.2-13.4H272c-4.8,3.8-7.3,8.3-7.3,13.4
  c0,6.1,3.4,11.2,10.2,15.5c6.8,4.3,15.1,6.4,24.7,6.4C309.4,268,317.6,265.9,324.5,261.6z" />
    </g>
    <path fill="none" stroke="#2D2D2D" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" d="M334.7,246.1
    c0,6.1-3.4,11.2-10.2,15.5c-6.8,4.3-15.1,6.4-24.7,6.4c-9.7,0-17.9-2.1-24.7-6.4c-6.8-4.3-10.2-9.5-10.2-15.5
    c0-5.1,2.4-9.6,7.3-13.4h55.5C332.3,236.5,334.7,241,334.7,246.1z" />
    <path fill="none" stroke="#E6E6E6" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" d="
    M323.5,240.6c2.4,3.5,2.4,7.8,0,12.7 M275.8,240.6c-2.4,3.5-2.4,7.8,0,12.7" />
    <g className="jetBubbles">
      <g id="greyJets" fill="#2d2d2d">
        <circle className="jetBubble" cx={289} cy={489} r={23} />
        <circle className="jetBubble" cx={270} cy={470} r={20} />
        <circle className="jetBubble" cx={319} cy={483} r={21} />
      </g>
      <g id="colorJets" strokeWidth={0} stroke="#3d3d3d">
        <circle className="jetBubble" fill="#ECB447" cx={312} cy={449} r={8} />
        <circle className="jetBubble" fill="#7D6AAD" cx={320} cy={480} r={10} />
        <circle className="jetBubble" fill="#7D6AAD" cx={290} cy={460} r={10} />
        <circle className="jetBubble" fill="#ECB447" cx={329} cy={453} r={11} />
        <circle className="jetBubble" fill="#CC583F" cx={286} cy={463} r={7} />
        <circle className="jetBubble" fill="#ECB447" cx={289} cy={469} r={24} />
        <circle className="jetBubble" fill="#7D6AAD" cx={260} cy={450} r={20} />
        <circle className="jetBubble" fill="#5991AA" cx={319} cy={463} r={10} />
        <circle className="jetBubble" fill="#CC583F" cx={290} cy={463} r={18} />
        <circle className="jetBubble" fill="#75C095" cx={312} cy={443} r={21} />
        <circle className="jetBubble" fill="#5991AA" cx={275} cy="443.4" r={12} />
      </g>
      <use xlinkHref="#badge" x={0} y={0} />
    </g>
  </g>
  <g>
    <g>
      <use xlinkHref="#badge" x={-20} y={293} opacity="0.1" />
    </g>
  </g>
</svg>
                
                <div className="text">{this.state.currentLoadingPercentage}</div>

                </div>

                {/* THREE渲染區 */}
                <div className={(this.state.usrCustomizePlanetControlsIsOpen) ? ("threeCanvas usrControlIsOpen") : ('threeCanvas')} ref={self => this.threeCanvasDOMElement = self}></div>

                {/* 目前宇宙中發現了76顆星球，我們還在持續探索中 */}
                <div className="threejsText">目前为止，骄阳宇宙发现了76颗星球，太空船还在持续搜索中...</div>

                {/* 使用者自訂參數層 */}
                <div className={(this.state.usrCustomizePlanetControlsIsOpen) ? ("usrCustomizePlanetControls") : ("usrCustomizePlanetControls hide")}>
                    {/* 星球大小 */}
                    <div className="planetSize">
                        <input type='range' min={this.state.planetRadius * 0.5} max={this.state.planetRadius * 1.5} defaultValue={this.state.planetRadius} step="1" ref={(self) => this.planetSizeInputDOMElement = self} onInput={() => this.handlePlanetSizeOnInput()}></input>
                    </div>
                    {/* 確認取消鈕 */}
                    <div className={(this.state.usrCustomizePlanetControlsIsOpen) ? ("usrConfirmButtonContainer") : ('usrConfirmButtonContainer usrControlIsHide')}>
                        <button className="button" onClick={() => this.handleUsrCancelButtonOnClick()}>保持原样</button>
                        <button className="button confirm" onClick={() => this.handleUsrConfirmButtonOnClick()}>确定新样式</button>
                    </div>
                </div>

                {/* debug用的按鈕 */}
                <div className="debug">
                    {/* 切換相機位置 */}
                    <div className="changeCameraPosition">
                        <button onClick={() => this.changeCameraPositionTo()}>切換相機位置</button>
                    </div>
                    {/* 即時更新翠綠山密度、高度 */}
                    <div className="updateGreenMountainGeo">
                        <div className="text">綠山密度、高度</div>
                        <input type='range' className="updateGreenMountainGeoDensity" min='11' max='40' defaultValue={this.state.greenMountainDensity} ref={self => this.GreenMountainGeoDensityBarDOMElement = self} onInput={() => this.handleGreenMountainDensityBarScroll()} />
                        <input type='range' className="updateGreenMountainGeoHeight" min='0' max='100' defaultValue={this.state.greenMountainHeight} ref={self => this.GreenMountainGeoHeightBarDOMElement = self} onInput={() => this.handleGreenMountainHeightBarScroll()} />
                    </div>
                    {/* 打開關閉使用者參數層 */}
                    <div className="openCloseUsrCustomizePlanetControlsOpenClose">
                        <button onClick={() => this.changeUsrCustomizePlanetControlsOpenCloseTo()}>打開關閉使用者自訂參數層</button>
                    </div>
                </div>

            </div>
        )
    }
}

export default FinalPage;
