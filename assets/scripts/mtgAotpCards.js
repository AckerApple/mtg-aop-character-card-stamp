"use strict";

angular.module('mtgAotpCards',[])
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