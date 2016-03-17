"use strict";

function uuid(){
  return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);return v.toString(16)})
}

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
    ,controller:CharCardEditor
  }
})
.service('AotpDemoCharCard',function(){
  return {
    get:function(){
      return {
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
        "putSymbolOnFigure":true,
        "height":{
          "name":"Medium",
          "value":4
        },
        "cost":{value:325},
        "artist":{"iconClass":"aotp aotp-artist-pawn", "title":"Karla Ortiz"}
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
    ,controller:mtgAotpCardCreator
  }
})
.directive('charCard',function(){
  return {
    restrict:'E'
    ,scope:{
      model:'=', size:'=', series:'='
    }
    ,template:require('./char-card.jade')
    ,controller:function(){
      this.getAbilitiesLength=function(){
        if(!this.model || !this.model.abilityArray)return 0;
        var len = 0
        for(var x=this.model.abilityArray.length-1; x >= 0; --x){
          var ab = this.model.abilityArray[x]
          len = len + ab.body.length + ab.title.length
        }
        return len
      }
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
    scope:true,
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

.directive('mtgEditorView',function(){//mtg-editor-view.jade
  return {
    restrict:'E'
    ,scope:{
      card:'=',series:'='
    }
    ,bindToController:true
    ,controllerAs:'iEditor'
    ,controller:seriesNav
    ,template:require('./mtg-editor-view.jade')
  }
})

.directive('aotpCardWhiteOutModal',function(){
  return {
    restrict:'E'
    ,scope:{
      card:'=', series:'=', onEdit:'&'
    }
    ,template:require('./aotp-card-white-out-modal.jade')
    ,controllerAs:'iCardModal'
    ,bindToController:true
    ,controller:seriesNav
  }
})

.directive('mtgRosterView',function(){//mtg-roster-view
  return {
    restrict:'E'
    ,scope:{
      series:'=',
      cardClick:'&',
      onAdd:'&', sortDisabled:'=?'
    }
    ,template:require('./mtg-roster-view.jade')
    ,bindToController:true
    ,controllerAs:'iRoster'
    ,controller:function($scope){
      this.sortDisabled = this.sortDisabled==null?true:this.sortDisabled
    }
  }
})
.directive('aotpRenderedCard',function(){
  return {
    restrict:'E'
    ,scope:{
      name:'=', ezPrintExport:'=', hiPrintExport:'='
    }
    ,template:require('./aotp-rendered-card.jade')
    ,bindToController:true
    ,controllerAs:'rendering'
    ,controller:function(){}
  }
})

.filter('symbolize',function(){
  return symbolize
})
.filter('scanSeries',function(){
  return scanSeries
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
      return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ob))
    }catch(e){
      return 'data:text/json;charset=utf-8,invalid JSON'
    }
  }
})
.filter('copy',function(){
  return function(val){
    return angular.copy(val)
  }
})
.filter('lineReturnAsBr',function(){
  return function(val){
    if(!val || !val.replace)return val
    return val.replace(/\r|\n/gi,'<br />')
  }
})






function symbolize(string){
  if(!string||!string.replace)return string;
  string = string.replace(/\#\{([^\}'"]*)\}/g, '<span class="symbolized $1"></span>')
  return string;
}




function seriesNav(AotpSeries, AotpDemoCharCard, $q, Upload){
  this.$q = $q
  this.AotpDemoCharCard = AotpDemoCharCard
  this.AotpSeries=AotpSeries
  this.seriesIndex=0
  this.selectedIndex = -1
  this.Upload = Upload
}

/** fetches one series at time */
seriesNav.prototype.uploadSeries = function(series){
  if(!series)return;
  this.$q.resolve()
  .then(function(){
    return this.Upload.base64DataUrl(series)
  }.bind(this))
  .then(function(res){
    var string = res.split(',')[1]
    return atob(string)
  })
  .then(JSON.parse)
  .then(this.importSeries.bind(this))
  .catch(function(e){
    alert('import failed. '+e.message)
  })
}

seriesNav.prototype.importSeries = function(series){
  var index = this.getSeriesIndex(series)
  updateSeries(series);

  if(index>=0){
    for(var x in this.cardSeries[index])delete this.cardSeries[index][x];
    for(var x in series)this.cardSeries[index][x] = series[x]
  }else{
    this.cardSeries.push(series)
  }
}

seriesNav.prototype.createSeriesExport = function(){
  this.export = {name:this.series.name, data:this.series}
}

seriesNav.prototype.getSeriesIndex = function(series){
  for(var x=this.cardSeries.length-1; x >= 0; --x){
    if(this.cardSeries[x].name==series.name){
      return x
    }
  }
}

seriesNav.prototype.paramSeries = function(series){
  if(series && series.data){//already loaded?
    return this.$q.resolve(series)
  }

  return this.fetchSeries(series).then(updateSeries)
  //.then( this.selectFirstCard.bind(this) )
}

seriesNav.prototype.selectSeriesByIndex = function(index){
  this.series = this.cardSeries[index]
  return this.paramSeries(this.series)
}

seriesNav.prototype.cycleSeriesSymbol = function(){
  var newClass = 'mi mi-planeswalk'
  switch(this.series.symbolClass){
    case 'mi mi-planeswalk':
      newClass = 'aotp aotp-zendikar'
      break;
  }
  this.series.symbolClass = newClass
}

seriesNav.prototype.priorSeries = function(){
  this.seriesIndex=this.seriesIndex<=0?this.cardSeries.length-1:this.seriesIndex-1

  this.selectSeriesByIndex(this.seriesIndex)
}

seriesNav.prototype.nextSeries = function(){
  this.seriesIndex=this.seriesIndex==this.cardSeries.length-1?0:this.seriesIndex+1
  this.selectSeriesByIndex(this.seriesIndex)
}

seriesNav.prototype.deleteSeries = function(){
  this.cardSeries.splice(this.seriesIndex,1)
  delete this.series
  this.priorSeries()
}

seriesNav.prototype.priorCard = function(){
  this.card = getPriorCardBySeries(this.card,this.series)
  this.selectedIndex = getCardIndexBySeries(this.card, this.series)
}

seriesNav.prototype.nextCard = function(){
  this.card = getNextCardBySeries(this.card,this.series)
  this.selectedIndex = getCardIndexBySeries(this.card, this.series)
}

seriesNav.prototype.deleteCard = function(card){
  card = card || this.card
  var index = getCardIndexBySeries(card, this.series);
  this.series.data.splice(index,1)
  delete this.series.images[card.id]

  //select next card
  this.selectedIndex = index >= this.series.data.length ? sLen-1 : index
  this.card = this.series.data[ this.selectedIndex ]
}

seriesNav.prototype.selectFirstCard = function(){
  this.selectedIndex = 0;
  this.series = this.series || this.cardSeries[0]
  if(this.series.data){
    this.card = this.series.data[0]
    return;
  }
  return this.selectSeriesByIndex(this.seriesIndex)
  .then(function(){
    this.card=this.series.data[0]
  }.bind(this))
}

seriesNav.prototype.addSeries = function(){
  this.series = {
    name:'Hot New Card Series',
    id:uuid(),
    data:[],
    images:{}//by uuid
  }
  this.cardSeries.push(this.series)
  this.addCard()
}

seriesNav.prototype.addCard = function(){
  this.card = this.AotpDemoCharCard.get()
  this.series.data.push(this.card)
  this.mode='editor'
}

seriesNav.prototype.fetchSeries = function(series){
  return this.AotpSeries.get(series.name)
  .then(this.setSeriesFetchRes.bind(this, series))
  .then(scanSeries)
}

seriesNav.prototype.setSeriesFetchRes = function(series, res){
  for(var x in series)delete series[x];
  for(x in res.data)series[x] = res.data[x];
  return series
}

seriesNav.prototype.fetchAll = function(){
  var all = [], promise=this.$q.resolve()

  for(var x=0; x < this.cardSeries.length; ++x){
    if(this.cardSeries[x].data)continue;
    promise = promise.then( this.fetchSeriesByIndex(x) )
  }

  return promise
}

seriesNav.prototype.exportAll = function(){
  var setter = function(){
    this.export={name:'mtg-aotp-cards', data:this.cardSeries}
  }

  return this.fetchAll().then(setter.bind(this))
}

seriesNav.prototype.setFetchResult = function(res){
  this.cardSeries = res.data
  this.paramSeries( this.cardSeries[0] )
  //this.selectFirstCard()
}

seriesNav.prototype.fetchSeriesListing = function(){
  return this.AotpSeries.list()
  .then(this.setFetchResult.bind(this))
}







function mtgAotpCardCreator(AotpSeries, AotpDemoCharCard, $q, Upload){
  this.mode='roster'
  seriesNav.apply(this,arguments)
  this.fetchSeriesListing().then(this.selectFirstCard.bind(this))
}
mtgAotpCardCreator.prototype = Object.create(seriesNav.prototype)










function CharCardEditor(Upload){
  this.selectedColors=[]
  this.colors=[
    {label:'black',value:'b'},
    {label:'blue',value:'u'},
    {label:'green',value:'g'},
    {label:'red',value:'r'},
    {label:'white',value:'w'}
  ]

  this.dropColorByIndex = function(i){
    this.model.colors.splice(i,1)
  }

  this.addAbByType = function(type){
    var singular = this.model.name.replace(/s$/i,'')

    var ab = {}
    switch(type){
      case 'trample':
        ab.title='Trample';
        ab.body='While attacking, if a '+singular+' would assign enough damage to destroy a defending figure, you may have it assign the rest of its damage to a figure adjacent to the defending figure.';
        break;
      case 'flying':
        ab.title='Flying';
        ab.body='When counting movement spaces for '+this.model.name+', ignore elevations. '+this.model.name+' may fly over water without stopping, pass over figures without becoming engaged, and fly over obstacles such as ruins. When a '+singular+' starts to fly, it will take any leaving-engagement attacks.';
        break;
      case 'lifelink':
        ab.title='Lifelink';
        ab.body='While attacking with a '+singular+', for each damage it deals to the defending figure, remove a damage marker from the '+singular+'.';
        break;
/*
      case 'first strike':
        ab.title='First Strike';
        ab.body='';
        break;
*/
      case 'haste':
        ab.title='Haste';
        ab.body='When you summon the '+this.model.name+' squad, you may immediately attack with a '+singular+'.';
        break;
    }
    this.model.abilityArray.push(ab)
  }

  this.uploadAvatarTo = function($file,model){
    Upload.base64DataUrl($file)
    .then(function(res){
      model.dataUrl = res
      return this.series
    }.bind(this))
    .then(scanSeries)
  }

  this.uploadFigureTo = function($file,model){
    Upload.base64DataUrl($file)
    .then(function(res){
      model.dataUrl=res
      return this.series
    }.bind(this))
    .then(scanSeries)
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






function getPriorCardBySeries(card,series){
  var index = getCardIndexBySeries(card, series)
  index = index==0? series.data.length-1 : index-1;
  return series.data[index]
}


function getNextCardBySeries(card, series){
  var index = getCardIndexBySeries(card, series)
  index = index+1 == series.data.length ? 0 : index+1;
  return series.data[index]
}

function getCardIndexBySeries(card, series){
  for(var x=series.data.length-1; x >= 0; --x){
    if(series.data[x].id==card.id){
      return x
    }
  }
}

function scanSeries(series){
  var hasRefs = false
  for(var x in series.images){//loop series images
    if(
        isExternalRef(series.images[x].avatar.dataUrl)
    ||  isExternalRef(series.images[x].figure.dataUrl)
    ){
      hasRefs = true
      break;
    }
  }

  series.hasRefs = hasRefs

  return series
}

function updateSeries(series){
  if(!series.json){//v1
    if(!series.id)series.id=uuid()
    if(!series.images)series.images={}
    series.json = {version:[1,0,0]}
  }

  //card loop
  for(var x=series.data.length-1; x >= 0; --x){
    var card = series.data[x];
    updateCardBySeries(card, series)
  }
}

function updateCardBySeries(card,series){
  if(!card.id)card.id = uuid()
  series.images[card.id] = series.images[card.id] || {avatar:{}, figure:{}}
  if(card.avatar){
    series.images[card.id].avatar = card.avatar
  }
  if(card.figure){
    series.images[card.id].figure = card.figure
  }

  delete card.copyRight
  delete card.avatar
  delete card.figure
}

function isExternalRef(ref){
  if(!ref || !ref.search)return false
  return ref.search(/^data:/) < 0
}