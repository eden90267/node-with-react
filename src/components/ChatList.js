import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const style = {
  author: {
    fontSize: '10px',
    color: 'gray',
    textAlign: 'center'
  }
}

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const ChatList = (props) => (
  <div>
  {props.msg.map((i, idx) => (
    <List key={idx}>
      <ListItem
        leftAvatar = {
          <div >
            <Avatar src={i.avatar} />
            <div style={style.author}>{i.name}</div>
          </div>
        }>
        <div>
          <div >{i.content}</div>
          <div style={{position: 'relative', top: '0px', float: 'right'}}>{i.date}</div>
        </div>
      </ListItem>

     <Divider inset={true} />
    </List>
  ))
  }
  </div>
);

export default ChatList;
