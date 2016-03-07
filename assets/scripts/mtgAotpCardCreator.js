"use strict";
angular.module('mtgAotpCardCreator',['ngAnimate','ackAngular','ngSanitize','mtgAotpCards','ngFileUpload','as.sortable'])
.config( [
    '$compileProvider',
    function( $compileProvider ){
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|ftp|mailto|chrome-extension):/);
    }
])
.directive('charCardEditor',function(){
  return {
    restrict:'E'
    ,scope:{
      model:'=', series:'='
    }
    ,template:require('./char-card-editor.jade')
    ,bindToController:true
    ,controllerAs:'editor'
    ,controller:function(Upload){
      this.selectedColors=[]
      this.colors=[
        {label:'black',value:'b'},
        {label:'blue',value:'u'},
        {label:'green',value:'g'},
        {label:'red',value:'r'},
        {label:'white',value:'w'}
      ]

      this.uploadAvatarTo = function($file,model){
        Upload.base64DataUrl($file)
        .then(function(res){
          model.avatar = {dataUrl:res}
        })
      }

      this.uploadFigureTo = function($file,model){
        Upload.base64DataUrl($file)
        .then(function(res){
          model.figure = {dataUrl:res}
        })
      }

      this.addAbility = function(){
        this.model.abilityArray = this.model.abilityArray || []
        this.model.abilityArray.push({})
      }

      this.cycleSymbolClass = function(){
        var newClass = 'aotp aotp-squad'
        switch(this.model.symbolClass){
          case 'aotp aotp-squad':
            newClass = ''
            break;
        }
        this.model.symbolClass = newClass
      }
    }
  }
})
.directive('mtgAotpCardCreator',function(){
  return {
    restrict:'E'
    ,scope:{}
    ,bindToController:true
    ,controllerAs:'cardCreator'
    ,template:require('./mtg-aotp-card-creator.jade')
    ,controller:function(AotpSeries, AotpDemoCharCard, $q){
      this.seriesIndex=0
      this.selectedIndex = 0

      this.cycleSeriesSymbol = function(){
        var newClass = 'mi mi-planeswalk'
        switch(this.selectedSeries.symbolClass){
          case 'mi mi-planeswalk':
            newClass = 'aotp aotp-zendikar'
            break;
        }
        this.selectedSeries.symbolClass = newClass
      }

      this.paramSeries = function(series){
        if(series && series.data){//already loaded?
          this.selectedSeries = series
          return this.selectFirstCard()
        }

        this.selectedSeries = series
        return this.fetchSeries(series)
        //.then( this.selectFirstCard.bind(this) )
      }

      this.selectSeriesByIndex = function(index){
        this.paramSeries(this.cardSeries[index])
      }

      this.priorSeries = function(){
        this.seriesIndex=this.seriesIndex==0?this.cardSeries.length-1:this.seriesIndex-1

        this.selectSeriesByIndex(this.seriesIndex)
      }

      this.nextSeries = function(){
        this.seriesIndex=this.seriesIndex==this.cardSeries.length-1?0:this.seriesIndex+1
        this.selectSeriesByIndex(this.seriesIndex)
      }

      this.deleteSeries = function(){
        delete this.cardSeries[this.seriesIndex]
        delete this.selectedSeries
        this.priorSeries()
      }

      this.priorCard = function(){
        this.selectedIndex=this.selectedIndex==0?this.selectedSeries.data.length-1:this.selectedIndex-1
        this.selectedCard = this.selectedSeries.data[this.selectedIndex]
      }

      this.nextCard = function(){
        this.selectedIndex=this.selectedIndex==this.selectedSeries.data.length-1?0:this.selectedIndex+1
        this.selectedCard = this.selectedSeries.data[this.selectedIndex]
      }

      this.deleteCard = function(){
        delete this.selectedSeries.data[this.selectedIndex]
        var sLen = this.selectedSeries.data.length
        this.selectedIndex = this.selectedIndex >= sLen ? sLen-1 : this.selectedIndex
        this.selectedCard = this.selectedSeries.data[ this.selectedSeries.data[this.selectedIndex] ]
      }

      this.selectFirstCard = function(){
        this.selectedIndex = 0;
        this.selectedSeries = this.selectedSeries || this.cardSeries[0]
        if(this.selectedSeries.data){
          this.selectedCard = this.selectedSeries.data[0]
          return;
        }
        return this.selectSeriesByIndex(this.seriesIndex)
      }

      this.addSeries = function(){
        this.selectedSeries = {
          name:'Hot New Card Series',data:[]
        }
        this.cardSeries.push(this.selectedSeries)
        this.addCard()
      }

      this.addCard = function(){
        AotpDemoCharCard.get()
        .then( this.setDemoCardResult.bind(this))
      }

      this.setDemoCardResult = function(res){
        this.selectedCard = res.data
        this.selectedSeries.data.push(res.data)
      }

      this.fetchSeries = function(series){
        return AotpSeries.get(series.name).then(this.setSeriesFetchRes.bind(this, series))
      }

      this.setSeriesFetchRes = function(series, res){
        /* card upgrade loop */
          if(res.data.data && res.data.data.constructor!=Array){
            var newArray = []
            for(var x in res.data.data){
              newArray.push(res.data.data[x])
            }
            res.data.data = newArray
          }
        /* end */
        for(var x in series)delete series[x];
        for(x in res.data)series[x] = res.data[x];
      }

      this.fetchAll = function(){
        var all = [], promise=$q.resolve()

        for(var x=0; x < this.cardSeries.length; ++x){
          if(this.cardSeries[x].data)continue;
          promise = promise.then( this.fetchSeriesByIndex(x) )
        }

        return promise
      }

      this.exportAll = function(){
        var setter = function(){
          this.export={name:'mtg-aotp-cards', data:this.cardSeries}
        }

        return this.fetchAll().then(setter.bind(this))
      }

      this.setFetchResult = function(res){
        this.cardSeries = res.data
        this.paramSeries( this.cardSeries[0] )
        //this.selectFirstCard()
      }

      this.fetchCards = function(){
        AotpSeries.list().then(this.setFetchResult.bind(this))
      }

      this.fetchCards()
    }
  }
})
.directive('charCard',function(){
  return {
    restrict:'E'
    ,scope:{model:'=', size:'=', series:'='}
    ,template:require('./char-card.jade')
    ,controller:function(){
    }
    ,bindToController:true
    ,controllerAs:'charCard'
  }
})
.directive('mtgSymbolize',function($sanitize){
  return {
    scope:{mtgSymbolize:'='}
    ,restrict:'A'
    ,link:function($scope, jElm, $attrs){
      $scope.$watch('mtgSymbolize',function(string){
        jElm[0].innerHTML = symbolize( $sanitize(string) )
      })
    }
  }
})
.directive('printCanvas',function($q,$parse){
  return {
    restrict:'EA',
    transclude:true,
    scope:false,
    bindToController:{
      printTrigger:'=', printModel:'=',
      printWidth:'=', printHeight:'=',
      beforePrint:'&', afterPrint:'&'
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
      var print = function(){
        $scope.printer.printElm(jElm[0])
        .then(function(){
          $parse(attrs.printModel).assign($scope, $scope.printer.printModel)
          $parse(attrs.afterPrint)($scope)
        })
      }
      $scope.$watch(attrs.printTrigger, function(value){
        if(value){
          $scope.printer.printWidth = $parse(attrs.printWidth)($scope)
          $scope.printer.printHeight = $parse(attrs.printHeight)($scope)

          $parse(attrs.beforePrint)($scope)
          setTimeout(print, 100)
        }
      })

      transclude($scope, function(clone){
        jElm.html('')
        jElm.append(clone)
      })
    }
  }
})
.filter('symbolize',function(){
  return symbolize
})
.filter('trustAsHtml', function($sce){
  return function(text) {
      return $sce.trustAsHtml(text);
  };
})
.filter('keys',function(){
  return function(val){
    return val ? Object.keys(val) : [];
  }
})
.filter('jsonExportUrl',function(){
  return function(ob){
    try{
      return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ob))
    }catch(e){
      return "data:text/json;charset=utf-8,invalid JSON"
    }
  }
})
.filter('copy',function(){
  return function(val){
    return angular.copy(val)
  }
})

function symbolize(string){
  if(!string||!string.replace)return string;
  string = string.replace(/\#\{([^\}'"]*)\}/g, '<span class="symbolized $1"></span>')
  return string;
}