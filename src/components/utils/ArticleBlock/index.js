import React from 'react';
if(typeof document !== 'undefined') {
  require ('./index.css');
}


const style = {
  title: {
    fontSize: '25px',
    color: 'black',
    marginTop: '20px',
    marginTop: '37px',
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  article: {
    borderBottom: '1px solid black',
    height: '100px',
    overflow: 'auto',
    display: 'flex',
    position: 'relative'
  },
  articleContainer: {
    height: '100%',
    width: '70%',
    margin:' 0 auto',
    marginTop: '100px'
  },
  date: {
    position: 'absolute',
    fontSize: '8px',
    right: '0px',
    bottom: '10px'
  },
  avatar: {
    width: '50px',
    height:'59px',
    marginTop: '30px',
    marginLeft: '20px'
  },
  author: {
    fontSize: '10px',
    color: 'gray'
  }
}

const ArticleBlock = (props) => (
  <div style={style.articleContainer}>
    {
      props.articles.map((i) => (
        <div onClick={(e) => props.articleClick(e,i._id)} className="articleBlock"  style={style.article} key={Math.random()}>
          <div style={style.avatar}>
            <img height="50px" width="60px" src={i.avatar} />
          </div>
          <div style={style.title}>
            <div>{i.title}</div>
            <div style={style.author}>作者：{i.author}</div>
          </div>
          {i.lastModify ? <div style={style.date}>最後修改：{(i.lastModify).replace(/[A-Z]/g, " ")}</div> : ''} {/*因一開始server side render 沒 article 所以會在replace出錯*/}
        </div>
      ))
    }
  </div>
)



export default ArticleBlock;
