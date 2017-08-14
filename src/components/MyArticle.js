import React,{ Component } from 'react';
import { connect } from 'react-redux'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import axios from 'axios';
import Loading from '../components/utils/Loading/'
import ArticleContentModal from './utils/Dialogs/ArticleContentModal.js';
import { editArticle } from '../redux/actions/article.js'

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="選單"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const rightIconMenu = (context,article) => (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem onClick={() => context.clickArticle(article._id)}>修改</MenuItem>
    <MenuItem>刪除</MenuItem>
  </IconMenu>
);


class MyArticle extends Component {
  constructor(props) {
    super();
    this.state = {
      userInfoFlag: true, //  componentWillReceiveProps會接到多次，所以確保不重複dispatch 加flag
      articles: [],
      loading: true,
      articleContentModal: false,
      activeArticle: '',
      content: ''
    }
  }
  clickArticle(id) {
    this.setState({ articleContentModal: true })
    this.state.articles.forEach( i => {
      if (i._id === id ){
        this.setState({ activeArticle: i })
      }
    })
  }
  componentWillMount() {
    if (this.props.userInfo) {
        axios.get('/userArticles/' + this.props.userInfo.account)
        .then((response) => {
          this.setState({ articles: response.data })
          this.setState({ loading: false })
        })
      }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.userInfo) {
      if (this.state.userInfoFlag) {
        this.setState({ userInfoFlag: false})
        axios.get('/userArticles/' + nextProps.userInfo.account)
        .then((response) => {
          this.setState({ articles: response.data })
          this.setState({ loading: false })
        })
      }
    }
  }
  // contentInput = (e) => {
  //   this.setState({ content: e.target.value });
  //   console.log(e)
  // }
  handleConfirm = () => {
    const contentRef = this.refs.content1.refs.div1.innerHTML;
    const articleID = this.state.activeArticle._id;
    this.setState({ articleContentModal: false })
    this.setState({ loading: true })
    axios.put('/updateArticle',{
      content: contentRef,
      id: articleID
    })
    .then((response) => {
      //更新reducer
      this.props.editArticle({
        content: contentRef,
        id: articleID
      });
      axios.get('/userArticles/' + this.props.userInfo.account)
      .then((response) => {
        this.setState({ loading: false })
        this.setState({ articles: response.data });
      })
    })
  }
  render() {
    return (
      <div>
        <List>
        <Subheader>文章列表</Subheader>

        {this.state.loading ? <Loading /> : ''}

        { this.state.articleContentModal
          ?
          <ArticleContentModal
            ref="content1"
            contentInput={(e) => this.contentInput(e)}
            contentEditable={true}
            user={this.props.user}
            context={this}
            activeArticle={this.state.activeArticle}
            confirmBtn={true}
          />
          :
          ''
        }

        {this.state.articles.map((article,idx) => {
          return (
            <div  key={idx}>
            <ListItem
              rightIconButton={rightIconMenu(this,article)}
              primaryText={'作者：' + article.author}
              secondaryText={
                <p>
                  <span style={{color: darkBlack}}>標題：{article.title}</span><br />
                  發表時間：{article.PostDate}
                </p>
              }
              secondaryTextLines={2}
            />
            <Divider inset={true} />
            </div>
          )
        })}
      </List>
      </div>
    )
  }
}

const mapStateToProp = (state) => ({
  userInfo: state.userInfo,
  articles: state.article,
})

export default connect(mapStateToProp,{
  editArticle
})(MyArticle)
