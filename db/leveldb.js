var levelup = require('levelup');
var dbpath = require('../config.json').leveldb;


var LevelDB = function(){};

LevelDB.prototype.put = function(key,value,cb){
  var db = levelup(dbpath);
  db.put(key, value, function(err) {
    db.close(function(){
      cb(key, err);
    });
  });
};

LevelDB.prototype.get = function(key, cb){
  var db = levelup(dbpath);
  db.get(key, function(err, value) {
    db.close(function(){
      cb(value, err);
    });
  });
};

LevelDB.prototype.del = function(key, cb){
  var db = levelup(dbpath);
  db.del(key, function(err) {
    db.close(function(){
      cb('deleted',err);
    });
  });
};

exports.LevelDB = LevelDB;
