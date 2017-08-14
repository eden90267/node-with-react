import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MainNavBtn from 'material-ui/svg-icons/action/toc';
import { browserHistory } from 'react-router';

export default class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  toArticle = () => {
    browserHistory.push('/main')
    this.setState({open: false});
  }

    toa = () => {
      browserHistory.push('/chatroom')
      this.setState({open: false});
    }

  render() {
    return (
      <div>
        <IconButton tooltip="主選單" onTouchTap={this.handleToggle}>
          <MainNavBtn />
        </IconButton>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onTouchTap={this.toArticle}>文章</MenuItem>
          <MenuItem onTouchTap={this.toa}>在線聊天室</MenuItem>
        </Drawer>
      </div>
    );
  }
}
