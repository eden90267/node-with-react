import React from 'react';

if(typeof document !== 'undefined') {
  require ('./index.css');
}

const Loading = (props) => (
  <div className="spinner" style={props.style}>
    <div className="rect1"></div>
    <div className="rect2"></div>
    <div className="rect3"></div>
    <div className="rect4"></div>
    <div className="rect5"></div>
    <div className="rect6"></div>
  </div>
)

export default Loading;
