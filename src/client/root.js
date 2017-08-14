import React from 'react';
import {Router, browserHistory, Route, IndexRoute} from 'react-router';
import App from '../containers/App'
import Main from '../containers/Main.js'
import Login from '../components/Login.js'
import Register from '../components/Register.js'
import PersonalInfo from '../components/PersonalInfo.js'
import MyArticle from '../components/MyArticle.js'
import Chatroom from '../containers/Chatroom.js'

export default (
      <Router history={browserHistory} component={App}>
        <Route path="/" component={App} />
        <Route path="/chatroom" component={Chatroom} />
        <Route path="/main" component={Main} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/personalinfo" component={PersonalInfo} />
        <Route path="/myarticle" component={MyArticle} />
      </Router>
);
