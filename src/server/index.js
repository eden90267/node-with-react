//讓Node.js的程式碼compile

require('babel-register')({
  presets: ['es2015', 'react', 'stage-0']
});
require('./server');
