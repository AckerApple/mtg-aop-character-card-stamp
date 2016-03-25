"use strict";

angular.module('aotpCardService',[])
.service('AotpDemoSeries',function(){
  return {
    get:function(){
      var data = require('./aotp-demo-series.json')
      data.id = uuid()
      return data
    }
  }
})

.service('AotpDemoCharCard',function(){
  return {
    get:function(){
      var data = require('./aotp-demo-char-card.json')
      data.id = uuid()
      return data
    }
  }
})
.service('AotpSeries',function($q,$http){
	return {
    get:function(id){
      return $http.get('cards/'+id+'.json')
    },
    list:function(){
      return $http.get('cards/index.json')
		}
	}
})

function uuid(){
  return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);return v.toString(16)})
}