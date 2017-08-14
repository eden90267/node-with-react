import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../redux/actions/userInfo.js'
import Header from './Header.js'
import axios from 'axios';
import SimpleDialog from '../components/utils/Dialogs/SimpleDialog.js';
import config from '../config.js';

import { browserHistory } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '2343333',
      account: ''
    }
  }

  componentDidMount() {
    if(localStorage.getItem('reloadFlag')) {  
      localStorage.setItem('reloadFlag', false);
    }
    //fb sdk import
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=261506454353888";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

////////////////////////////////////

    const context = this;
    axios.post('/getUser',{})
      .then(function (response) {
        if(response.data.result === -1){
          return //未登入
        }
        socket.emit('logout',context.state.account);
        socket.emit('login',response.data)
        context.props.userInfoAction(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Header />
        <div style={style.content}>
        {this.props.children}
        </div>
      </div>
    )
  }

}
const style = {
  content: {
    marginTop: "48px",
  }
}

function  mapStateToProp(state){
	return {
    userInfo: state.userInfo
  }
}

export default connect(mapStateToProp,{
  userInfoAction:actions.userInfo,
})(App)
