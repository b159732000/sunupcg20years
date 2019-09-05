import React from 'react';
import './FinalPage.scss';
import THREE from '../../ThreeFiles/three.js';
import { TweenMax, TimelineMax, Linear, Power2, TimelineLite, Back, Power3 } from 'gsap';
import TWEEN from '@tweenjs/tween.js';
import { SphereBufferGeometry } from 'three';
import SwipeListener from 'swipe-listener';
import TypeWriter from 'react-typewriter';
var glslify = require('glslify')

// 定義用來偵測手勢滑動方向的變數
let swipeDetector, thisPageSwipeListener;

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
// 球體
// SphereBufferGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
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
let highTerran, terranHighGeom, highTerranMat;   //黃綠高山的OBJECT, GEOMETRY, MATERIAL
let ground, groundGeo, groundMat;   //地面

class FinalPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Debug用
            isDebugMode: false,                 //是否在debug模式
            orbitControlsIsOpen: false,          //是否開啟OrbitControls
            addSwipeListener: true,            //是否開啟最終頁面上下滑偵測

            // 我自己的設定
            myPlanetAutoRotate: false,          //主要星球是否自轉
            antialias: false,                   //是否開啟反鋸齒
            sceneBackground: 0x000000,            //場景背景色(0x3a3a3a深灰、0xffffff白色)
            directionalShadow: true,            //直射光陰影
            addBaseGround: false,               //是否添加場景基準地板
            afterMountSecondsOpenUsrCustomizeControls: 0,       //進入頁面候n秒開啟使用者控制介面

            // 預設的星球資訊
            planetRadius: 400,                  //星球半徑
            greenMountainDensityMax: 40,// 山密度上限
            greenMountainDensityMin: 11,// 山密度下限
            greenMountainDensity: 30,           //高山密度, 数字越小越密
            greenMountainHeightMax: 100,// 山高度上限
            greenMountainHeightMin: 0,// 山高度下限
            greenMountainHeight: 70,            //高山高度
            planetUseToneIndex: 4,              //採用第幾組星球配色(0~9)
            // -星球海面顏色
            seaColor: [
                0x1C5D99,//雪白
                0xB67B61,//沙漠
                0xF44CAC,//粉红
                0x543F2F,//抹茶
                0x76acda,//地球
                0x10632F,//绿
                0x0D324D,//紫色
                0xD13434,//岩漿
                0x6B7691,//银色
                0x272330,//黑金
            ],
            // -星球可更改高山的顏色(原翠綠色高山)
            terranColor: [
                0xFFFFFF,//雪白
                0xD19F84,//沙漠
                0xF494CC,//粉红
                0xAAEDB8,//抹茶
                0xb8b658,//地球
                0x3FBF5F,//绿
                0xB88AE2,//紫色
                0x661224,//岩漿
                0x9EA3B0,//银色
                0xCC7B08,//黑金
            ],
            // -星球不可更改高山的顏色(原黃綠色高山)
            highTerranColor: [
                0x9DD9D2,//雪白
                0xFED5B8,//沙漠
                0xF0AAC8,//粉红
                0xFAEFE586BA90,//抹茶
                0xe3c97f,//地球
                0x61FF7E,//绿
                0x8A2BE2,//紫色
                0x87182E,//岩漿
                0xD5D5D5,//银色
                0xFCBE1F,//黑金
            ],
            // -星球色調的形容詞候選區
            planetToneDiscriptionBucket: [
                '冰天雪地覆盖的白色星球',
                '满布黄沙的沙漠地带',
                '全部是粉红的粉红世界',
                '抹茶口味的巧克力星球',
                '跟地球一样的配色',
                '绿光罩顶的荧光绿星球',
                '满布紫水晶的宝石星球',
                '热坏了的熔岩星球',
                '洒满月光的银色世界',
                '低调奢华的黑色星球',
            ],
            planetSizeShowingText: '不大不小刚刚好',    //目前星球大小形容词
            planetMountainDensityShowingText: '剛好就好，我喜歡有高山有平原',//目前星球上的山丘数量形容词
            planetMountainHeightShowingText: '剛好就好，我喜歡有高山有平原',//目前星球上的山丘数量形容词

            // 使用者調整後的星球資訊
            usrPlanetRadius: 400,               //星球半徑
            usrPlanetTone: 400,                 //星球色調
            usrPlanetMountainHeight: 400,       //山高
            usrPlanetMountainDensity: 400,      //山密度

            // 系統紀錄的狀態
            usrCustomizePlanetControlsIsOpen: false,     //使用者自訂參數層是否開啟
            currentCameraView: 'viewMyPlanet',          //目前的相機視角 (看自己的星球viewMyPlanet, 看全部的星球viewAllPlanet)
            currentLoadingPercentage: 0,                //目前載入的%數
            isLoadingDone: false,                       //載入完成(載入完成則載入頁隱藏)
            loadingPageShowing: true,                   //是否顯示載入畫面
            currentInIntro: true,                       //目前是在intro的狀態下嗎
            currentAdjustingPlanetProperty: 'size',     //目前調整的參數是啥(星球大小'size', 星球主色調'tone', 山密度'density', 山高'height', 無'')
            planetToneDiscription: ['跟地球一樣的配色'],  //星球色調的形容詞
            isInFinalPage: false,                       //目前是否在最終顯示頁面
            showFinalFirstSentence: false,               // 显示结尾画面第一句话
            showFinalUsrSceneSwipeTopTip: false,         // 显示结尾个人画面往上滑提示
            showFinalSecondSentence: false,              // 显示结尾画面第二句话
            showFinalAlSceneSwipeBottomTip: false,       // 显示结尾个人画面往下滑提示
        }
    }

    componentDidMount = () => {
        this.init();
        this.animate();

        // 為了讓chrome extention Three.js Inspector可以讀到場景
        window.scene = scene;

        // 更新THREE長寬及比例
        window.addEventListener('resize', this.windowOnResize);

        //進入頁面後五秒，開啟使用者調整視窗
        setTimeout(() => {
            this.setState({
                usrCustomizePlanetControlsIsOpen: true
            })
        }, this.state.afterMountSecondsOpenUsrCustomizeControls * 1000);

        // 掛載偵測手勢滑動的動作Listener
        if (this.state.addSwipeListener) {
            this.addTouchMoveListener();
        }
        setTimeout(() => {
            // 随移动杆决定星球大小形容词
            this.updatePlanetSizeDescription();
            // 随移动杆决定星球山密度形容词
            this.updatePlanetMountainDensityDescription();
            // 随移动杆决定星球山高度形容词
            this.updatePlanetMountainHeightDescription();
        }, 500)

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
        // intro畫面的相機參數
        // camera = new THREE.PerspectiveCamera(50, this.threeCanvasDOMElement.clientWidth / this.threeCanvasDOMElement.clientHeight, 1, 1000);
        // 地球畫面的相機參數
        camera = new THREE.PerspectiveCamera(50, this.threeCanvasDOMElement.clientWidth / this.threeCanvasDOMElement.clientHeight, 1, 3000);
        // 相機位置和朝向
        // camera.position.set(0, 0, 10);
        camera.position.z = 2000;
        camera.position.y = 700;
        // camera.position.set(2104.940, 1144.108, 1624.405);

        // 相机注视点(会被animate中的注视点覆盖)
        // camera.lookAt(new THREE.Vector3(0, 0, 0));    //注視原点
        camera.lookAt(new THREE.Vector3(0, this.state.planetRadius, 0));    //注視主星球球心()

        // 創建場景
        scene = new THREE.Scene();
        scene.name = 'MainScene';
        scene.background = new THREE.Color(this.state.sceneBackground);

        // 渲染前半段介紹文字畫面
        // this.renderIntro();

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
            color: this.state.seaColor[this.state.planetUseToneIndex],
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
            color: this.state.terranColor[this.state.planetUseToneIndex],
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
        terranHighGeom = new THREE.SphereGeometry(this.state.planetRadius - 10, 30, 30);
        terranHighGeom.vertices.forEach((g) => {
            g[['x', 'y', 'z'][~~(Math.random() * 10)]] += Math.random() * 40;
        })
        highTerranMat = new THREE.MeshLambertMaterial({
            color: this.state.highTerranColor[this.state.planetUseToneIndex],
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
        if (this.state.addBaseGround) {
            scene.add(ground);
        }

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
        if (this.state.isDebugMode) {
            scene.add(axesHelper)
        }

        // 影子相機助手
        let helper;
        helper = new THREE.CameraHelper(light.shadow.camera);
        helper.name = 'cameraHelper';
        if (this.state.isDebugMode) {
            scene.add(helper);
        }

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

        // 设定相机始终正对的方向
        camera.lookAt(new THREE.Vector3(0, this.state.planetRadius, 0));       //控制焦点始終正對主星球球心

        // Tween起作用必須設定
        TWEEN.update();

        // 地球自轉 (繞著y軸轉)
        if (this.state.myPlanetAutoRotate) {
            base.rotation.y += 0.003;
        }

        // fov等等更新後須調用
        camera.updateProjectionMatrix();

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

    // 更改星球配色
    updatePlanetTone = (selectedIndex) => {
        // 更改state的狀態
        this.setState({
            planetUseToneIndex: selectedIndex,
            planetToneDiscription: this.state.planetToneDiscriptionBucket[selectedIndex]
        }, () => {
            // 設定星球及高山顏色
            base.material.color.setHex(this.state.seaColor[selectedIndex]);
            terran.material.color.setHex(this.state.terranColor[selectedIndex]);
            highTerran.material.color.setHex(this.state.highTerranColor[selectedIndex]);
        })
    }

    // 移動星球配色調整桿時觸發
    handlePlanetToneOnInput = () => {
        let toneValue = this.planetToneInputDOMElement.value;       //滑桿的讀數
        let caculateValue = Math.floor(toneValue / 10);  //滑桿讀數換算後

        switch (caculateValue) {
            case 0:
                this.updatePlanetTone(0);
                break;
            case 1:
                this.updatePlanetTone(1);
                break;
            case 2:
                this.updatePlanetTone(2);
                break;
            case 3:
                this.updatePlanetTone(3);
                break;
            case 4:
                this.updatePlanetTone(4);
                break;
            case 5:
                this.updatePlanetTone(5);
                break;
            case 6:
                this.updatePlanetTone(6);
                break;
            case 7:
                this.updatePlanetTone(7);
                break;
            case 8:
                this.updatePlanetTone(8);
                break;
            case 9:
                this.updatePlanetTone(9);
                break;
            default:
                break;
        }
        console.log(caculateValue);
    }

    // 使用者移動地球size調整桿時觸發
    handlePlanetSizeOnInput = () => {
        // 随移动杆决定星球大小形容词
        this.updatePlanetSizeDescription();

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
        // 随移动杆决定星球山密度形容词
        this.updatePlanetMountainDensityDescription();

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

        // console.log(this.GreenMountainGeoDensityBarDOMElement.value);
    }

    // 使用者移動翠綠山高度調整桿觸發
    handleGreenMountainHeightBarScroll = () => {
        // 随移动杆决定星球山高度形容词
        this.updatePlanetMountainHeightDescription();

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

        // console.log(this.GreenMountainGeoHeightBarDOMElement.value);
    }

    // 保持原樣按鈕按下觸發
    handleUsrCancelButtonOnClick = () => {
        // 依照目前正在調整的參數，決定此按鈕的動作
        switch (this.state.currentAdjustingPlanetProperty) {
            case 'size':
                // 關閉使用者自訂星球介面
                this.setState({
                    usrCustomizePlanetControlsIsOpen: false
                })
                break;
            case 'tone':
                this.setState({
                    currentAdjustingPlanetProperty: 'size'
                })
                break;
            case 'density':
                this.setState({
                    currentAdjustingPlanetProperty: 'tone'
                })
                break;
            case 'height':
                this.setState({
                    currentAdjustingPlanetProperty: 'density',
                })
                break;
            default:
                break;
        }
    }

    // 確定新樣式按鈕按下觸發
    handleUsrConfirmButtonOnClick = () => {
        // 依照目前正在調整的參數，決定此按鈕的動作
        switch (this.state.currentAdjustingPlanetProperty) {
            case 'size':
                this.setState({
                    currentAdjustingPlanetProperty: 'tone'
                })
                break;
            case 'tone':
                this.setState({
                    currentAdjustingPlanetProperty: 'density'
                })
                break;
            case 'density':
                this.setState({
                    currentAdjustingPlanetProperty: 'height'
                })
                break;
            case 'height':
                this.setState({
                    currentAdjustingPlanetProperty: '',
                    usrCustomizePlanetControlsIsOpen: false,     //關閉使用者自訂星球介面
                    isInFinalPage: true,                          //進入最終成果呈現畫面，為了讓偵測手勢滑動方向啟用
                    showFinalFirstSentence: true,               // 显示结尾画面第一句话
                })
                break;
            default:
                break;
        }
    }

    // 更新確認鈕的文字
    updateConfirmText = () => {
        // 依照目前正在調整的參數，決定此按鈕的文字
        switch (this.state.currentAdjustingPlanetProperty) {
            case 'size':
                return ('下一步')
            case 'tone':
                return ('下一步')
            case 'density':
                return ('下一步')
            case 'height':
                return ('确定新样式')
            default:
                break;
        }
    }

    // 更新取消鈕的文字
    updateCancelText = () => {
        // 依照目前正在調整的參數，決定此按鈕的文字
        switch (this.state.currentAdjustingPlanetProperty) {
            case 'size':
                return ('保持原样')
            case 'tone':
                return ('上一步')
            case 'density':
                return ('上一步')
            case 'height':
                return ('上一步')
            default:
                break;
        }
    }

    // 切換相機位置 (看自己的星球viewMyPlanet, 看所有的星球viewAllPlanet)
    changeCameraPositionTo = (changeToView) => {
        let newCameraPositionVector;
        let newCameraFov = {};

        switch (changeToView) {
            case 'viewMyPlanet':
                // 注視自己的星球
                newCameraPositionVector = { x: 0, y: 700, z: 2000 };
                this.setState({
                    currentCameraView: 'viewMyPlanet'
                });
                // camera.lookAt(new THREE.Vector3(0, this.state.planetRadius, 0));    //注視主星球球心()
                newCameraFov.far = 3000;
                break;
            case 'viewAllPlanet':
                // 注視全部的星球
                newCameraPositionVector = { x: 0, y: 2200, z: 3500 };
                this.setState({
                    currentCameraView: 'viewAllPlanet'
                });
                // camera.lookAt(new THREE.Vector3(0, 0, 0));    //注視原点
                newCameraFov.far = 10000;
                break;
            default:
                if (this.state.currentCameraView === 'viewMyPlanet') {
                    // 注視全部的星球
                    newCameraPositionVector = { x: 0, y: 2200, z: 3500 };
                    this.setState({
                        currentCameraView: 'viewAllPlanet'
                    });
                    // camera.lookAt(new THREE.Vector3(0, 0, 0));    //注視原点
                    newCameraFov.far = 10000;
                } else if (this.state.currentCameraView === 'viewAllPlanet') {
                    // 注視自己的星球
                    newCameraPositionVector = { x: 0, y: 700, z: 2000 };
                    this.setState({
                        currentCameraView: 'viewMyPlanet'
                    });
                    // camera.lookAt(new THREE.Vector3(0, this.state.planetRadius, 0));    //注視主星球球心()
                    newCameraFov.far = 3000;
                }
                break;
        }

        // 設定相機到新的位置
        let tween = new TWEEN.Tween(camera.position)
            .to(newCameraPositionVector, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        // 設定相機到新的fov
        let tween2 = new TWEEN.Tween(camera)
            .to(newCameraFov, 1200)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        // 更換相機遠點 (更新fov, aspect, near, or far後需要調用updateProjectionMatrix更新) 
        // camera.far = 10000
        camera.updateProjectionMatrix();
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
    // 目前宇宙中有幾顆星球
    renderThreeText = () => {
        let usrPlanetRadius = this.state.usrPlanetRadius;

        // bmfont
        if (false) {
            loadFont(require('../../fonts/DejaVu-sdf.fnt'), function (err, font) {
                let geometry = createGeometry({
                    width: 2000,
                    align: 'center',
                    font: font,
                });

                // geometry.update('恭喜你發現宇宙中第\n66號星球');
                geometry.update('Lorem ipsum\nDolor sit amet.');

                console.log(geometry.layout.height);
                console.log(geometry.layout.descender);

                let textureLoader = new THREE.TextureLoader();
                textureLoader.load(require('../../fonts/DejaVu-sdf.png'), function (texture) {
                    // let material = new THREE.RawShaderMaterial({
                    //     vertexShader: glslify(require('../../ThreeFiles/shaders/fx.vert')),
                    //     fragmentShader: glslify(require('../../ThreeFiles/shaders/fx.frag')),
                    //     uniforms: {
                    //         animate: { type: 'f', value: 1 },
                    //         iGlobalTime: { type: 'f', value: 0 },
                    //         map: { type: 't', value: texture },
                    //         color: { type: 'c', value: new THREE.Color('#fff') }
                    //     },
                    //     transparent: true,
                    //     side: THREE.DoubleSide,
                    //     depthTest: false
                    // })
                    let material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        color: 0xaaffff
                    })
                    // material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide } );

                    let mesh = new THREE.Mesh(geometry, material);

                    mesh.rotation.x = Math.PI;
                    mesh.position.x = -1000;
                    mesh.position.y = usrPlanetRadius * 2 + 100;
                    mesh.position.z = 0;
                    mesh.name = 'bmFont';
                    // mesh.castShadow = true;
                    scene.add(mesh);
                })
            })
        }
    }

    // 掛載偵測手勢滑動的動作Listener
    addTouchMoveListener = () => {
        swipeDetector = this.detectTouchMove;
        thisPageSwipeListener = SwipeListener(swipeDetector);
        swipeDetector.addEventListener('swipe', (e) => {
            let directions = e.detail.directions;
            let x = e.detail.x;
            let y = e.detail.y;

            if (directions.top) {
                this.changeCameraPositionTo('viewAllPlanet');
                this.setState({
                    showFinalFirstSentence: false,               // 显示结尾画面第一句话
                    showFinalUsrSceneSwipeTopTip: false,         // 显示结尾个人画面往上滑提示
                    showFinalSecondSentence: true,              // 显示结尾画面第二句话
                })
            }

            if (directions.bottom) {
                this.changeCameraPositionTo('viewMyPlanet');
                this.setState({
                    showFinalFirstSentence: true,               // 显示结尾画面第一句话
                    showFinalSecondSentence: false,              // 显示结尾画面第二句话
                    showFinalAlSceneSwipeBottomTip: false,       // 显示结尾个人画面往下滑提示
                })
            }
        })
    }

    // 结尾第一句话说完触发
    triggerOnFinalFirstSentenceEnd = () => {
        this.setState({
            showFinalUsrSceneSwipeTopTip: true,
        })
    }

    // 结尾第二句话说完触发
    triggerOnFinalSecondSentenceEnd = () => {
        this.setState({
            showFinalAlSceneSwipeBottomTip: true,
        })
    }

    // 随移动杆决定星球大小形容词
    updatePlanetSizeDescription = () => {
        let max = this.state.planetRadius * 1.5;
        let min = this.state.planetRadius * 0.5;
        let currentValue = this.planetSizeInputDOMElement.value;

        // 目前游標在移動桿中的比例
        let currentPercentage = (currentValue - min) / (max - min);
        console.log(currentPercentage)

        if (currentPercentage <= 0.33) {
            this.setState({
                planetSizeShowingText: '小巧可爱就好'
            })
        } else if (currentPercentage > 0.33 && currentPercentage <= 0.66) {
            this.setState({
                planetSizeShowingText: '不大不小刚刚好'
            })
        } else if (currentPercentage > 0.66) {
            this.setState({
                planetSizeShowingText: '超級無敵大'
            })
        }
    }

    // 随移动杆决定星球山密度形容词
    updatePlanetMountainDensityDescription = () => {
        let max = this.state.greenMountainDensityMax;
        let min = this.state.greenMountainDensityMin;
        let currentValue = this.GreenMountainGeoDensityBarDOMElement.value;

        // 目前游標在移動桿中的比例
        let currentPercentage = (currentValue - min) / (max - min);
        console.log(currentPercentage)

        if (currentPercentage <= 0.33) {
            this.setState({
                planetMountainDensityShowingText: '不要太多山，我喜歡多一點平原'
            })
        } else if (currentPercentage > 0.33 && currentPercentage <= 0.66) {
            this.setState({
                planetMountainDensityShowingText: '不大不小刚刚好'
            })
        } else if (currentPercentage > 0.66) {
            this.setState({
                planetMountainDensityShowingText: '很多很多，是個多山的星球'
            })
        }
    }

    // 随移动杆决定星球山高度形容词
    updatePlanetMountainHeightDescription = () => {
        let max = this.state.greenMountainHeightMax;
        let min = this.state.greenMountainHeightMin;
        let currentValue = this.GreenMountainGeoHeightBarDOMElement.value;

        // 目前游標在移動桿中的比例
        let currentPercentage = (currentValue - min) / (max - min);
        console.log(currentPercentage)

        if (currentPercentage <= 0.33) {
            this.setState({
                planetMountainHeightShowingText: '不要太高，平缓一点适合我'
            })
        } else if (currentPercentage > 0.33 && currentPercentage <= 0.66) {
            this.setState({
                planetMountainHeightShowingText: '有高有矮，刚刚好适合我'
            })
        } else if (currentPercentage > 0.66) {
            this.setState({
                planetMountainHeightShowingText: '很高很高，全都比云还高'
            })
        }
    }

    render() {
        return (
            <div className="FinalPageContainer">

                {/* 偵測手勢滑動 */}
                <div className={(this.state.isInFinalPage && this.state.addSwipeListener) ? ("detectTouchMove") : ("detectTouchMove notActive")} ref={self => this.detectTouchMove = self}></div>

                {/* THREE渲染區 */}
                <div className={(this.state.usrCustomizePlanetControlsIsOpen) ? ("threeCanvas usrControlIsOpen") : ('threeCanvas')} ref={self => this.threeCanvasDOMElement = self}></div>

                {/* 目前宇宙中發現了76顆星球，我們還在持續探索中 */}
                {/* <div className="threejsText">目前为止，骄阳宇宙发现了76颗星球，太空船还在持续搜索中...</div> */}
                <div className="finalText">
                    <div className="yourPlanetText">
                        {(this.state.showFinalFirstSentence) ? (<TypeWriter typing={1} maxDelay={100} minDelay={100} onTypingEnd={() => this.triggerOnFinalFirstSentenceEnd()}>
                            恭喜你，创造了第<span style={{ fontSize: '2rem', fontWeight: 'bold' }}>66</span>号星球
                    </TypeWriter>) : (null)}
                    </div>
                    <div className="allPlanetText">
                        {(this.state.showFinalSecondSentence) ? (<TypeWriter typing={1} maxDelay={100} minDelay={100} onTypingEnd={() => this.triggerOnFinalSecondSentenceEnd()}><div>目前为止,</div> <div>骄阳宇宙发现了76颗星球,</div> <div>太空船还在持续搜索中...</div></TypeWriter>) : (null)}
                    </div>
                    {/* 往上滑動 */}
                    <div className={(this.state.showFinalUsrSceneSwipeTopTip)?("scrollTopText"):("scrollTopText hide")}>
                        <div className="arrow left">
                        <svg t={1567650388949} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={1975}><path fill='#ffffff' d="M547.584 802.83648c20.89984 20.89984 20.89984 54.80448 0 75.70432-20.89984 20.91008-54.79424 20.91008-75.70432 0l-328.704-328.69376c-10.4448-10.45504-15.6672-24.14592-15.6672-37.84704s5.23264-27.40224 15.6672-37.84704l328.704-328.69376c20.91008-20.91008 54.80448-20.91008 75.70432 0 20.89984 20.89984 20.89984 54.79424 0 75.70432L256.74752 512 547.584 802.83648zM589.96736 512l290.83648-290.83648c20.89984-20.91008 20.89984-54.80448 0-75.70432-20.89984-20.91008-54.79424-20.91008-75.70432 0l-328.704 328.69376c-10.4448 10.45504-15.6672 24.14592-15.6672 37.84704s5.23264 27.40224 15.6672 37.84704l328.704 328.69376c20.91008 20.91008 54.80448 20.91008 75.70432 0 20.89984-20.89984 20.89984-54.80448 0-75.70432L589.96736 512z" p-id={1976} /></svg>
                        </div>
                        <div className="text">往上滑动</div>
                        <div className="arrow right">
                        <svg t={1567650388949} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={1975}><path fill='#ffffff' d="M547.584 802.83648c20.89984 20.89984 20.89984 54.80448 0 75.70432-20.89984 20.91008-54.79424 20.91008-75.70432 0l-328.704-328.69376c-10.4448-10.45504-15.6672-24.14592-15.6672-37.84704s5.23264-27.40224 15.6672-37.84704l328.704-328.69376c20.91008-20.91008 54.80448-20.91008 75.70432 0 20.89984 20.89984 20.89984 54.79424 0 75.70432L256.74752 512 547.584 802.83648zM589.96736 512l290.83648-290.83648c20.89984-20.91008 20.89984-54.80448 0-75.70432-20.89984-20.91008-54.79424-20.91008-75.70432 0l-328.704 328.69376c-10.4448 10.45504-15.6672 24.14592-15.6672 37.84704s5.23264 27.40224 15.6672 37.84704l328.704 328.69376c20.91008 20.91008 54.80448 20.91008 75.70432 0 20.89984-20.89984 20.89984-54.80448 0-75.70432L589.96736 512z" p-id={1976} /></svg>
                        </div>
                    </div>
                    {/* 往下滑動 */}
                    <div className={(this.state.showFinalAlSceneSwipeBottomTip)?("scrollBottomText"):("scrollBottomText hide")}>
                        <div className="arrow left">
                        <svg t={1567650388949} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={1975}><path fill='#ffffff' d="M547.584 802.83648c20.89984 20.89984 20.89984 54.80448 0 75.70432-20.89984 20.91008-54.79424 20.91008-75.70432 0l-328.704-328.69376c-10.4448-10.45504-15.6672-24.14592-15.6672-37.84704s5.23264-27.40224 15.6672-37.84704l328.704-328.69376c20.91008-20.91008 54.80448-20.91008 75.70432 0 20.89984 20.89984 20.89984 54.79424 0 75.70432L256.74752 512 547.584 802.83648zM589.96736 512l290.83648-290.83648c20.89984-20.91008 20.89984-54.80448 0-75.70432-20.89984-20.91008-54.79424-20.91008-75.70432 0l-328.704 328.69376c-10.4448 10.45504-15.6672 24.14592-15.6672 37.84704s5.23264 27.40224 15.6672 37.84704l328.704 328.69376c20.91008 20.91008 54.80448 20.91008 75.70432 0 20.89984-20.89984 20.89984-54.80448 0-75.70432L589.96736 512z" p-id={1976} /></svg>
                        </div>
                        <div className="text">往下滑动</div>
                        <div className="arrow right">
                        <svg t={1567650388949} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={1975}><path fill='#ffffff' d="M547.584 802.83648c20.89984 20.89984 20.89984 54.80448 0 75.70432-20.89984 20.91008-54.79424 20.91008-75.70432 0l-328.704-328.69376c-10.4448-10.45504-15.6672-24.14592-15.6672-37.84704s5.23264-27.40224 15.6672-37.84704l328.704-328.69376c20.91008-20.91008 54.80448-20.91008 75.70432 0 20.89984 20.89984 20.89984 54.79424 0 75.70432L256.74752 512 547.584 802.83648zM589.96736 512l290.83648-290.83648c20.89984-20.91008 20.89984-54.80448 0-75.70432-20.89984-20.91008-54.79424-20.91008-75.70432 0l-328.704 328.69376c-10.4448 10.45504-15.6672 24.14592-15.6672 37.84704s5.23264 27.40224 15.6672 37.84704l328.704 328.69376c20.91008 20.91008 54.80448 20.91008 75.70432 0 20.89984-20.89984 20.89984-54.80448 0-75.70432L589.96736 512z" p-id={1976} /></svg>
                        </div>
                    </div>
                </div>

                {/* 使用者自訂參數層 */}
                <div className={(this.state.usrCustomizePlanetControlsIsOpen) ? ("usrCustomizePlanetControls") : ("usrCustomizePlanetControls hide")}>

                    {/* 星球大小 */}
                    <div className={(this.state.currentAdjustingPlanetProperty === 'size') ? ("controlItem planetSize") : ('controlItem planetSize hide')}>
                        {/* 標題 */}
                        <div className="title">
                            {/* 上行 */}
                            <div className="top">我希望我星球的</div>
                            {/* 下行 */}
                            <div className="bottom">大小</div>
                        </div>
                        {/* 調整的標題 */}
                        <div className="adjustTitle">
                            {this.state.planetSizeShowingText}
                        </div>
                        {/* 調整桿欄位 */}
                        <div className="adjustBar">
                            {/* 減號 */}
                            <div className="increaseAndDecreaseIcon decrease">-</div>
                            {/* 調整桿 */}
                            <div className="adjustBarSelfDiv">
                                <input type='range' min={this.state.planetRadius * 0.5} max={this.state.planetRadius * 1.5} defaultValue={this.state.planetRadius} step="1" ref={(self) => this.planetSizeInputDOMElement = self} onInput={() => this.handlePlanetSizeOnInput()}></input>
                            </div>
                            {/* 加號 */}
                            <div className="increaseAndDecreaseIcon increase">+</div>
                        </div>
                    </div>

                    {/* 星球色調 */}
                    <div className={(this.state.currentAdjustingPlanetProperty === 'tone') ? ("controlItem planetTone") : ('controlItem planetTone hide')}>
                        {/* 標題 */}
                        <div className="title">
                            {/* 上行 */}
                            <div className="top">我希望我星球的</div>
                            {/* 下行 */}
                            <div className="bottom">主要色調</div>
                        </div>
                        {/* 調整的標題 */}
                        <div className="adjustTitle">
                            {this.state.planetToneDiscription}
                        </div>
                        {/* 調整桿欄位 */}
                        <div className="adjustBar">
                            {/* 減號 */}
                            <div className="increaseAndDecreaseIcon decrease">-</div>
                            {/* 調整桿 */}
                            <div className="adjustBarSelfDiv">
                                <input type='range' min='0' max='99' defaultValue='50' step="0.5" ref={(self) => this.planetToneInputDOMElement = self} onInput={() => this.handlePlanetToneOnInput()}></input>
                            </div>
                            {/* 加號 */}
                            <div className="increaseAndDecreaseIcon increase">+</div>
                        </div>
                    </div>

                    {/* 山密度(數量) */}
                    <div className={(this.state.currentAdjustingPlanetProperty === 'density') ? ("controlItem mountainDensity") : ('controlItem mountainDensity hide')}>
                        {/* 標題 */}
                        <div className="title">
                            {/* 上行 */}
                            <div className="top">我希望我星球上的</div>
                            {/* 下行 */}
                            <div className="bottom">山丘數量</div>
                        </div>
                        {/* 調整的標題 */}
                        <div className="adjustTitle">
                            {this.state.planetMountainDensityShowingText}
                        </div>
                        {/* 調整桿欄位 */}
                        <div className="adjustBar">
                            {/* 減號 */}
                            <div className="increaseAndDecreaseIcon decrease">-</div>
                            {/* 調整桿 */}
                            <div className="adjustBarSelfDiv">
                                <input type='range' min={this.state.greenMountainDensityMin} max={this.state.greenMountainDensityMax} defaultValue={this.state.greenMountainDensity} step="1" ref={self => this.GreenMountainGeoDensityBarDOMElement = self} onInput={() => this.handleGreenMountainDensityBarScroll()}></input>
                            </div>
                            {/* 加號 */}
                            <div className="increaseAndDecreaseIcon increase">+</div>
                        </div>
                    </div>

                    {/* 山高 */}
                    <div className={(this.state.currentAdjustingPlanetProperty === 'height') ? ("controlItem mountainHeight") : ('controlItem mountainHeight hide')}>
                        {/* 標題 */}
                        <div className="title">
                            {/* 上行 */}
                            <div className="top">我希望我星球上的</div>
                            {/* 下行 */}
                            <div className="bottom">山的高度</div>
                        </div>
                        {/* 調整的標題 */}
                        <div className="adjustTitle">{this.state.planetMountainHeightShowingText}</div>
                        {/* 調整桿欄位 */}
                        <div className="adjustBar">
                            {/* 減號 */}
                            <div className="increaseAndDecreaseIcon decrease">-</div>
                            {/* 調整桿 */}
                            <div className="adjustBarSelfDiv">
                                <input type='range' min={this.state.greenMountainHeightMin} max={this.state.greenMountainHeightMax} defaultValue={this.state.greenMountainHeight} ref={self => this.GreenMountainGeoHeightBarDOMElement = self} onInput={() => this.handleGreenMountainHeightBarScroll()}></input>
                            </div>
                            {/* 加號 */}
                            <div className="increaseAndDecreaseIcon increase">+</div>
                        </div>
                    </div>

                    {/* 確認取消鈕 */}
                    <div className={(this.state.usrCustomizePlanetControlsIsOpen) ? ("usrConfirmButtonContainer") : ('usrConfirmButtonContainer usrControlIsHide')}>
                        <button className="button" onClick={() => this.handleUsrCancelButtonOnClick()}>{this.updateCancelText()}</button>
                        <button className="button confirm" onClick={() => this.handleUsrConfirmButtonOnClick()}>{this.updateConfirmText()}</button>
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
                        {/* <input type='range' className="updateGreenMountainGeoDensity" min='11' max='40' defaultValue={this.state.greenMountainDensity} ref={self => this.GreenMountainGeoDensityBarDOMElement = self} onInput={() => this.handleGreenMountainDensityBarScroll()} />
                        <input type='range' className="updateGreenMountainGeoHeight" min='0' max='100' defaultValue={this.state.greenMountainHeight} ref={self => this.GreenMountainGeoHeightBarDOMElement = self} onInput={() => this.handleGreenMountainHeightBarScroll()} /> */}
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
