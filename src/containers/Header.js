import React, {Component} from 'react'
import {connect} from 'react-redux'
import actions from '../redux/actions/userInfo.js'
import Navbar from '../components/Navbar'
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router'
import Menu from '../components/utils/Menu.js'
import {getCookie} from '../client/javascript/cookie.js'
import axios from 'axios';
import Loading from '../components/utils/Loading/'

class Header extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      loading: false,
      userAvatar: ''
    }
  }

  componentDidMount() {
    const context = this;
    socket.on('logout', () => {
      axios
        .post('/logout', {})
        .then(function (response) {
          context.setState({loading: false});
          context.props.logout();
          browserHistory.push('/login')
        })
        .catch(function (error) {
          console.log(error);
        });
    });

    socket.on('toMainPage', () => {
      browserHistory.push('/main')
    });


///////////////////////////////


    window.fbAsyncInit = function () {
      FB.init({
        appId: '261506454353888',
        cookie: true,  // enable cookies to allow the server to access
        xfbml: true,  // parse social plugins on this page
        version: 'v2.8' // use graph api version 2.8
      });
    };
  }

  statusChangeCallback = (response) => {
    console.log(response);
    if (response.status === 'connected') { //使用者登入FB且認證你的APP了
      console.log('connett FB')
      this.testAPI(response.authResponse.accessToken);
    } else if (response.status === 'not_authorized') { //使用者登入了FB但還沒對你的APP認證
      console.log('not_authorized')
      FB.login((response) => {
        this.testAPI(response.authResponse.accessToken);
      });
    } else {   //使用者還沒登入ＦＢ
      FB.login((response) => {
        this.testAPI(response.authResponse.accessToken);
      });
      console.log('not login')
    }
  };

  testAPI = (token) => {
    const context = this;
    FB.api('/me', {
      access_token: token,
      fields: 'name,id,email,picture.width(640)'
    }, (res) => {
      // 把資料先傳給後端，看使用者是否註冊過，如第一次則註冊使用者並登入，之後則直接登入
      console.log(res);
      axios.post('/FBlogin', Object.assign(res, {token}))
        .then(response => {
          console.log(response.data);
          if (response.data.result === 'ok') {
            if (localStorage.getItem('reloadFlag') === 'false') {
              localStorage.setItem('reloadFlag', true);
              browserHistory.push('/main');
              axios.post('/getUser', {})
                .then(function (response) {
                  context.setState({loading: false});
                  console.log(response.data)
                  if (response.data.result !== -1) {
                    //login時先把其他登入的裝置登出
                    socket.emit('logout', context.state.account);
                    //自己登入
                    socket.emit('login', response.data);
                    context.props.userInfoAction(response.data);
                    browserHistory.push('/main');
                  }
                })
            }
          }
        })
    });
  };

  login = () => {
    browserHistory.push('/login')
  };

  register = () => {
    browserHistory.push('/register')
  };

  logout = () => {
    const context = this;
    this.setState({loading: true});
    localStorage.setItem('reloadFlag', false);
    //登出時讓所有裝置登出
    socket.emit('logout', this.props.userInfo.account);
    //包含自己登出
    axios.post('/logout', {})
      .then(function (response) {
        context.setState({loading: false});
        context.props.logout();
        browserHistory.push('/login')
      })
      .catch(function (error) {
        console.log(error);
      })
  };

  FBlogin() {
    const context = this;
    this.setState({loading: true});
    FB.getLoginStatus(function (response) {
      context.statusChangeCallback(response);
    });
  }

  render() {
    return (
      <div style={style.container}>
        <Navbar/>
        {
          getCookie('ifUser') === 'true'
            ?
            <div style={style.menu}>
              {
                this.state.loading
                  ?
                  <Loading style={{marginTop: '0px'}}/>
                  :
                  <Menu logout={() => this.logout()} title={this.props.userInfo.name || ''}/>
              }
            </div>
            :
            <div>
              {
                this.state.loading
                  ?
                  <Loading style={{position: 'absolute', right: '-50px', top: '-100px'}}/>
                  :
                  <div>
                    <RaisedButton onClick={() => this.login()} label="登入" style={style.login}/>
                    <RaisedButton onClick={() => this.register()} label="註冊" style={style.register}/>
                    <RaisedButton onClick={() => this.FBlogin()} labelColor="white" label="臉書登入" style={style.FBbutton}
                                  backgroundColor="#31589c"/>
                  </div>
              }
            </div>
        }
      </div>
    )
  }
}

const style = {
  container: {
    width: '100%',
    height: '48px',
    background: 'white',
    boxShadow: '4px 4px 9px #888888',
    position: 'fixed',
    top: '0px',
    zIndex: '10000'
  },
  login: {
    float: 'right',
    marginTop: '-43px',
    marginRight: '20px'
  },
  register: {
    float: 'right',
    marginTop: '-43px',
    marginRight: '140px'
  },
  menu: {
    marginTop: '-50px',
    float: 'right',
  },
  FBbutton: {
    float: 'right',
    marginRight: '2%',
    marginTop: '5px',
    width: '100px',
    height: '30px',
    color: 'white',
    textAlign: 'center',
    lineHeight: '30px'
  }
};

function mapStateToProp(state) {
  return ({
    userInfo: state.userInfo
  })
}

export default connect(mapStateToProp, {
  logout: actions.logOut,
  userInfoAction: actions.userInfo,
})(Header);
