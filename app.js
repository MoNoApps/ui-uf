var express = require('express');
var http = require('http');
var path = require('path');
var Unfuddle = require('uf').Unfuddle;
var uuid = require('uuid');
var LevelDB = require('./db/leveldb.js').LevelDB;
var ldb = new LevelDB();

var app = express();

// all environments
app.set('port', process.env.PORT || 1801);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/terms', function(req, res) {
	res.render('terms');
});

app.post('/api/login', function(req, res) {

	var user = "";
	req.on('data', function(data) {
		user += data;
	});

	req.on('end', function() {
		user = JSON.parse(user);

			var newKey = uuid.v4();
			var values = {
				username: user.username,
				password: user.password,
				domain: user.domain
			};

			//Test against API
			var uf =  new Unfuddle(user.username, user.password, user.domain);
			uf.project.find(function(data, err){
					if(err){
						res.json({data: false, err: err});
					}else{
						ldb.put(newKey, JSON.stringify(values), function(key, err){
								res.json({data: key, err: err});
						});
					}
			});
	});

});


app.get('/api/projects', function(req, res) {

	if(req.query.token){
		ldb.get(req.query.token, function(value, err){
				if(err){
					res.json({data: value, err: err});
				}else{
					var user = JSON.parse(value);
					var uf =  new Unfuddle(user.username, user.password, user.domain);

					//retrieve project list
					uf.project.find(function(data, err){
							res.json({projects:data, err:err});
					});
				}
		});
	}else{
		res.send(401);
	}

});

app.get('/api/project/:id/tickets', function(req, res) {

	if(req.query.token){
		ldb.get(req.query.token, function(value, err){
				if(err){
					res.json({data: value, err: err});
				}else{
					var user = JSON.parse(value);
					var uf =  new Unfuddle(user.username, user.password, user.domain);

					//retrieve ticket list
					uf.ticket.find(req.params.id,function(data, err){
							res.json({tickets:data, err:err});
					});
				}
		});
	}else{
		res.send(401);
	}

});

app.get('/api/project/:id/ticket/:tid/times', function(req, res) {

	if(req.query.token){
		ldb.get(req.query.token, function(value, err){
				if(err){
					res.json({data: value, err: err});
				}else{
					var user = JSON.parse(value);
					var uf =  new Unfuddle(user.username, user.password, user.domain);

					//retrieve ticket list
					uf.time.find(req.params.id,req.params.tid,function(data, err){
							res.json({times:data, err:err});
					});
				}
		});
	}else{
		res.send(401);
	}

});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
