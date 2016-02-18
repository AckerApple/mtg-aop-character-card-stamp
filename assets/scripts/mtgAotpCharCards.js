"use strict";

var demoCard = {
	colors:['w','b','u','r','g'],
	"symbolClass":'mi mi-planeswalk',
	"name":"Acker Apple",
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
			"body":"#{aotp-hexagon} #{aotp-defense} #{aotp-attack} #{mi mi-w} #{mi mi-u} #{mi mi-b} #{mi mi-r} #{mi mi-g} #{mi mi-c} #{mi mi-p} #{mi mi-s} #{mi mi-chaos} #{mi mi-tap} #{mi mi-creature} #{mi mi-planeswalker} #{mi mi-enchantment} #{mi mi-instant} #{mi mi-sorcery} #{mi mi-land} #{mi mi-artifact} #{mi mi-multiple} #{mi mi-planeswalk} #{mi mi-untap}  #{mi mi-mana mi-w} #{mi mi-mana mi-u} #{mi mi-mana mi-b} #{mi mi-mana mi-r} #{mi mi-mana mi-g} #{mi mi-mana mi-c} #{mi mi-mana mi-s} #{mi mi-w mi-mana mi-shadow} #{mi mi-u mi-mana mi-shadow} #{mi mi-b mi-mana mi-shadow} #{mi mi-r mi-mana mi-shadow} #{mi mi-g mi-mana mi-shadow} #{mi mi-c mi-mana mi-shadow} #{mi mi-s mi-mana mi-shadow} #{mi mi-p mi-mana-w} #{mi mi-p mi-mana-u} #{mi mi-p mi-mana-b} #{mi mi-p mi-mana-r} #{mi mi-p mi-mana-g} #{mi mi-p mi-mana-w mi-shadow} #{mi mi-p mi-mana-u mi-shadow} #{mi mi-p mi-mana-b mi-shadow} #{mi mi-p mi-mana-r mi-shadow} #{mi mi-p mi-mana-g mi-shadow} #{mi mi-mana mi-1} #{mi mi-mana mi-2} #{mi mi-mana mi-x} #{mi mi-mana mi-y} #{mi mi-mana mi-z} #{mi mi-mana mi-shadow mi-1} #{mi mi-mana mi-shadow mi-2} #{mi mi-mana mi-shadow mi-x} #{mi mi-mana mi-shadow mi-y} #{mi mi-mana mi-shadow mi-z} #{mi mi-tap mi-mana}"
		},{
			"title":"SNUFF OUT",
			"body":"Destory target squad creature that has 1 or more damage markers and is within 6 clear sight spaces of Liliana. Use this ability once per turn."
		}
	],
	"height":{
		"name":"Medium",
		"value":4
	},
	"cost":325,
	"artist":{"title":"Karla Ortiz"},
	"copyRight":"&copy; 2014 Hasbro TM & &copy; 2014 Wizards"
}

var cards = {
	"Liliana Vess, Necromancer":{
		"colors":['b'],
		"symbolClass":'mi mi-planeswalk',
		"name":"Liliana Vess, Necromancer",
		"category":"Planeswalker",
		"type":"Liliana",
		"life":7,
		"move":6,
		"range":6,
		"attack":4,
		"defense":3,
		"abilityArray":[
			{"title":"Zombie Toughness","body":"All Zombies you control within 4 clear sight spaces of Liliana get +1#{aotp-defense}."},
			{"title":"SNUFF OUT", "body":"Destory target squad creature that has 1 or more damage markers and is within 6 clear sight spaces of Liliana. Use this ability once per turn."}
		],
		"height":{
			"name":"Medium",
			"value":4
		},
		"cost":325,
		"artist":{"title":"Karla Ortiz"},
		"copyRight":"&copy; 2014 Hasbro TM & &copy; 2014 Wizards"
	},
	"Jace Beleren, Mindmage":{
		"colors":['u'],
		"name":"Jace Beleren, Mindmage",
		"category":"Planeswalker",
		"type":"Jace",
		"life":7,
		"move":6,
		"range":7,
		"attack":5,
		"defense":3,
		"height":{
			"name":"Medium",
			"value":4
		},
		"cost":340,
		"artist":{"title":"Karla Ortiz"},
		"copyRight":"&copy; 2014 Hasbro TM & &copy; 2014 Wizards"
	},
	"Kor Aeronaught Captain":{
		"colors":['w'],
		"name":"Kor Aeronaught Captain",
		"category":"Hero Creature",
		"type":"Kor Soldier",
		"life":6,
		"move":6,
		"range":1,
		"attack":6,
		"defense":3,
		"height":{
			"name":"Medium",
			"value":5
		},
		"cost":100,
		"artist":{"title":"Lu Hua"},
		"copyRight":"&copy; 2015 Hasbro TM & &copy; 2015 Wizards"
	},
	"Chandra Nalaar, Pyromancer":{
		"colors":['r'],
		"symbolClass":'mi mi-planeswalk',
		"name":"Chandra Nalaar, Pyromancer",
		"category":"Planeswalker",
		"type":"Chandra",
		"life":6,
		"move":6,
		"range":5,
		"attack":3,
		"defense":4,
		"abilityArray":[
			{"title":"Zombie Toughness","body":"All Zombies you control within 4 clear sight spaces of Liliana get +1#{aotp-defense}."},
			{"title":"SNUFF OUT", "body":"Destory target squad creature that has 1 or more damage markers and is within 6 clear sight spaces of Liliana. Use this ability once per turn."}
		],
		"height":{
			"name":"Medium",
			"value":4
		},
		"cost":365,
		"artist":{"title":""},
		"copyRight":"&copy; 2014 Hasbro TM & &copy; 2014 Wizards"
	},
	"Eldrazi Ruiner":{
		"colors":[],
		"symbolClass":'mi mi-planeswalk',
		"name":"Eldrazi Ruiner",
		"category":"Hero Creature",
		"type":"Eldrazi",
		"life":8,
		"move":5,
		"range":1,
		"attack":6,
		"defense":3,
		"abilityArray":[
			{"title":"Lash of Tentacles","body":"..."},
			{"title":"Otherworldy", "body":"..."},
			{"title":"Shepard of Scions", "body":"..."}
		],
		"height":{
			"name":"Huge",
			"value":10
		},
		"cost":150,
		"artist":{"title":"Raymond Swanland"},
		"copyRight":"&copy; 2015 Hasbro TM & &copy; 2015 Wizards"
	}
}

angular.module('mtgAotpCharCards',[])
.service('DemoCard',function($q){
	return {
		list:function(){
			return $q.resolve({data:angular.copy(demoCard)})
		}
	}
})
.service('CharCards',function($q){
	return {
		list:function(){
			return $q.resolve({data:cards})
		}
	}
})