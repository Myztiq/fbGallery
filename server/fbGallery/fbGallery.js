var accessToken = "",
  https = require('https'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

//Begin DB stuff
mongoose.connect('mongodb://localhost/fbGallery');

exports.init = function(accessToken1){
  accessToken = accessToken1;
}

exports.getPhotoGalleries = function(callback,galleryID){
  if(typeof galleryID == "undefined"){
    albumModel.find({}, function (err, docs) {
      callback(docs);
    });
  }else{
    albumModel.find({id:galleryID}, function (err, docs) {
      callback(docs);
    });
  }
}

exports.updatePhotoGalleries = function(){
  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: '/me/albums?access_token='+accessToken,
    method: 'GET'
  };
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function (chunk) {
      data += ""+chunk;
    });
    res.on('end', function () {
      if(res.statusCode == 200){
        var results = JSON.parse(data);
        for(var i=0;i<results.data.length;i++){
          if(results.data[i].privacy == "everyone"){
            var photoGallery = new albumModel();
            photoGallery.id = results.data[i].id;
            photoGallery.name = results.data[i].name;
            updateAlbumPhotos(photoGallery,results.data[i].cover_photo);
          }
        }
      }else{
        console.log(res.statusCode,data);
      }
    });
  });
  req.end();
}

function updateAlbumPhotos(photoGallery,coverID){
  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: '/'+photoGallery.id+'/photos?access_token='+accessToken,
    method: 'GET'
  };
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function (chunk) {
      data += ""+chunk;
    });
    res.on('end', function () {
      if(res.statusCode == 200){
        var results = JSON.parse(data);
        results = results.data;
        for(var i=0;i<results.length;i++){
          var photo = {
            id:results[i].id,
            large:{
              height: results[i].images[0].height,
              width: results[i].images[0].width,
              url: results[i].images[0].source
            },
            small:results[i].picture
          };
          photoGallery.photos.push(photo);
          if(results[i].id == coverID){
            photoGallery.coverPhoto.push(photo);
          }
        }
        albumModel.findOne({ id: photoGallery.id}, function (err, doc){
          if(doc != null){
            albumModel.remove({id:photoGallery.id},function(){
              photoGallery.save(function(err){
                if(err){
                  console.log(err);
                }else{
                  console.log("Save Complete");
                }
              });
            });
          }else{
            photoGallery.save(function(err){
              if(err){
                console.log(err);
              }else{
                console.log("Save Complete");
              }
            });
          }
        });
      }else{
        console.log(res.statusCode,data);
      }
    });
  });
  req.end();
}



var photoSchema = new Schema({
  id:{type:String, required:true},
  large: {
     height:Number,
     width:Number,
     url:String
  },
  small: {type:String},
  position: Number
});

var albumSchema = new Schema({
  id:{type:String, required:true,unique: true},
  coverPhoto: [photoSchema],
  name: String,
  photos: [photoSchema]
});
var albumModel = mongoose.model('album',albumSchema);