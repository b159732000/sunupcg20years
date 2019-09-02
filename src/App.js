import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import FinalPage from './components/FinalPage/FinalPage.jsx';
import IntroTextPage from './components/IntroTextPage/IntroTextPage.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/sunupcg20years" exact component={FinalPage}></Route>
          <Route path="/sunupcg20years/IntroTextPage" component={IntroTextPage}></Route>
          <Route path="/sunupcg20years/FinalPage" component={FinalPage}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
