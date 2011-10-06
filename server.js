var fbGallery = require('./fbGallery/fbGallery.js'),
http = require('http'),
express = require('express'),
app = express.createServer(
    express.bodyParser()
  , express.cookieParser()
  , express.session({ secret: 'Whoa, Pants' })
);

fbGallery.init("kahnr","AAAECI9o4wTkBAJ8H2HYtvRIJZB6YCN26ud1q3bUFYqEYDqzkoG7IMehS69Cihc183dX5gsF6SPETkhRs7EkdF11rwhUcZD");
app.get('/',function(req,res){
  fbGallery.getPhotogalleries(function(photoGalleries){
    console.log(photoGalleries);
  });
  res.send("HEllo!");
});

app.listen(8080);

console.log("Server Started");