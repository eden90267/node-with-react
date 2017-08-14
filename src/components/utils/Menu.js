import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { browserHistory } from 'react-router';

const styles = {
  customWidth: {
    width: 250,
  },
};

export default class DropDownMenuSimpleExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: 1};
  }

  handleChange = (event, index, value) => {

    console.log(index)
    switch (index) {
      case 1:
        browserHistory.push('/personalinfo');
        return
      case 2:
        browserHistory.push('/myarticle');
        return
      case 3:
        this.props.logout();
        return
      default:return
    }
  };

  render() {
    return (
      <div>
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          style={styles.customWidth}
          autoWidth={false}
        >
          <MenuItem value={1} primaryText={ `使用者： ${this.props.title}` } />
          <MenuItem value={2} primaryText="個人資料設定" />
          <MenuItem value={3} primaryText="我的文章" />
          <MenuItem value={4} primaryText="登出" />
        </DropDownMenu>
      </div>
    );
  }
}
