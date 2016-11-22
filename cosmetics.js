var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var cosmetic = [];
var cosmeticNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('About cosmetics!');
});


app.get('/cosmetic', function(req, res){
		var summa = 0;
		var sum=0;

	for(var i=0; i<cosmetic.length; i++)
	{
		sum =cosmetic[i].price-cosmetic[i].price*cosmetic[i].discount;
		summa+=sum;
	}
	res.send(JSON.stringify(cosmetic,null,4)+"\n Общая сумма заказа с учетом скидок: "+summa);
});


app.get('/cosmetic/:id', function(req, res){
	var cosmeticsID = parseInt(req.params.id, 10);
	var matchedCosmetics = _.findWhere(cosmetic, {id: cosmeticsID});

	if(matchedCosmetics){
		res.json(matchedCosmetics);
	}else{
		res.status(404).send();
	}
});

app.post('/cosmetic', function(req, res){
	var body = _.pick(req.body, 'marka','name','price','discount');

	if(!_.isString(body.marka) || !_.isString(body.name) || !_.isNumber(body.price) || !_.isNumber(body.discount) || body.name.trim().length === 0){
		return res.status(400).send();
	}

	body.marka = body.marka.trim();
	body.name = body.name.trim();
	body.id = cosmeticNextId++;

	cosmetic.push(body);

	res.json(body);
});

app.delete('/cosmetic/:id', function(req,res){
	var cosmeticsID = parseInt(req.params.id,10);
	var matchedCosmetics = _.findWhere(cosmetic, {id: cosmeticsID});

	if(!matchedCosmetics){
		res.status(404).json({"error": "no cosmetics found with that id"});
	}else{
		cosmetic = _.without(cosmetic, matchedCosmetics);
		res.json(matchedCosmetics);
	}
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});
