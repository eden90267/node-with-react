import { User, Post } from './DB.js';
import { sendMail } from './utils/mail.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import axios from 'axios';
const { jwtSecret } = config; 


const authToken = (req, res, next) => {
	const token = req.cookies.t;
	if (token) {
		jwt.verify(req.cookies.t, jwtSecret, (err, decoded) => {
			if(decoded){
				next();
			} else {
				res.end('token not correct');
			}
	  });
	} else {
		res.end('no Token');
	}
}


exports.api = (app) => {
app.use('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type');
	res.header('Access-Control-Allow-Credentials', 'true');
  next();
 });

app.get('/getArticle',function(req, res){
	Post.find({}).sort({lastModify : -1})
  	.then(data => {
	  	 res.end(JSON.stringify(data))
		})
})


///這裡如發出get並且在server重啟第一次的情況，在login.js的getuser的get會延遲，但開devtool disable cache又不會，改成post則沒這問題
app.post('/getUser',function(req,res){
	if (req.session.user) {
		User.find({account:req.session.user},{_id:0,account:1,email:1,name:1,avatar:1,RegistedDate:1,mobile:1,address:1,hobby:1,birthday:1})
			.then(data => {
				res.end(JSON.stringify(data[0]));
			})
			.catch(err => console.log(err));
	} else {
		res.json({
			result: -1,
			message: '請先登入'
		})
	}
})
app.get('/checkLogin',(req,res) => {
	if(typeof req.session.user === 'string') {
		res.json({ login: true });
	}
})

//查詢使用者發佈的所有文章
app.get('/userArticles/:user',authToken,(req,res) => {
	Post.find({posterAccount: req.params.user})
	.then(data => {
  	 res.end(JSON.stringify(data))
	})
})

//以文章id查詢文章內容
app.get('/articles/:id', (req,res) => {
	Post.findOne({_id: req.params.id})
	.then(data => {
  	 res.end(JSON.stringify(data))
	})
})


app.get('/articles/title/:title', (req,res) => {
  let re = new RegExp(req.params.title, "g");
	Post.find({title: re })
	.then(data => {
  	 res.end(JSON.stringify(data))
	})
})

app.post('/login',function(req,res){
	User.find({account:req.body.account})
		.then(data => {
			if(data[0] === undefined) {
				res.end('帳號或密碼錯誤');
			}
			const md5  = crypto.createHash('md5');
			if (data[0].password === md5.update(req.body.password).digest('hex')) { //密碼正確
				//頁面判斷使用
			  res.cookie('ifUser',true, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: false });
				res.cookie('a1',req.body.account, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: false });
				//將會在cookie中存入token之後token回到server取值
				req.session.user = req.body.account;

				//jwt token
				let jwtpayload = data[0];
				jwtpayload.password = null;//移除密碼欄位，之後重要資訊時要求輸入密碼
				let token = jwt.sign({
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
					data: {
					user: jwtpayload
					}
				}, jwtSecret);
				res.cookie('t', token, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: true });
			  res.end('登入成功');
			}else{
				res.end('帳號或密碼錯誤');
			}
		})
})

app.post('/FBlogin', (req, res0) => {
	console.log(req.body.token)
   axios.get('https://graph.facebook.com/me?access_token='+req.body.token)
		.then(res => {
			if(typeof res.data.id !== 'undefined') {//FB access_token認證成功
				User.find({account: req.body.id})
					.then(data => {
						if(data[0] === undefined) {
							//第一次使用oauth 幫使用者註冊
							let user = new User({
								account: req.body.id,
								email: req.body.email,
								name: req.body.name,
								avatar: req.body.picture.data.url,
								RegistedDate: new Date(),
								mobile: '',
								address: '',
								hobby: '',
								birthday: ''
							});
							user.save()
							.catch(err => console.log(err));
							sendMail({ email: req.body.email })

							res0.cookie('ifUser',true, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: false });
							res0.cookie('a1',req.body.id, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: false });

							//將會在cookie中存入token之後token回到server取值
							req.session.user = req.body.id;
							//jwt token
							let jwtpayload = data[0];
							jwtpayload.password = null;//移除密碼欄位，之後重要資訊時要求輸入密碼
							let token = jwt.sign({
								exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
								data: {
								user: jwtpayload
								}
							}, jwtSecret);
							res0.cookie('t', token, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: true });
							res0.end('成功註冊');
							
						} else {
							User.find({account:req.body.id})
								.then(data => {

									res0.cookie('ifUser',true, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: false });
									res0.cookie('a1',req.body.id, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: false });
									//將會在cookie中存入token之後token回到server取值
									req.session.user = req.body.id;
									//jwt token
									let jwtpayload = data[0];
									jwtpayload.password = null;//移除密碼欄位，之後重要資訊時要求輸入密碼
									let token = jwt.sign({
										exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
										data: {
										user: jwtpayload
										}
									}, jwtSecret);
									res0.cookie('t', token, { maxAge: 1000 * 60 * 60 * 24 * 1, httpOnly: true });

									res0.json({
										result: 'ok',
										data
									})
								})		
						}
					})
					.catch(err => {
						console.log(err);
					})	
		}	
	});
}); 

