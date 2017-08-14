import nodemailer from 'nodemailer';
import config from '../../config.js'

exports.sendMail = (data) => {
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: config.email,
	        pass: config.pass
	    }
	});

	var mailOptions = {
	    from: config.email, // sender address
	    to: data.email, // list of receivers
	    subject: '註冊成功✔', // Subject line
	    text: '註冊成功了', // plaintext body
	    html: '<b>恭喜您✔</b>' // html body
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	    }
	});
};
