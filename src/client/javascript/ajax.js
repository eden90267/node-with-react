const http = require('http');

exports.post = function(option,data) {
   return new Promise(function(r,j){
     var post_options = {
           host: option.host,
           port: option.port,
           path: option.path,
           method: 'POST',
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
           }
       };
       if(typeof option.header !== 'undefined'){
         post_options.headers = option.header;
       }
       var post_req = http.request(post_options, function(res) {
           res.setEncoding('utf8');
           res.on('data', function (chunk) {
             r(chunk);
           });
       });
       post_req.write(data);
       post_req.end();
   })
 }

 exports.get = function(option,data) {
    return new Promise(function(r,j){
      var post_options = {
            host: option.host,
            port: option.port,
            path: option.path,
        };
        if(typeof option.header !== 'undefined'){
          post_options.headers = option.header;
        }

        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              r(chunk);
            });
        });
        post_req.write(data);
        post_req.end();
    })
  }
