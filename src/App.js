import React, { useState, useEffect } from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  updateUsrOpenID,
  updateFromServerUsrName,
  updateFromServerUsrPlanetRadius,
  updateFromServerPlanetTone,
  updateFromServerUsrPlanetMountainHeight,
  updateFromServerUsrPlanetMountainDensity,
  updateFromServerUsrWorkDays,
  updateLotteryNumber,
  updateThisPersonIsInDataBase
} from './actions/actions.js';
import wx from 'weixin-js-sdk';

import FinalPage from './components/FinalPage/FinalPage.jsx';
import LoadingPage from './components/LoadingPage/LoadingPage.jsx';
// import IntroTextPage from './components/IntroTextPage/IntroTextPage.jsx';
import IntroTextPage2 from './components/IntroTextPage2/IntroTextPage2.jsx';
import GetData from './components/GetData/GetData.jsx';
import { GetSignP2, ShareBack, share } from './api/api';
const axios = require('axios');

// 將接收到的state(包含在store內)放為本頁的state
function mapStateToProps(state) {
  // 將所有state傳入 <- 不能這樣傳，會不起作用
  // return state

  // 只傳入state中指定的值
  return {
    usrOpenID: state.myFirstReducers.usrOpenID,
    fromServerUsrPlanetRadius: state.myFirstReducers.fromServerUsrPlanetRadius,
    fromServerUsrPlanetTone: state.myFirstReducers.fromServerUsrPlanetTone,
    fromServerUsrPlanetMountainHeight: state.myFirstReducers.fromServerUsrPlanetMountainHeight,
    fromServerUsrPlanetMountainDensity: state.myFirstReducers.fromServerUsrPlanetMountainDensity,
    loadingPageMounted: state.myFirstReducers.loadingPageMounted,
    introPageMounted: state.myFirstReducers.introPageMounted,
    finalPageMounted: state.myFirstReducers.finalPageMounted,
    lotteryNumber: state.myFirstReducers.lotteryNumber,
    bgAlignToRight: state.myFirstReducers.bgAlignToRight,
    thisPersonIdIsInDataBase: state.myFirstReducers.thisPersonIdIsInDataBase
  }
}