app.post('/logout',function(req,res){
	res.cookie('ifUser',true, { expires: new Date() });
	res.cookie('t',true, { expires: new Date() });
	res.cookie('a1',true, { expires: new Date() });
	req.session.user = null;
	req.session.cookie.expires = new Date(Date.now());
	res.end();
})

app.post('/signup',function(req,res){
	User.find({account:req.body.account})
		.then(data => {
			if(data[0] !== undefined){
				res.end('此帳號已被註冊');
					throw new Error('此帳號已被註冊');
			}
		})
		.then(() => {
		User.find({email:req.body.email})
			.then(data => {
				if(data[0] !== undefined){
					res.end('此信箱已被使用');
					throw new Error('信箱重複');//以此方法來中斷then,記得寫catch
				}
			})
			.then(() => {
				let user = new User({
					account: req.body.account,
					password: crypto.createHash('md5').update(req.body.password).digest('hex'),
					email: req.body.email,
					name: req.body.nickName,
					avatar: `http://www.gravatar.com/avatar/${crypto.createHash('md5').update(req.body.email).digest('hex')}?s=120&d=identicon`,
					RegistedDate: new Date(),
					mobile: '',
					address: '',
					hobby: '',
					birthday: ''
				});
				user.save()
				.catch(err => console.log(err));

				sendMail({ email: req.body.email })
				res.end('成功註冊');
			})
			.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
})

app.post('/postArticle', authToken, function(req, res) {
			if(typeof req.session.user === 'string') {
				let post = new Post({
					posterAccount: req.body.account,
					author: req.body.name,
					title: req.body.title,
					content: req.body.content,
					avatar: req.body.avatar,
					PostDate: Date.now() + 1000 * 60 * 60 * 8, //因此預設為UTC+0 要改為UTC+8
					lastModify: Date.now() + 1000 * 60 * 60 * 8,
					//comments: ,  因為comment一開始為空的Array，所以可不寫
					tag: req.body.tag,
				});
				post.save()
				.then(() => {
					res.end('發表文章成功');
				})
				.catch(err => {
					res.end('發表文章錯誤');
				});
			}
});

app.put('/UpdateUserInfo',authToken,(req,res) => {
	User.update({account: req.body.account},{
		avatar: req.body.avatar,
		name: req.body.name,
		mobile: req.body.mobile,
		address: req.body.address,
		hobby: req.body.hobby,
		birthday: req.body.birthday,
	})
	.then(() => (
		res.end('更改成功')
	))
	.catch(err => {
		res.end('更改錯誤');
	});
})

app.put('/updateArticle',authToken,(req,res) => {
	Post.update({ _id: req.body.id },{ $set : {
		"content" : req.body.content,
		"lastModify" : Date.now() + 1000 * 60 * 60 * 8
		}})
		.then(data => {
			 res.end(JSON.stringify(data))
		})
})
app.put('/leavemsg',authToken,(req,res) => {
	Post.findOne({ _id: req.body.id })
	.then(data => {
		let newComments = data.comments;
		newComments.push({
			title : req.body.title,
			content : req.body.content,
			authorAccount : req.body.authorAccount,
			userAvatar: req.body.userAvatar,
			date: Date.now() + 1000 * 60 * 60 * 8
		})
	Post.update({ _id: req.body.id },{ $set : {
		comments: newComments,
		lastModify : Date.now() + 1000 * 60 * 60 * 8
		}})
		.then(data => {
			 res.end(JSON.stringify(data))
		})
	})

})




};

