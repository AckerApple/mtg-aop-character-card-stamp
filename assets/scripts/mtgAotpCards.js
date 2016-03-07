"use strict";

var demoCard = {
	colors:['w','b','u','r','g'],
	"name":"Acker Apple, Software Engineer",
	"category":"Planeswalker",
	"type":"Acker",
	"life":10,
	"move":10,
	"range":10,
	"attack":10,
	"defense":10,
	"abilityArray":[
		{
			"title":"Zombie Toughness",
			"body":"#{aotp aotp-artist-pawn} #{aotp aotp-attack} #{aotp aotp-defense} #{aotp aotp-hexagon} #{aotp aotp-squad} #{aotp aotp-zendikar} #{mi mi-w} #{mi mi-u} #{mi mi-b} #{mi mi-r} #{mi mi-g} #{mi mi-c} #{mi mi-p} #{mi mi-s} #{mi mi-chaos} #{mi mi-tap} #{mi mi-creature} #{mi mi-planeswalker} #{mi mi-enchantment} #{mi mi-instant} #{mi mi-sorcery} #{mi mi-land} #{mi mi-artifact} #{mi mi-multiple} #{mi mi-planeswalk} #{mi mi-untap}  #{mi mi-mana mi-w} #{mi mi-mana mi-u} #{mi mi-mana mi-b} #{mi mi-mana mi-r} #{mi mi-mana mi-g} #{mi mi-mana mi-c} #{mi mi-mana mi-s} #{mi mi-w mi-mana mi-shadow} #{mi mi-u mi-mana mi-shadow} #{mi mi-b mi-mana mi-shadow} #{mi mi-r mi-mana mi-shadow} #{mi mi-g mi-mana mi-shadow} #{mi mi-c mi-mana mi-shadow} #{mi mi-s mi-mana mi-shadow} #{mi mi-p mi-mana-w} #{mi mi-p mi-mana-u} #{mi mi-p mi-mana-b} #{mi mi-p mi-mana-r} #{mi mi-p mi-mana-g} #{mi mi-p mi-mana-w mi-shadow} #{mi mi-p mi-mana-u mi-shadow} #{mi mi-p mi-mana-b mi-shadow} #{mi mi-p mi-mana-r mi-shadow} #{mi mi-p mi-mana-g mi-shadow} #{mi mi-mana mi-1} #{mi mi-mana mi-2} #{mi mi-mana mi-x} #{mi mi-mana mi-y} #{mi mi-mana mi-z} #{mi mi-mana mi-shadow mi-1} #{mi mi-mana mi-shadow mi-2} #{mi mi-mana mi-shadow mi-x} #{mi mi-mana mi-shadow mi-y} #{mi mi-mana mi-shadow mi-z} #{mi mi-tap mi-mana}"
		}
	],
	"symbolClass":"aotp aotp-squad",
	"height":{
		"name":"Medium",
		"value":4
	},
	"cost":{value:325},
	"artist":{"iconClass":"aotp aotp-artist-pawn", "title":"Karla Ortiz"}
}

angular.module('mtgAotpCards',[])
.service('AotpDemoCharCard',function($q,$http){
	return {
		get:function(){
			return $q.resolve({data:angular.copy(demoCard)})
		}
	}
})
.service('AotpSeries',function($q,$http){
	return {
    get:function(id){
      return $http.get('cards/'+id+'.json')
      /*
      var cards = {
        "Battle for Zendikar":require('./Battle for Zendikar.json'),
        "Arena of the Planeswalkers":require('./Arena of the Planeswalkers.json')
      }
      return $q.resolve({data:cards[id]})
      */
    },
    list:function(){
      return $http.get('cards/index.json')
      /*
      var data = require('./cards.json')
      var data = require('./card-list.json')
      return $q.resolve({data:data})
      */
		}
	}
})