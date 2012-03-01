var fbGallery = require('./fbGallery/fbGallery.js'),
http = require('http'),
express = require('express'),
stylus = require('stylus'),
app = express.createServer();

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'Whoa, Pants' }));

  app.set('views', __dirname + '/../browser/views');
  app.use(stylus.middleware({
    src: __dirname + '/../browser',
    compile: function(str, path) { // optional, but recommended
      return stylus(str)
      .set('filename', path)
      .set('warn', true)
      .set('compress', true);
    }
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/../browser'));
});

fbGallery.init("Enter your code here");
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