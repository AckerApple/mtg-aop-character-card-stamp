"use strict";
angular.module('mtgAotpCharCardCreator',['mtgAotpCharCards'])
.config( [
    '$compileProvider',
    function( $compileProvider ){
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|ftp|mailto|chrome-extension):/);
    }
])
.directive('mtgAotpCharCardCreator',function(){
  return {
    restrict:'E'
    ,scope:{charCards:'='}
    ,controller:function(CharCards, DemoCard){
      this.selectedIndex = 0

      this.setFetchResult = function(res){
        this.charCards = res.data
      }

      this.selectDemoCard = function(){
        DemoCard.list()
        .then( this.setDemoCardResult.bind(this))
      }

      this.setDemoCardResult = function(res){
        this.selectedCard = res.data
      }

      CharCards.list()
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
    ,scope:{model:'=', size:'='}
    ,templateUrl:'char-card'
    ,controller:function(){}
    ,bindToController:true
    ,controllerAs:'charCard'
  }
})
.directive('printCanvas',function($q,$parse){
	return {
		restrict:'EA',
		transclude:true,
    scope:false,
		//template:'<ng-transclude style="display:inline-block;" ng-style="{width:printer.printWidth+\'px\',height:printer.printHeight+\'px\'}"></ng-transclude></div>',
		bindToController:{
      printTrigger:'=', printModel:'='
      ,printWidth:'=', printHeight:'='
    },
		controllerAs:'printer',
		controller:function(){
			this.printCanvas = function(canvas){
			  this.printModel = {
			  	canvas:canvas,
			  	url:canvas.toDataURL("image/png",1)
			  }
			}

			this.printElm = function(elm){
				var defer = $q.defer()
				var options = {
			  	allowTaint:true
			    ,useCORS:true
			    ,letterRendering:true
			    ,onrendered:defer.resolve.bind(defer)//this.printCanvas.bind(this)
			    ,width:this.printWidth
			    ,height:this.printHeight
			  }
				html2canvas(elm,options)

				return defer.promise.then( this.printCanvas.bind(this) )
			}
		},
		link:function($scope, jElm, attrs, a, transclude){
			$scope.$watch(attrs.printTrigger, function(value){
				if(value){
          $scope.printer.printWidth = $parse(attrs.printWidth)()
          $scope.printer.printHeight = $parse(attrs.printHeight)()

          $scope.printer.printElm(jElm[0])
          .then(function(){
            $scope[attrs.printModel] = $scope.printer.printModel
          })
				}
			})

			transclude($scope, function(clone){
				jElm.html('')
				jElm.append(clone)
			})
		}
	}
})
.filter('symbolize',function($sce){
  return function(string){
    string = string.replace(/\#\{([^\}]*)\}/g, '<span class="symbolized $1"></span>')
    return string;
  }
})
.filter('trustAsHtml', function($sce){
  return function(text) {
      return $sce.trustAsHtml(text);
  };
})
.filter('keys',function(){
  return function(val){
    return Object.keys(val)
  }
})