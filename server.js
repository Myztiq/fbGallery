var fbGallery = require('./fbGallery/fbGallery.js'),
http = require('http'),
express = require('express'),
app = express.createServer(
    express.bodyParser()
  , express.cookieParser()
  , express.session({ secret: 'Whoa, Pants' })
);

fbGallery.init("AAAECI9o4wTkBAJ8H2HYtvRIJZB6YCN26ud1q3bUFYqEYDqzkoG7IMehS69Cihc183dX5gsF6SPETkhRs7EkdF11rwhUcZD");
app.set('view engine', 'ejs');
app.set('view options', {
  layout: "layout.ejs"
});

app.get('/update',function(req,res){
  fbGallery.updatePhotoGalleries();
  res.send("Updating..");
});

app.get('/',function(req,res){
  fbGallery.getPhotoGalleries(function(galleries){
    res.render("gallery",{galleries:galleries});
  });
});

app.post('/gallery/:id',function(req,res){
  fbGallery.getPhotoGalleries(function(gallery){
    res.send(JSON.stringify(gallery));
  },req.params.id);
});

app.listen(8080);

console.log("Server Started");