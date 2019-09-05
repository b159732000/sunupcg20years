import React from "react";
import "./IntroTextPage.scss";

// 參考animated-mesh-lines github
import {
  Color,
  Vector3,
  SphereBufferGeometry,
  Mesh,
  Raycaster,
  MeshBasicMaterial,
  ShapeGeometry
} from "three";

import { TimelineLite, Power3 } from "gsap";

import Engine from "../../animated-mesh-lines/utils/engine";
import Stars from "../../animated-mesh-lines/objects/Stars";
import AnimatedText3D from "../../animated-mesh-lines/objects/AnimatedText3D";
import LineGenerator from "../../animated-mesh-lines/objects/LineGenerator";

import getRandomFloat from "../../animated-mesh-lines/utils/getRandomFloat";
import getRandomItem from "../../animated-mesh-lines/utils/getRandomItem";

import HandleCameraOrbit from "../../animated-mesh-lines/decorators/HandleCameraOrbit";
import FullScreenInBackground from "../../animated-mesh-lines/decorators/FullScreenInBackground";
import PostProcessing from "../../animated-mesh-lines/decorators/PostProcessing";

/**
 * * *******************
 * * ENGINE
 * * *******************
 */
@FullScreenInBackground
@PostProcessing
@HandleCameraOrbit({ x: 1, y: 1 }, 0.1)
class CustomEngine extends Engine {}
const engine = new CustomEngine();
engine.camera.position.z = 2;
engine.addBloomEffect(
  {
    resolutionScale: 0.5,
    kernelSize: 4,
    distinction: 0.01
  },
  1
);

/**
 * * *******************
 * * TITLE (Hi國禾)
 * * *******************
 */
