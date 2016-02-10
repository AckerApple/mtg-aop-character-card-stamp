"use strict";

var cards = {
	"Liliana Vess, Necromancer":{
		"name":"Liliana Vess, Necromancer",
		"category":"Planeswalker",
		"type":"Liliana",
		"life":7,
		"move":6,
		"range":6,
		"attack":4,
		"defense":3,
		"abilityArray":[
			{"title":"Zombie Toughness","body":"All Zombies you control within 4 clear sight spaces of Liliana get +1 {def-icon}"}
		],
		"height":{
			"name":"Medium",
			"value":4
		},
		"cost":325,
		"artist":{"title":"Karla Ortiz"},
		"copyRight":"&copy; 2014 Hasbro TM & &copy; 2014 Wizards"
	}
}

angular.module('mtgAotpCharCards',[])
.service('charCards',function($q){
	return {
		list:function(){
			return $q.resolve({data:cards})
		}
	}
})