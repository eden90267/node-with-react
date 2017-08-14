import mongoose from 'mongoose';
import config from '../config.js';

mongoose.connect(config.dbURL,function(err){
	if(err){throw err};
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connect mongo")
});

//用戶註冊
exports.User = mongoose.model('users', new mongoose.Schema({
	account:{type: String, unique: true},
	password: String,
  email: {type: String, unique: true},
  name: String,
	avatar: String,
  RegistedDate: String,
	mobile: String,
	address: String,
	hobby: String,
	birthday: String
}));
//發表文章
exports.Post = mongoose.model('articles', new mongoose.Schema({
	posterAccount: String,
	author: String,
	title: String,
  content: String,
	avatar: String,
  PostDate: Date,
	lastModify: Date,
	comments: Array,
	tag: String
}));