const text = new AnimatedText3D("Hi国禾", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
text.position.x -= text.basePosition * 0.5;
engine.add(text);

/**
 * * *******************
 * * TITLE (今天是你在骄阳的第365天)
 * * *******************
 */
const secondText = new AnimatedText3D("今天是你在骄阳的", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
secondText.position.x -= secondText.basePosition * 0.5;
engine.add(secondText);

/**
 * * *******************
 * * TITLE (今天是你在骄阳的第365天)
 * * *******************
 */
const second2Text = new AnimatedText3D("第365天", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
second2Text.position.x -= second2Text.basePosition * 0.5;
second2Text.position.y -= second2Text.basePosition * 0.2;
engine.add(second2Text);

/**
 * * *******************
 * * TITLE (也是骄阳的20岁生日)
 * * *******************
 */
const thirdText = new AnimatedText3D("也是骄阳的20岁生日", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
thirdText.position.x -= thirdText.basePosition * 0.5;
engine.add(thirdText);

/**
 * * *******************
 * * TITLE (为了感谢一直以来努力付出的你)
 * * *******************
 */
const forthText = new AnimatedText3D("为了感谢一直以来", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
forthText.position.x -= forthText.basePosition * 0.5;
engine.add(forthText);

/**
 * * *******************
 * * TITLE (为了感谢一直以来努力付出的你)
 * * *******************
 */
const forth2Text = new AnimatedText3D("努力付出的你", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
forth2Text.position.x -= forth2Text.basePosition * 0.5;
forth2Text.position.y -= forth2Text.basePosition * 0.15;
engine.add(forth2Text);

/**
 * * *******************
 * * TITLE (同时跟你分享骄阳成年的喜悦)
 * * *******************
 */
const fifthText = new AnimatedText3D("同时跟你分享", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
fifthText.position.x -= fifthText.basePosition * 0.5;
engine.add(fifthText);

/**
 * * *******************
 * * TITLE (同时跟你分享骄阳成年的喜悦)
 * * *******************
 */
const fifth2Text = new AnimatedText3D("骄阳成年的喜悦", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
fifth2Text.position.x -= fifth2Text.basePosition * 0.5;
fifth2Text.position.y -= fifth2Text.basePosition * 0.15;
engine.add(fifth2Text);

/**
 * * *******************
 * * TITLE (我们决定送你一个小小的礼物做为纪念)
 * * *******************
 */
const sixthText = new AnimatedText3D("我们决定", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
sixthText.position.x -= sixthText.basePosition * 0.5;
sixthText.position.y += sixthText.basePosition * 0.2;
engine.add(sixthText);

/**
 * * *******************
 * * TITLE (我们决定送你一个小小的礼物做为纪念)
 * * *******************
 */
const sixth2Text = new AnimatedText3D("送你一个小小的礼物", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
sixth2Text.position.x -= sixth2Text.basePosition * 0.5;
engine.add(sixth2Text);

/**
 * * *******************
 * * TITLE (我们决定送你一个小小的礼物做为纪念)
 * * *******************
 */
const sixth3Text = new AnimatedText3D("做为纪念", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
sixth3Text.position.x -= sixth3Text.basePosition * 0.5;
sixth3Text.position.y -= sixth3Text.basePosition * 0.2;
engine.add(sixth3Text);

/**
 * * *******************
 * * TITLE (希望你会喜欢)
 * * *******************
 */
const seventhText = new AnimatedText3D("希望你会喜欢", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
seventhText.position.x -= seventhText.basePosition * 0.5;
engine.add(seventhText);

/**
 * * *******************
 * * TITLE (接下来，我们一起来做礼物吧)
 * * *******************
 */
const eighthText = new AnimatedText3D("接下来，", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
eighthText.position.x -= eighthText.basePosition * 0.5;
engine.add(eighthText);

/**
 * * *******************
 * * TITLE (接下来，我们一起来做礼物吧)
 * * *******************
 */
const eighth2Text = new AnimatedText3D("我们一起来做礼物吧", {
  color: "#FFFFFF",
  size: 0.05,
  wireframe: true,
  opacity: 1
});
// const text = new AnimatedText3D('Boreal Sky', { color: '#FFFFFF', size: app.isMobile ? 0.08 : 0.1, wireframe: true, opacity: 1, });
eighth2Text.position.x -= eighth2Text.basePosition * 0.5;
eighth2Text.position.y -= eighth2Text.basePosition * 0.2;
engine.add(eighth2Text);

/**
 * * *******************
 * * STARS
 * * *******************
 */
const stars = new Stars();
stars.update = () => {
  stars.rotation.y -= 0.0004;
  stars.rotation.x -= 0.0002;
};
engine.add(stars);

/**
 * * *******************
 * * LIGNES
 * * *******************
 */
const radius = 4;
const origin = new Vector3();
const direction = new Vector3();
const raycaster = new Raycaster();
const geometry = new SphereBufferGeometry(radius, 32, 32, 0, 3.2, 4, 2.1);
const material = new MeshBasicMaterial({ wireframe: true, visible: false });
const sphere = new Mesh(geometry, material);
engine.add(sphere);
sphere.position.z = 2;
const COLORS = [
  "#FFFAFF",
  "#0A2463",
  "#3E92CC",
  "#723bb7",
  "#efd28e",
  "#3f9d8c"
].map(col => new Color(col));
const STATIC_PROPS = {
  transformLineMethod: p => p
};
class CustomLineGenerator extends LineGenerator {
  addLine() {
    // V1 Regular and symetric lines ---------------------------------------------
    // i += 0.1;
    // let a = i;
    // let y = 12;
    // let incrementation = 0.1;
    // V2 ---------------------------------------------
    let incrementation = 0.1;
    let y = getRandomFloat(-radius * 0.6, radius * 1.8);
    let a = (Math.PI * -25) / 180;
    let aMax = (Math.PI * 200) / 180;

    const points = [];
    while (a < aMax) {
      a += 0.2;
      y -= incrementation;
      origin.set(radius * Math.cos(a), y, radius * Math.sin(a));
      direction.set(-origin.x, 0, -origin.z);
      direction.normalize();
      raycaster.set(origin, direction);

      // save the points
      const intersect = raycaster.intersectObject(sphere, true);
      if (intersect.length) {
        points.push(
          intersect[0].point.x,
          intersect[0].point.y,
          intersect[0].point.z
        );
      }
    }

    if (points.length === 0) return;

    if (Math.random() > 0.5) {
      // Low lines
      super.addLine({
        visibleLength: getRandomFloat(0.01, 0.2),
        points,
        speed: getRandomFloat(0.003, 0.008),
        color: getRandomItem(COLORS),
        width: getRandomFloat(0.01, 0.1)
      });
    } else {
      // Fast lines
      super.addLine({
        visibleLength: getRandomFloat(0.05, 0.2),
        points,
        speed: getRandomFloat(0.01, 0.1),
        color: COLORS[0],
        width: getRandomFloat(0.01, 0.01)
      });
    }
  }
}
const lineGenerator = new CustomLineGenerator(
  {
    frequency: 0.99
  },
  STATIC_PROPS
);
engine.add(lineGenerator);

/**
 * * *******************
 * * START
 * * *******************
 */
// Show
engine.start();
const tlShow = new TimelineLite({
  delay: 0.2,
  onStart: () => {
    // 啟動背景動畫
    lineGenerator.start();
  }
});
tlShow.to(".overlay", 2, { autoAlpha: 0 });
tlShow.fromTo(
  engine.lookAt,
  3,
  { y: -4 },
  { y: 0, ease: Power3.easeOut },
  "-=2"
);

// 定義動畫的啟動前延遲、間隔和持續時間
let delay = 1, gap = 1, duration = 2;
// 加入第一句話
tlShow.add(text.show, delay);
tlShow.add(text.hide, delay+duration);
tlShow.add(secondText.show, delay+gap+duration);
tlShow.add(secondText.hide, delay+2*duration+gap);
tlShow.add(second2Text.show, delay+gap+duration);
tlShow.add(second2Text.hide, delay+2*duration+gap);
tlShow.add(thirdText.show, delay+2*duration+2*gap);
tlShow.add(thirdText.hide, delay+3*duration+2*gap);
tlShow.add(forthText.show, delay+3*duration+3*gap);
tlShow.add(forthText.hide, delay+4*duration+3*gap);
tlShow.add(forth2Text.show, delay+3*duration+3*gap);
tlShow.add(forth2Text.hide, delay+4*duration+3*gap);
tlShow.add(fifthText.show, delay+4*duration+4*gap);
tlShow.add(fifthText.hide, delay+5*duration+4*gap);
tlShow.add(fifth2Text.show, delay+4*duration+4*gap);
tlShow.add(fifth2Text.hide, delay+5*duration+4*gap);
tlShow.add(sixthText.show, delay+5*duration+5*gap);
tlShow.add(sixthText.hide, delay+6*duration+5*gap);
tlShow.add(sixth2Text.show, delay+5*duration+5*gap);
tlShow.add(sixth2Text.hide, delay+6*duration+5*gap);
tlShow.add(sixth3Text.show, delay+5*duration+5*gap);
tlShow.add(sixth3Text.hide, delay+6*duration+5*gap);
tlShow.add(seventhText.show, delay+6*duration+6*gap);
tlShow.add(seventhText.hide, delay+7*duration+6*gap);
tlShow.add(eighthText.show, delay+7*duration+7*gap);
tlShow.add(eighthText.hide, delay+8*duration+7*gap);
tlShow.add(eighth2Text.show, delay+7*duration+7*gap);
tlShow.add(eighth2Text.hide, delay+8*duration+7*gap);

// Hide整頁
setTimeout(()=>{
    console.log('success');
      const tlHide = new TimelineLite();
      tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
      tlHide.add(text.hide, 0);
      tlHide.add(lineGenerator.stop);
      tlHide.to('.overlay', 0.5, { autoAlpha: 1 }, '-=1.5');
}, 1000)

// // Hide
// // app.onHide((onComplete) => {
// //   轉動相機離開視野
// //   停止背景星星條
// // });

/**
 * * *******************
 * * 自己做的THREE
 * * *******************
 */
let requestID;
let camera, scene, renderer, controls;

class IntroTextPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTextInLine: 1 //目前顯示的文字是第幾行
    };
  }

  componentDidMount = () => {
    // 為了讓chrome extention Three.js Inspector可以讀到場景
    // window.scene = scene;

    setTimeout(()=>{
        this.props.history.push('/sunupcg20years/FinalPage')
    }, 24000)
    // }, 23000)
  };

  handleChangeTextClick = () => {
    let tlHide = new TimelineLite();

    //   轉動相機離開視野
    //   tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });

    // 隱藏第一句話，顯示第二句話
    // tlHide.add(text.hide, 0);
    // tlShow.add(secondText.show, "-=2");
    // tlHide.add(secondText.hide, 0);
    // tlShow.add(thirdText.show, "-=2");
    // tlHide.add(thirdText.hide, 0);
    // tlShow.add(forthText.show, "-=2");
    // tlHide.add(forthText.hide, 0);
    // tlShow.add(fifthText.show, "-=2");
    // tlHide.add(fifthText.hide, 0);
    // tlShow.add(sixthText.show, "-=2");
    // tlHide.add(sixthText.hide, 0);
    // tlShow.add(seventhText.show, "-=2");
    // tlHide.add(seventhText.hide, 0);
    // tlShow.add(eighthText.show, "-=2");
    // tlHide.add(eighthText.hide, 0);

    // 停止背景星星條
    //   tlHide.add(lineGenerator.stop);
    //   tlHide.to('.overlay', 0.5, { autoAlpha: 1 }, '-=1.5');
  };

  render() {
    return (
      <div className="IntroTextPage">
        {/* <div className="debug">
          <button
            className="changeText"
            onClick={() => this.handleChangeTextClick()}
          >
            換下一句話
          </button>
        </div> */}
      </div>
    );
  }
}

export default IntroTextPage;
