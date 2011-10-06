var userID = "",
  accessToken = "",
  https = require('https');

exports.init = function(userID1,accessToken1){
  userID = userID1;
  accessToken = accessToken1;
}

exports.getPhotogalleries = function(callback){
  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: "/"+userID+'/albums?access_token='+accessToken,
    method: 'GET'
  };
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function (chunk) {
      data += ""+chunk;
    });
    res.on('end', function () {
      var results = JSON.parse(data);
      parsePhotoGalleryArray(results.data,callback);
    });
  });
  req.end();
}

var pagesToProcess = 0;
var photoGalleries = [];
function parsePhotoGalleryArray(data,callback){
  pagesToProcess = data.length;
  for(var i=0;i<data.length;i++){
    if(data[i].privacy == "everyone"){
      var photoGallery = {
        id:data[i].id,
        coverPhotoID:data[i].cover_photo,
        name:data[i].name
      };
      photos: exports.getAlbumPhotos(photoGallery,callback)
    }else{
      pagesToProcess--;
    }
  }
  if(pagesToProcess == 0){
    callback(photoGalleries);
  }
}

exports.getAlbumPhotos = function(photoGallery,cb){
  pagesToProcess--;
  photoGalleries.push(photoGallery);
  if(pagesToProcess == 0){
    cb(photoGalleries);
  }
}