// 重新導向獲得微信授權(Code)，有Code後在把Code傳給後端取得微信ID
let AppID = 'wx0db0332b2e95ff0e';   //公眾號ID
let local = window.location.href;   //目前網頁的網址
let weXinJumpCode;
let weXinOpenID;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount = () => {

    // 取得微信openID放到store
    if (window.enableWeXinLogIn) {
      // 重新導向獲得微信授權(Code)，有Code後在把Code傳給後端取得微信ID放到store
      this.getWeXinOpenIDFromWexin();
    } else {
      // 傳我的微信openID到store中
      this.props.updateUsrOpenID('oRbr0w4RNYkdxuBZvkB5oUxI7QkQ');
      setTimeout(() => {
        console.log(this.props.usrOpenID);
      }, 1000)
    }

    // 如果有微信openID，就向伺服器要使用者設定的星球資訊、使用者在職日數、姓名，並放入store中
    setTimeout(() => {
      if (this.props.usrOpenID === '' || this.props.usrOpenID === null) {
        // 沒有微信ID，则做出一颗基本星球，并跳到finalPage往上滑后

      } else {
        console.log("調用函數: {用微信ID項資料庫取得數據}")
        // 用微信ID項資料庫取得數據，並放入store中
        this.connectAndGetDataFromDataBase();

        // 若微信ID沒取得資料庫的數據，則設定store此人不在資料庫中

      }
    }, 500)

    // 微信分享文字和縮圖
    if(window.enableWeXinLogIn) {
      this.weiXinShareTextAndPicture();
    }
  }

  // 取得微信ID，並放入Store中
  getWeXinOpenIDFromWexin = () => {
    // 看一看網址中是否有微信跳轉code
    weXinJumpCode = this.getUrlPropertyAndValue('code');

    // 依照剛才看一看的結果，決定要跳轉去取code或直接拿code跟服務器拿openid
    if (weXinJumpCode == null || weXinJumpCode === '') {
      console.log("沒有微信openID，正在轉址");
      console.log('跳轉到網址: https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect')

      // 跳轉到微信取得授權網頁
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
    } else {
      console.log("有微信授權Code，開始向後台取得openID。  微信授權Code:" + weXinJumpCode);

      // 利用微信授權Code向伺服器取得openID
      axios('http://hvr.isunupcg.com/year2019/requestWeXinID.php', {
        params: {
          code: weXinJumpCode
        }
      }).then(resp => {
        let thisOpenID = resp.data[0].openID;

        // 在redux中更新openID，並顯示在console
        this.props.updateUsrOpenID(thisOpenID);
        console.log(thisOpenID);
        setTimeout(() => {
          console.log(this.props.usrOpenID);
        }, 1000)
      })
    }
  }

  // 微信分享文字和縮圖
  weiXinShareTextAndPicture = () => {
    GetSignP2({ url: window.location.href }).then(res => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.msg.appId, // 必填，公众号的唯一标识
        timestamp: res.msg.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.msg.nonceStr, // 必填，生成签名的随机串
        signature: res.msg.signature, // 必填，签名，见附录1
        jsApiList: ["showMenuItems", "onMenuShareTimeline", "onMenuShareAppMessage", "updateAppMessageShareData", "updateTimelineShareData"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ["showMenuItems"],
          success: function (res) {
            wx.showMenuItems({
              menuList: [
                "menuItem:share:appMessage",
                "menuItem:share:timeline"
              ]
            });
          }
        });
        wx.onMenuShareTimeline({ ////朋友圈
          title: "获取骄阳20周年庆抽奖号码", // 分享标题
          desc: "骄阳20周年，感谢有你同行。", // 分享描述
          link: 'http://hvr.isunupcg.com/sunupcg20years/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          // imgUrl: res.msg.imgUrl, // 分享图标
          imgUrl: 'https://p2static.oss-cn-beijing.aliyuncs.com/PlanetIcon.jpg', // 分享图标
          success: function (res) {
            console.log(res);
            // 用户确认分享后执行的回调函数
            console.log("分享成功！！！");
            // ShareBack({ share_id: _shareid, share_url: _href + '&s=2' }).then(res => {
            // })
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log("取消分享！！！");
          }
        });
        wx.onMenuShareAppMessage({ //朋友
          title: "获取骄阳20周年庆抽奖号码", // 分享标题
          desc: "骄阳20周年，感谢有你同行。", // 分享描述
          link: 'http://hvr.isunupcg.com/sunupcg20years/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          // imgUrl: res.msg.imgUrl, // 分享图标
          imgUrl: 'https://p2static.oss-cn-beijing.aliyuncs.com/PlanetIcon.jpg', // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
            console.log("分享成功！！！");
            // ShareBack({ share_id: _shareid, share_url: _href + '&s=1' }).then(res => { })
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
            console.log("取消分享！！！");
          }
        });
      })
    })
  }


  // 取得網址字串
  getUrlPropertyAndValue = (property) => {
    // 取得網址
    let getUrlString = window.location.href;

    // 將網址字串轉成URL
    let url = new URL(getUrlString);

    // 使用URL.searchParams + get 函式  (括弧裡面帶入欲取得結果的KEY鍵值參數)
    let result = url.searchParams.get(property);
    return result;
  }

  // 用微信ID項資料庫取得數據
  connectAndGetDataFromDataBase = () => {
    console.log('開始用微信openID向資料庫取得用戶的其他資訊');
    if (window.enableWeXinLogIn) {
      console.log(this.props.usrOpenID);
      // 驗證openID是否在資料庫中
      axios('http://hvr.isunupcg.com/year2019/thisPersonIsInDataBase.php', {
        params: {
          openID: this.props.usrOpenID
        },
        crossDomain: true
      }).then(resp => {
        console.log(resp.data);
        if (resp.data) {
          // 此人在資料庫中
          axios('http://hvr.isunupcg.com/year2019/contacts.php', {
            params: {
              openID: this.props.usrOpenID
            },
            crossDomain: true
          }).then(resp => {
            console.log(resp.data.user);
            console.log('成功得到用戶自訂星球訊息、在職天數、姓名');
            console.log('將取得的用戶訊息放入store中');
            this.props.updateFromServerUsrName(resp.data.user[0].name);
            this.props.updateFromServerUsrPlanetRadius(resp.data.user[0].planetRadius);
            this.props.updateFromServerPlanetTone(resp.data.user[0].planetTone);
            this.props.updateFromServerUsrPlanetMountainHeight(resp.data.user[0].planetMountainHeight);
            this.props.updateFromServerUsrPlanetMountainDensity(resp.data.user[0].planetMountainDensity);
            this.props.updateFromServerUsrWorkDays(resp.data.user[0].workDays);
            this.props.updateLotteryNumber(resp.data.user[0].lotteryNumber);
          })
        } else {
          console.log('伺服器說此人openid不在資料庫中，從伺服器回傳的值為:' + resp);
          // 此人不再資料庫中
          this.props.updateThisPersonIsInDataBase(false);
        }
      })
    } else {
      // console.log('因為關閉微信驗證功能，所以在app.js中直接將此人設定成不在資料庫中，並記錄在store');
      // this.props.updateThisPersonIsInDataBase(false);

      console.log('這是在測試模式，開始手動設定serverUsrName (有usrName才能結束載入頁)')
      this.props.updateFromServerUsrName('測試模式');
      this.props.updateFromServerUsrWorkDays('777');
    };
  }

  render() {
    return (
      <div className="App">

        {/* 事先載入圖片 */}
        <div className="preLoad" style={{ opacity: '0', pointerEvents: 'none' }}>
        </div>

        <div className={(this.props.bgAlignToRight) ? ("bg alignToRight") : ("bg")}>
          <img src={require('./images/BGCombine.jpg')} alt=''></img>
        </div>

        <div className="alwaysAlignToRightBg">
          <img src={require('./images/BGCombine.jpg')} alt=''></img>
        </div>

        {(this.props.loadingPageMounted) ? (<LoadingPage></LoadingPage>) : (null)}

        {(this.props.introPageMounted) ? (<IntroTextPage2></IntroTextPage2>) : (null)}

        {(this.props.finalPageMounted) ? (<FinalPage></FinalPage>) : (null)}

        {/* <BrowserRouter>
          <Switch>
            <Route path="/sunupcg20years" exact component={FinalPage}></Route>
            <Route path="/sunupcg20years/LoadingPage" exact component={LoadingPage}></Route>
            <Route path="/sunupcg20years/IntroTextPage2" component={IntroTextPage2}></Route>
            <Route path="/sunupcg20years/FinalPage" component={FinalPage}></Route>
          </Switch>
        </BrowserRouter> */}
      </div>
    )
  }
}

const mapDispatchToProps = {
  updateUsrOpenID,
  updateFromServerUsrName,
  updateFromServerUsrPlanetRadius,
  updateFromServerPlanetTone,
  updateFromServerUsrPlanetMountainHeight,
  updateFromServerUsrPlanetMountainDensity,
  updateFromServerUsrWorkDays,
  updateLotteryNumber,
  updateThisPersonIsInDataBase
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
