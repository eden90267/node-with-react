import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

// confirm 點擊確認後的callback
//
// close 用來dispatch wainting = false 的action
//
// <SimpleDialog context={this} />  注意，必須給入context
//
//在context 加上 state  : dialog   dialogText
//
//        {
//           this.state.dialog
//           ?
//           <SimpleDialog context={this} />
//           :
//           ''
//         }
//
export default class SimpleDialog extends React.Component {
  state = {
    open: true,
  };


  handleClose = () => {
    this.props.context.setState({ dialog:false });
    if(typeof this.props.close !== 'undefined') {
      this.props.close();//dispatch  action
    }
    if(typeof this.props.confirm !== 'undefined') {
      this.props.confirm();
    };
  };

  render() {
    const actions = [
      <FlatButton
        label="確定"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title="提示"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.props.context.state.dialogText}
        </Dialog>
      </div>
    );
  }
}
