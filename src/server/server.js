//引入及初始化Express
var express = require('express');
var app = express();

//引入socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

//引入自訂的相關config設定
import config1 from '../config.js';

//引入webpack
var path = require('path');
var config = require('../../webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo:true,publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

//引用Express中解析Post的body與cookie的模組
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');



//使用axios(一個簡單發出http request的第三方模組)
import axios from 'axios';

//Express 中間件的使用
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//引入Express 第三方的session中間件，用來儲存使用者登入session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
	saveUninitialized: false, // don't create session until something stored
  resave: true, //don't save session if unmodified
  secret: 'yicheng',
  key: 'auth_token',//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 1},//1 days
  store: new MongoStore({
		url: config1.dbURL
  })
}));


//Redis
import Redis from './redis';
Redis();

//SOCKET.IO
import { socketio } from './io.js';
socketio(io, axios, config1);

//引入API
import { api } from './api.js';
api(app);

//引入React
import React from 'react';

//因此為React server side render所以需要將client端的router與redux的store引入
import {renderToString} from 'react-dom/server';
import {RouterContext, match, createRoutes} from 'react-router';
import root from '../client/root.js';
const routes = createRoutes(root);
import {Provider} from 'react-redux'
import {configureStore} from '../redux/store'

//Material UI在 server side render時所需要引入的內容(官網可參考)
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();



//以下為React server side render的基本配備
app.get('*',(req, res) => {

  //設定Redux一開始的state，用來直接server side render資料
	let initialState = {
			userInfo:{
				login:false
			},
			article: []
	}
	
	axios.get(`http://localhost:3001/getArticle`)//axios在isomophic的情況中須加上完整域名
		.then(response => {
			//把ajax後的資料放入上面的initialState，並給server做render
			initialState.article = response.data; 
			const store = configureStore(initialState);

     //Material UI 在server side render時所要求
			const muiTheme = getMuiTheme({  
				userAgent: req.headers['user-agent'],
			});

      //server 根據http status code決定要做什麼處理
			match({routes, location: req.url}, (error, redirectLocation, renderProps) => {
				if (error) {
					res.status(500).send(error.message);
				} else if (redirectLocation) {
					res.redirect(302, redirectLocation.pathname + redirectLocation.search);
				} else if (renderProps) {
					//使用renderToString 把React component轉為string以做Server side render
					const content = renderToString(
						<Provider store={store}>
							<MuiThemeProvider muiTheme={muiTheme}>
								<RouterContext {...renderProps} />
							</MuiThemeProvider>
						</Provider>
					);
					let state = store.getState();
					let page = renderFullPage(content, state); //把html與state做結合
					return res.status(200).send(page); //把我們的html送出到client端
				} else {
					res.status(404).send('Not Found');
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.end(err);
		});
})

const renderFullPage = (html, preloadedState) => (`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">
  <title>範例實作</title>
	<link rel="stylesheet" type="text/css" href="/css/reset.css">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
	<script src="/socket.io/socket.io.js"></script>
  <script></script>
	<script>
	  var socket = io.connect();
	</script>
</head>
<body>
<div id="fb-root"></div>

  <div id="app">${html}</div>  
  <script>
  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
   </script>
  <script src="bundle.js"></script>
</body>
</html>
`
);

var port = 3001;

http.listen(port,'127.0.0.1', function(error) {
  if (error) throw error;
  console.log("Express server listening on port", port);
});
