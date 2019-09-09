import React, { useState, useEffect } from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {updateUsrOpenID,
updateFromServerUsrPlanetRadius,
updateFromServerPlanetTone,
updateFromServerUsrPlanetMountainHeight,
updateFromServerUsrPlanetMountainDensity} from './actions/actions.js';

import FinalPage from './components/FinalPage/FinalPage.jsx';
import LoadingPage from './components/LoadingPage/LoadingPage.jsx';
// import IntroTextPage from './components/IntroTextPage/IntroTextPage.jsx';
import IntroTextPage2 from './components/IntroTextPage2/IntroTextPage2.jsx';
import GetData from './components/GetData/GetData.jsx';
import axios from 'axios';

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
  }
}

function App() {
  const [openID, setOpenID] = useState(0);

  useEffect(() => {
    console.log('成功useeffect');

    if (window.enableWeXinLogIn) {
      // 重新導向獲得微信授權(Code)，有Code後在把Code傳給後端取得微信ID
      getWeXinOpenIDFromWexin();
    }

    setOpenID(111);
    console.log(openID);
  }, []);

  // 重新導向獲得微信授權(Code)，有Code後在把Code傳給後端取得微信ID
  let AppID = 'wx0db0332b2e95ff0e';   //公眾號ID
  let local = window.location.href;   //目前網頁的網址
  let weXinJumpCode;
  let weXinOpenID;
  let getWeXinOpenIDFromWexin = () => {
    // 看一看是否有微信跳轉code
    weXinJumpCode = getUrlPropertyAndValue('code');

    // 依照剛才看一看的結果，決定要跳轉去取code或直接拿code跟服務器拿openid
    if (weXinJumpCode == null || weXinJumpCode === '') {
      console.log("沒有微信openID，正在轉址");
      console.log('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect')

      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + AppID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
    } else {
      console.log("有微信授權Code，開始向後台取得openID。  微信授權Code:" + weXinJumpCode);
      axios('http://hvr.isunupcg.com/year2019/requestWeXinID.php', {
        params: {
          code: weXinJumpCode
        }
      }).then(resp => {
        // 將資料庫回傳的openID放入本專案的openID中
        setOpenID(resp.data[0].openID)
        console.log("本專案的openID:" + openID)

        // 在redux中更新openID，並顯示在console
        updateUsrOpenID(openID);
        console.log()
      })
    }
  }

  // 取得網址字串
  let getUrlPropertyAndValue = (property) => {
    // 取得網址
    let getUrlString = window.location.href;

    // 將網址字串轉成URL
    let url = new URL(getUrlString);

    // 使用URL.searchParams + get 函式  (括弧裡面帶入欲取得結果的KEY鍵值參數)
    let result = url.searchParams.get(property);
    return result;
  }

  return (
    <div className="App">
      {/* <GetData></GetData> */}

      <BrowserRouter>
        <Switch>
          <Route path="/sunupcg20years" exact component={FinalPage}></Route>
          <Route path="/sunupcg20years/LoadingPage" exact component={LoadingPage}></Route>
          {/* <Route path="/sunupcg20years/IntroTextPage" component={IntroTextPage}></Route> */}
          <Route path="/sunupcg20years/IntroTextPage2" component={IntroTextPage2}></Route>
          <Route path="/sunupcg20years/FinalPage" component={FinalPage}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

const mapDispatchToProps = {
  updateUsrOpenID,
  updateFromServerUsrPlanetRadius,
  updateFromServerPlanetTone,
  updateFromServerUsrPlanetMountainHeight,
  updateFromServerUsrPlanetMountainDensity
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
