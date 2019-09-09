import React, { useState, useCallback, useEffect, useRef } from "react";
import "./IntroTextPage2.scss";
import { connect } from 'react-redux';
import {
  updateUsrOpenID,
  fromServerUsrName,
  updateFromServerUsrPlanetRadius,
  updateFromServerPlanetTone,
  updateFromServerUsrPlanetMountainHeight,
  updateFromServerUsrPlanetMountainDensity,
  updateIntroPageMounted,
  updateFinalPageMounted,
  changeBGAlignToRight
} from '../../actions/actions.js';

import THREE from 'three';
import { apply, Canvas, useRender, useResource, useThree } from 'react-three-fiber';
import * as resources from '../../react-three-fiber/index.js';
import TypeWriter from 'react-typewriter';
import Typist from 'react-typist';
apply(resources);

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
    fromServerUsrWorkDays: state.myFirstReducers.fromServerUsrWorkDays,
    thisPersonIdIsInDataBase: state.myFirstReducers.thisPersonIdIsInDataBase
  }
}

class IntroTextPage2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentShowingSentence: 0,
      currentActivePage: 1,     //目前顯示第幾頁
      firstPageTypeWriterIsMount: false,     //第一頁的打字機文字是否掛載
      secondPageTypeWriterIsMount: false,     //第一頁的打字機文字是否掛載
      thirdPageTypeWriterIsMount: false,     //第一頁的打字機文字是否掛載
      finalConfirmButtonIsShowing: false,   //結果的按鈕是否顯示
      thisPageShowing: true,               //本頁是否顯示
    }
  }

  // 每次渲染後執行，就像componentDidMount and componentDidUpdate
  componentDidMount = () => {
    // 定義目前顯是第幾行字
    // const timer = setInterval(() => {
    //   this.setState({ currentShowingSentence: this.state.currentShowingSentence + 1 });
    //   console.log(this.state.currentShowingSentence);
    // }, 1600);

    // // 在下次執行useEffects前
    // return () => {
    //   // 清除計時器(定義目前顯是第幾行字)
    //   clearInterval(timer);
    // }

    // 此人是否在資料庫中
    if (this.props.thisPersonIdIsInDataBase) {
      // 如果资料库中沒有使用者ID，则直接触发start button，若无资料，则开始打字机动画
      if (
        // false
        this.props.fromServerUsrPlanetRadius == null ||
        this.props.fromServerUsrPlanetRadius === '' ||
        this.props.fromServerUsrPlanetTone == null ||
        this.props.fromServerUsrPlanetTone === '' ||
        this.props.fromServerUsrPlanetMountainHeight == null ||
        this.props.fromServerUsrPlanetMountainHeight === '' ||
        this.props.fromServerUsrPlanetMountainDensity == null ||
        this.props.fromServerUsrPlanetMountainDensity === ''
      ) {
        // 頁面掛載後延遲幾秒，開始打字機動畫
        setTimeout(() => {
          this.setState({
            firstPageTypeWriterIsMount: true
          })
        }, 1000)
      } else {
        // 開始畫載FinalPage
        this.props.updateFinalPageMounted(true);
        this.handleStartButtonOnClick();
      }
    } else {
      // 此人不再資料庫中，跳過此頁
      // 開始畫載FinalPage
      this.props.updateFinalPageMounted(true);
      this.handleStartButtonOnClick();
    }



  }

  // 第一頁打字機結束時觸發
  triggerOnFirstPageTypeEnd = () => {
    // 多久後跳轉下一頁，在最後一個字出現之後
    let delay = 500;

    setTimeout(() => {
      this.setState({
        currentActivePage: 2
      })

      this.setState({
        secondPageTypeWriterIsMount: true
      })
    }, delay)
  }

  // 第二頁打字機結束時觸發
  triggerOnSecondPageTypeEnd = () => {
    // 多久後跳轉下一頁，在最後一個字出現之後
    let delay = 1000;

    setTimeout(() => {
      this.setState({
        currentActivePage: 3
      })

      this.setState({
        thirdPageTypeWriterIsMount: true
      })
    }, delay)
  }

  // 第三頁打字機結束時觸發
  triggerOnThirdPageTypeEnd = () => {
    // 多久後跳轉下一頁，在最後一個字出現之後
    let delay = 500;

    this.setState({
      finalConfirmButtonIsShowing: true
    })

    // 開始畫載FinalPage
    this.props.updateFinalPageMounted(true);
  }

  // 按下最後的start button觸發
  handleStartButtonOnClick = () => {
    // 隱藏此頁
    this.setState({ thisPageShowing: false })

    // 將此頁unMount
    setTimeout(() => {
      console.log('開始移除IntroPage');
      this.props.updateIntroPageMounted(false);
    }, 3000)

    // 如果系統沒有user的星球資料，代表user沒訪問過
    // 所以要顯示自訂星球介面，所以頁面跳轉時，不要將被景圖右移
    if (this.props.fromServerUsrPlanetRadius == null ||
      this.props.fromServerUsrPlanetRadius === '' ||
      this.props.fromServerUsrPlanetTone == null ||
      this.props.fromServerUsrPlanetTone === '' ||
      this.props.fromServerUsrPlanetMountainHeight == null ||
      this.props.fromServerUsrPlanetMountainHeight === '' ||
      this.props.fromServerUsrPlanetMountainDensity == null ||
      this.props.fromServerUsrPlanetMountainDensity === ''
    ) {

    } else {
      this.props.changeBGAlignToRight(true);
    }

  }

  render() {
    let firstPageCharactersDelay = [
      { at: '式', delay: 700 },
      { at: 20, delay: 700 }
    ];
    let secondPageCharactersDelay = [
      { at: 5, delay: 500 },
      { at: 11, delay: 700 },
      { at: 21, delay: 500 },
      { at: 28, delay: 700 },
      { at: 32, delay: 500 },
      { at: 41, delay: 500 },
      { at: 45, delay: 500 }
    ];
    let thirdPageCharatersDelay = [
      { at: 8, delay: 500 },
      { at: 21, delay: 700 },
      // { at: 32, delay: 500 }
    ];
    return (
      <div className={(this.state.thisPageShowing) ? ("IntroTextPage2") : ("IntroTextPage2 hide")}>
        {/* <Canvas camera={{ fov: 75, position: [0, 0, 50] }}>
        <Swarm mouse={mouse} />
        <Effect />
      </Canvas> */}

        {/* <div className="bg">
          <img src={require('../../images/BG.jpg')} alt="" />
        </div> */}

        <div className={(this.props.bgAlignToRight) ? ("bg alignToRight") : ("bg")}>
          <img src={require('../../images/BGCombine.jpg')} alt=''></img>
        </div>

        <div className={(this.state.currentActivePage === 1) ? ("firstPage") : ("firstPage hide")}>
          {/* <Typist onTypingDone={() => this.triggerOnFirstPageTypeEnd()}> */}
          {(this.state.firstPageTypeWriterIsMount) ? (
            <TypeWriter typing={1} maxDelay={95} minDelay={75} delayMap={firstPageCharactersDelay} onTypingEnd={() => this.triggerOnFirstPageTypeEnd()}>
              <div className="name">Hi~ {this.props.fromServerUsrName}</div>
              <div className="sentence">今天是你在骄阳的第<span style={{ fontSize: '2.3rem', color: 'orange', fontWeight: '600' }}>{this.props.fromServerUsrWorkDays}</span>天</div>
              {/* <div className="sentence"></div> */}
              <div className="sentence">也是骄阳的<span style={{ fontSize: '2.3rem', color: 'orange', fontWeight: '600' }}>20</span>岁生日</div>
            </TypeWriter>) : (null)}
        </div>

        <div className={(this.state.currentActivePage === 2) ? ("secondPage") : ("secondPage hide")}>
          {(this.state.secondPageTypeWriterIsMount) ? (
            <TypeWriter typing={1} maxDelay={95} minDelay={75} delayMap={secondPageCharactersDelay} onTypingEnd={() => this.triggerOnSecondPageTypeEnd()}>
              <div className="sentence">感谢一直以来</div>
              <div className="sentence">努力付出的你</div>
              <div className="sentence">同时希望与你一起分享</div>
              <div className="sentence">骄阳成年的喜悦</div>
              <div className="sentence">我们决定</div>
              <div className="sentence">送你一个小小的礼物</div>
              <div className="sentence">做为纪念</div>
            </TypeWriter>) : (null)}
        </div>

        <div className={(this.state.currentActivePage === 3) ? ("thirdPage") : ("secondPage hide")}>
          {(this.state.thirdPageTypeWriterIsMount) ? (
            <TypeWriter typing={1} maxDelay={95} minDelay={75} delayMap={thirdPageCharatersDelay} onTypingEnd={() => this.triggerOnThirdPageTypeEnd()}>
              <div className="sentence">这个礼物是一颗星球</div>
              <div className="sentence">接下来我将带着你一起打造他</div>
              <div className="sentence">就让我们开始吧!!!  </div>
            </TypeWriter>
          ) : (null)}
        </div>

        <div className={(this.state.finalConfirmButtonIsShowing) ? ("startButton") : ("startButton hide")} onClick={() => this.handleStartButtonOnClick()}>
          {/* <span>START</span> */}
        </div>

        {/* <div className="sentenceContainer">
          <div className="sentence show">Hi~ {this.props.fromServerUsrName}</div>
          <div className="sentence show">今天是你在骄阳的第365天</div>
          <div className="sentence show">也是骄阳的20岁生日</div>
          <div className="sentence show">为了感谢一直以来努力付出的你</div>
          <div className="sentence show">同时跟你一起分享骄阳成年的喜悦</div>
          <div className="sentence show">我们决定送你一个小小的礼物做为纪念</div>
          <div className="sentence show">不过这个礼物我们必须一起完成</div>
          <div className="sentence show">话不多说，我们就直接开始吧</div>
        </div> */}
        {/* <div className="sentenceContainer">
          <div className={(this.state.currentShowingSentence >= 1) ? ("sentence show") : ("sentence")}>Hi~ {this.props.fromServerUsrName}</div>
          <div className={(this.state.currentShowingSentence >= 2) ? ("sentence show") : ("sentence")}>今天是你在骄阳的第365天</div>
          <div className={(this.state.currentShowingSentence >= 3) ? ("sentence show") : ("sentence")}>也是骄阳的20岁生日</div>
          <div className={(this.state.currentShowingSentence >= 4) ? ("sentence show") : ("sentence")}>为了感谢一直以来努力付出的你</div>
          <div className={(this.state.currentShowingSentence >= 5) ? ("sentence show") : ("sentence")}>同时跟你一起分享骄阳成年的喜悦</div>
          <div className={(this.state.currentShowingSentence >= 6) ? ("sentence show") : ("sentence")}>我们决定送你一个小小的礼物做为纪念</div>
          <div className={(this.state.currentShowingSentence >= 7) ? ("sentence show") : ("sentence")}>不过这个礼物我们必须一起完成</div>
          <div className={(this.state.currentShowingSentence >= 8) ? ("sentence show") : ("sentence")}>话不多说，我们就直接开始吧</div>
        </div> */}
      </div>
    )
  }
}

const mapDispatchToProps = {
  updateUsrOpenID,
  updateFromServerUsrPlanetRadius,
  updateFromServerPlanetTone,
  updateFromServerUsrPlanetMountainHeight,
  updateFromServerUsrPlanetMountainDensity,
  updateIntroPageMounted,
  updateFinalPageMounted,
  changeBGAlignToRight
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroTextPage2);