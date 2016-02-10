"use strict";
angular.module('mtgAotpCharCardCreator',['mtgAotpCharCards'])
.directive('mtgAotpCharCardCreator',function(){
  return {
    restrict:'E'
    ,scope:{charCards:'='}
    ,controller:function(charCards){
      this.setFetchResult = function(res){
        this.charCards = res.data
      }

      charCards.list()
      .then(this.setFetchResult.bind(this))
    }
    ,bindToController:true
    ,controllerAs:'cardCreator'
    ,templateUrl:'mtg-aotp-char-card-creator'
  }
})
.directive('charCard',function(){
  return {
    restrict:'E'
    ,scope:{model:'='}
    ,templateUrl:'char-card'
    ,controller:function(){}
    ,bindToController:true
    ,controllerAs:'charCard'
  }
})
