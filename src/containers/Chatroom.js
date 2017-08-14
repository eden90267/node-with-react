import React, { Component } from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import { findDOMNode } from 'react-dom';
import ChatList from '../components/ChatList.js';
import axios from 'axios';
import config from '../config.js';
import { browserHistory } from 'react-router'
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

const style = {
  container: {
    width: '95vw',
    height: '90vh',
    marginLeft: '2%'
  },
  MsgContent: {
    width: '80%',
    height: '90%',
    boxShadow: '10px 10px 5px #888888',
    overflowY: 'scroll'
  },
  MsgInputBlock: {
    width: '70%',
    height: '8%',
    boxShadow: '10px 10px 5px #888888',
    fontSize: '25px'
  },
  MsgInputBtn: {
    position: 'relative',
    width: '8%',
    height: '8%',
    boxShadow: '10px 10px 5px #888888',
    background: '#64FFDA',
    marginTop: '1%',
    top: '5px',
    left: '15px'
  },
  userList: {
    position: 'absolute',
    width: '15%',
    height: '200px',
    right: '5%',
    top: '60px'
  },
  newUserNotify: {
    position: 'absolute',
    background: 'gray',
    width: '100px',
    height: '30px',
    left: '40%',
    top: '10px',
    zIndex: '20000',
    textAlign: 'center',
    color: 'white'
  }
}

class Chatroom extends Component {
  constructor() {
    super();
    this.state = {
      users:{},
      msg:[],
      showWelcome: false,
      lastEnterUser: ''
    }
  }
  componentWillMount() {

  }  
  componentDidMount () {
     if(typeof window !== 'undefined') {
      window.onbeforeunload = myUnloadEvent;
        function myUnloadEvent() {
          socket.emit('close',document.cookie.replace(/(?:(?:^|.*;\s*)a1\s*\=\s*([^;]*).*$)|^.*$/, "$1"));//$1 表示為match到的第一個參數，可參考https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/n
      }
    }
    const context = this;
    axios.post('/getUser',{})
      .then(function (response) {
        if (response.data.result === -1) {
          if (browserHistory) { //for server side error
            browserHistory.push('/main');
          }
          sweetAlert('請先登入，才能進入聊天室');
          return
        };
        socket.emit('chatPage',{ //使用者進入聊天室
          avatar: response.data.avatar,
          name: response.data.name,
          account: response.data.account
        });
      })
      .catch(function (error) {
        console.log(error);
      });


    const divRef = findDOMNode(this.refs.contentDiv);

    socket.on('chat',(res) => { //使用者發表訊息
      let newList = this.state.msg;
      newList.push(res.data.content);
      context.setState({ msg: newList });
      /*保持捲軸在最下方新消息 */findDOMNode(divRef).scrollTop = findDOMNode(divRef).scrollHeight;
    })

    //用來顯示上方使用者加入聊天訊息框
    socket.on('userEnter', (res) => {
      this.setState({ lastEnterUser: res.user })
      this.setState({ showWelcome: true })
      setTimeout(() => {
        this.setState({ showWelcome: false });
      },2000)
    })

    socket.on('chatRoomUsers', (res) => {
      if(this.state.users !== res.user) {
        this.setState({ users: res.user });
      };
    })

    //加上Enter送出快捷鍵
    document.addEventListener("keypress", e => {
      if (e.key === 'Enter') {
        this.send();
      }
    });
  }
  send() {

    let item = {
      avatar: this.props.userInfo.avatar,
      name: this.props.userInfo.name,
      content: findDOMNode(this.refs.content).value,
      date: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    }

    socket.emit('chat',{content: item});
    findDOMNode(this.refs.content).value = "";
  }

  render() {
    const users = this.state.users;
    return (
      <div style={style.container}>

        {this.state.showWelcome ? <div style={style.newUserNotify}>{this.state.lastEnterUser}加入聊天</div> : ''}
        <div ref="contentDiv" style={style.MsgContent}>
        <ChatList msg={this.state.msg} />
        </div>
        <input ref="content" style={style.MsgInputBlock} />
        <button onClick={() => this.send()} style={style.MsgInputBtn}><SendIcon /></button>
        <div style={style.userList}>
        {      
          Object.keys(users).map(function(objectKey, index) {
              let name = users[objectKey].name;
              let avatar = users[objectKey].avatar;
              return (
                <IconButton key={index} tooltip={name}>
                  <Avatar src={avatar} />
                </IconButton>
              )
          })
        }
        </div>
      </div>
    )
  }

}
const mapStateToProp = (state) => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProp, {
  
})(Chatroom)
