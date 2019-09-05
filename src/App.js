import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import FinalPage from './components/FinalPage/FinalPage.jsx';
import LoadingPage from './components/LoadingPage/LoadingPage.jsx';
// import IntroTextPage from './components/IntroTextPage/IntroTextPage.jsx';
import IntroTextPage2 from './components/IntroTextPage2/IntroTextPage2.jsx';
import GetData from './components/GetData/GetData.jsx';

function App() {
  return (
    <div className="App">
        {/* <div className="IntroTextPageContainer" id="IntroTextPageContainer">
          <IntroTextPage></IntroTextPage>
        </div> */}
        <GetData></GetData>
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
  );
}

export default App;
