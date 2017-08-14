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

const ListMsg = (props) => (
  <div>
  {props.comments.map(i => (
    <List key={i}>
      <ListItem
        leftAvatar = {
          <div>
            <Avatar src={i.userAvatar} />
            <div style={style.author}>{i.authorAccount}</div>
          </div>
        }>
        <div>
          <div style={{color: 'gray'}}>{i.title}</div>
          <div style={{marginTop: '10px'}}>{i.content}</div>
        </div>
      </ListItem>

     <Divider inset={true} />
    </List>
  ))
  }
  </div>
);

export default ListMsg;
