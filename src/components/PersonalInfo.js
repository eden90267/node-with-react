import React,{Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import SimpleDialog from './utils/Dialogs/SimpleDialog.js';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { findDOMNode } from 'react-dom';

class PersonalInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      name: '',
      account: '',
      date: '',
      address: '',
      hobby: '',
      mobile: '',
      nameCheck : true,
      mobileCheck : true,
      addressCheck : true,
      hobbyCheck : true,
    }
  }
  componentWillReceiveProps(nextProps) {//重新整理使用，因componentWillMount時的this.props還沒抓到
    if (nextProps.userInfo !== 'undefined'){
      this.setState({ name: nextProps.userInfo.name})
      this.setState({ date: nextProps.userInfo.birthday})
      this.setState({ address: nextProps.userInfo.address})
      this.setState({ hobby: nextProps.userInfo.hobby})
      this.setState({ mobile: nextProps.userInfo.mobile})
    }
  }
  componentWillMount() {//切換元件時使用，因componentWillReceiveProps不會再切換元件時觸發，但每次切換元件state會重置
      this.setState({ name: this.props.userInfo.name})
      this.setState({ date: this.props.userInfo.birthday})
      this.setState({ address: this.props.userInfo.address})
      this.setState({ hobby: this.props.userInfo.hobby})
      this.setState({ mobile: this.props.userInfo.mobile})
  }

  check(e,type) {
    if (e.target.value === ''){
      this.setState({ [type]: false })
      return
    }
    this.setState({ [type]: true })
  }
  sendRequest() {
    axios.put('/UpdateUserInfo',{
      account: this.props.userInfo.account,
      avatar: this.props.userInfo.avatar,
      name: this.state.name,
      mobile: this.state.mobile,
      address: this.state.address,
      hobby: this.state.hobby,
      birthday: this.state.date,
    })
    .then(response => (
      alert(response.data)
    ))
  }

  componentDidMount () {

    const context = this;
    findDOMNode(this.refs.fileInput).addEventListener("change",() => {
      if (findDOMNode(this.refs.fileInput).files && findDOMNode(this.refs.fileInput).files[0]) {
        var FR= new FileReader();
        FR.onload = function(e) {
          let base64 = e.target.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
          console.log(base64)
          var xhttp = new XMLHttpRequest();
          xhttp.open('POST','https://api.imgur.com/3/image',true)
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.setRequestHeader("Authorization", "Client-ID b50a7351eee91f0");
          xhttp.send(JSON.stringify({'image': base64}));
          xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
              let avatarSrc = JSON.parse(xhttp.responseText).data.link;
              findDOMNode(context.refs.avatar).src = avatarSrc;
              axios.put('/UpdateUserInfo',{
                avatar: avatarSrc,
                account: context.props.userInfo.account,
                name: context.state.name,
                mobile: context.state.mobile,
                address: context.state.address,
                hobby: context.state.hobby,
                birthday: context.state.date,
              })
              .then((res) => {
                console.log(res.data)
                location.reload();
              })
            }
          };
        };
        FR.readAsDataURL(findDOMNode(this.refs.fileInput).files[0]);
      };
    });
  }
  changeText(e,type) {
     this.setState({ [type]: e.target.value })
  }
  render() {
    return (
        <div style={style.container}>
          <div style={style.left}>
            { this.props.userInfo.avatar
              ?
            <img ref="avatar" height="200px" src={this.props.userInfo.avatar} />
              :
            ''
            }
            <input style={style.fileInput} id="file-upload" ref="fileInput" type='file' />
          </div>
          <div style={style.fieldContainer}>
          <TextField
            onBlur = {(e) => this.check(e,'nameCheck') }
            hintText="暱稱"
            onChange={(e) => this.changeText(e,'name')}
            value={this.state.name}
            floatingLabelStyle={{color: 'gray'}}
            errorText={ this.state.nameCheck ? '' : 'This field is required' }
            floatingLabelText="暱稱"
          /><br />
          <TextField
            onBlur = {(e) => this.check(e,'mobileCheck') }
            hintText="手機"
            value={this.state.mobile}
            floatingLabelStyle={{color: 'gray'}}
            onChange={ (e) => this.changeText(e,'mobile') }
            errorText={ this.state.mobileCheck ? '' : 'This field is required' }
            floatingLabelText="手機"
          /><br />
          <TextField
            onBlur = {(e) => this.check(e,'addressCheck') }
            hintText="地址"
            value={this.state.address}
            floatingLabelStyle={{color: 'gray'}}
            onChange={ (e) => this.changeText(e,'address') }
            errorText={ this.state.addressCheck ? '' : 'This field is required or Not match password' }
            floatingLabelText="地址"
          /><br />
          <TextField
            onBlur = {(e) => this.check(e,'hobbyCheck') }
            hintText="興趣"
            value={this.state.hobby}
            floatingLabelStyle={{color: 'gray'}}
            onChange={ (e) => this.changeText(e,'hobby') }
            errorText={ this.state.hobbyCheck ? '' : 'This field is required or Wrong email format' }
            floatingLabelText="興趣"
          /><br /><br /><br />
          <TextField
            hintText=""
            type="date"
            id="date1"
            value={ this.state.date }
            onChange={ (e) => this.changeText(e,'date') }
            floatingLabelStyle={{color: 'gray'}}
            floatingLabelText=""
          /><br />
         </div>
          <RaisedButton
            onClick={() => this.sendRequest()}
            label="設定完成" primary={true}
            style={style.ok}
          />
          { this.state.dialog ? <SimpleDialog content={this.state.dialogText} context={this} /> : '' }
        </div>
      )
  }
}

const style = {
  container: {
    textAlign: 'center',
  },
  avatar: {
  },
  fieldContainer: {
    marginLeft: '400px',
    marginTop: '80px'
  },
  ok: {
    marginTop: '60px',
    marginLeft: '-40px',
    marginBottom: '100px'
  },
  text: {
    textAlign: 'center',
    fontSize: '50px',
    marginTop: '200px'
  },
  fileInput: {
    marginTop: '20px'
  },
  left: {
    position: 'absolute',
    top: '180px',
    left: '20%',
    display: 'flex',
    flexDirection: 'column'
  }
}

const mapStateToProp = (state) => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProp,{
})(PersonalInfo)
