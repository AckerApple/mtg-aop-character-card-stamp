"use strict";

angular.module('jsZip',[]).service('jsZip',function(){return JSZip})


angular.module('mtgAotpCardCreator',[
  'ngAnimate',
  'ng-fx',
  'ackAngular',
  'ngSanitize',
  'aotpCardService',
  'ngFileUpload',
  'as.sortable',
  'ngFileSaver',
  'jsZip'
])
.config([
  '$compileProvider',
  function( $compileProvider ){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|ftp|mailto|chrome-extension):/);
  }
])
.service('AotpExport',['jsZip', 'Blob', '$q',function(jsZip, Blob, $q){
  return {
    getSeriesArrayExport:function(seriesArray){
      var zip = this.getZipBySeriesArray(seriesArray)
      var json = JSON.stringify(seriesArray)
      return {
        name:'mtg-aotp-cards',
        json:{
          name:'mtg-aotp-cards.json',
          blob:new Blob([json], {type:'text/json;charset=utf-8'})
        },
        zip:{
          name:'mtg-aotp-cards.zip',
          blob:zip.generate({type:"blob"})
          //,uri:"data:application/zip;content-disposition:attachment;filename=test.zip,base64," + zip.generate({type:"base64"})
        }
      }
    },
    getZipBySeriesArray:function(seriesArray){
      var allSeries = angular.copy(seriesArray)
      var zip = new jsZip()

      for(var x=allSeries.length-1; x >= 0; --x){
        var series = allSeries[x];
        var images = extractSeriesImages(series);

        if(images){
          zip.file("images-"+series.name+".json", JSON.stringify(images));
        }
      }

      zip.file("series.json", JSON.stringify(allSeries));
      return zip//.generate({type:"blob"})
    },/*
    getZipBlobBySeries:function(series){
      return this.getZipBlobBySeriesArray([series])
    },*/
    getSeriesExports:function(series){
      var zip = this.getZipBySeriesArray([series])
      var json = JSON.stringify([series])
      return {
        name:series.name,
        json:{
          name:series.name+'.json',
          blob:new Blob([json], {type:'text/json;charset=utf-8'})
        },
        zip:{
          name:series.name+'.zip',
          blob:zip.generate({type:"blob"})
          //,uri:"data:application/zip;base64," + zip.generate({type:"base64"})
        }
      }
    },
    uploadSeriesFile:function(userInputFile){
      return $q(function(res,rej){
        var FR = new FileReader()
        FR.onload = res
        FR.readAsArrayBuffer(userInputFile)
      })
      .then(function(e){
        var new_zip = new jsZip(e.target.result)

        if(!new_zip.files["series.json"])throw new Error('Zip file did not contain a series.json file')

        var newSeries = new_zip.file("series.json").asText()
        newSeries = JSON.parse(newSeries)
        newSeries.images = {}

        for(var x=newSeries.length-1; x >= 0; --x){
          var series = newSeries[x]
          var newImages = new_zip.file("images-"+series.name+".json").asText()
          newImages = JSON.parse(newImages)
          series.images = newImages//data.images[series.id]
        }
/*
        if(!new_zip.files["images.json"])throw new Error('Zip file did not contain an images.json file')
        images:JSON.parse(newImages),
*/
        return newSeries
      })
/*
      .then(function(data){
        return data.series
      })
*/
    }
  }
}])
.directive('aotpCharCardEditor',function(){
  return {
    restrict:'E'
    ,scope:{
      model:'=', series:'='
    }
    ,template:require('../views/aotp-char-card-editor.jade')
    ,bindToController:true
    ,controllerAs:'editor'
    ,controller:['Upload',AotpCharCardEditor]
  }
})
.directive('aotpCharCard',function(){
  return {
    restrict:'E'
    ,scope:{
      model:'=', size:'=', series:'='
    }
    ,template:require('../views/aotp-char-card.jade')
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
    ,controllerAs:'aotpCharCard'
  }
})
.directive('mtgSymbolize',['$sanitize',function($sanitize){
  return {
    scope:{mtgSymbolize:'='}
    ,restrict:'A'
    ,link:function($scope, jElm, $attrs){
      $scope.$watch('mtgSymbolize',function(string){
        jElm[0].innerHTML = symbolize( $sanitize(string) )
      })
    }
  }
}])
.directive('printCanvas',['$q','$parse',function($q,$parse){
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
}])
.controller('MtgAotpCardCreator',[
  'AotpExport', 'AotpSeries', 'AotpDemoSeries', 'AotpDemoCharCard',
  '$q', 'Upload', 'Blob', 'FileSaver', 'jsZip',
  mtgAotpCardCreator
])
.controller('SeriesNav',[
  'AotpExport', 'AotpSeries', 'AotpDemoSeries', 'AotpDemoCharCard',
  '$q', 'Upload', 'Blob', 'FileSaver', 'jsZip',
  seriesNav
])
.directive('mtgAotpCardCreator',function(){
  return {
    restrict:'E'
    ,scope:{}
    ,bindToController:true
    ,controllerAs:'cardCreator'
    ,template:require('../views/mtg-aotp-card-creator.jade')
    ,controller:'MtgAotpCardCreator'
  }
})
.directive('aotpEditorView',function(){
  return {
    restrict:'E'
    ,scope:{
      card:'=',series:'='
    }
    ,bindToController:true
    ,controllerAs:'iEditor'
    ,controller:'SeriesNav'
    ,template:require('../views/aotp-editor-view.jade')
  }
})

.directive('aotpCardWhiteOutModal',function(){
  return {
    restrict:'E'
    ,scope:{
      card:'=', series:'=', onEdit:'&'
    }
    ,template:require('../views/aotp-card-white-out-modal.jade')
    ,controllerAs:'iCardModal'
    ,bindToController:true
    ,controller:'SeriesNav'
  }
})

.directive('aotpRosterView',function(){
  return {
    restrict:'E'
    ,scope:{
      series:'=',
      cardClick:'&',
      onAdd:'&', sortDisabled:'=?'
    }
    ,template:require('../views/aotp-roster-view.jade')
    ,bindToController:true
    ,controllerAs:'iRoster'
    ,controller:['$scope',function($scope){
      this.sortDisabled = this.sortDisabled==null?true:this.sortDisabled
    }]
  }
})
.directive('aotpRenderedCard',function(){
  return {
    restrict:'E'
    ,scope:{
      name:'=', ezPrintExport:'=', hiPrintExport:'='
    }
    ,template:require('../views/aotp-rendered-card.jade')
    ,bindToController:true
    ,controllerAs:'rendering'
    ,controller:['FileSaver',function(FileSaver){
      this.downloadHires = function(){
        var i = this.hiPrintExport.canvas.toBlob( this.downloadBlob.bind(this) )
      }

      this.downloadEzprint = function(){
        var i = this.ezPrintExport.canvas.toBlob( this.downloadBlob.bind(this) )
      }

      this.downloadBlob = function(blob){
        FileSaver.saveAs(blob, this.name+'.png');
      }
    }]
  }
})

.filter('symbolize',function(){
  return symbolize
})
.filter('scanSeries',function(){
  return scanSeries
})
.filter('trustAsHtml', ['$sce',function($sce){
  return function(text) {
      return $sce.trustAsHtml(text);
  };
}])
.filter('keys',function(){
  return function(val){
    return val ? Object.keys(val) : [];
  }
})
.filter('jsonExportUrl',function(){
  return jsonExportUrl
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



/*
function jsonExportUrl(ob,options){
  options = options || {}

  options.toDataUri = options.toDataUri==null?true:options.toDataUri;
  options.encode = options.encode==null?true:options.encode;

  var rtn = options.toDataUri ? 'data:text/json;charset=utf-8,' : ''

  try{
    var exported = JSON.stringify(ob);
  }catch(e){
    var exported = 'invalid JSON';
  }

  if(options.encode)exported=encodeURIComponent(exported);
  return rtn+exported
}
*/


function symbolize(string){
  if(!string||!string.replace)return string;
  string = string.replace(/\#\{([^\}'"]*)\}/g, '<span class="symbolized $1"></span>')
  return string;
}




function seriesNav(AotpExport, AotpSeries, AotpDemoSeries, AotpDemoCharCard, $q, Upload, Blob, FileSaver, jsZip){
  this.$q = $q
  this.AotpExport = AotpExport
  this.AotpDemoCharCard = AotpDemoCharCard
  this.AotpSeries=AotpSeries
  this.seriesIndex=0
  this.selectedIndex = -1
  this.Upload = Upload
  this.Blob = Blob
  this.FileSaver = FileSaver
  this.jsZip = jsZip
  this.exportImages = true
  return this
}

/** fetches one series at time */
seriesNav.prototype.uploadSeries = function(series){
  if(!series)return;

  this.AotpExport.uploadSeriesFile(series)
  .then(this.importSeriesArray.bind(this))
  .catch(function(e){
    alert('import failed. '+e.message)
  })
}

seriesNav.prototype.importSeriesArray = function(array){
  for(var x=array.length-1; x >= 0; --x){
    this.importSeries( array[x] )
  }
}

seriesNav.prototype.importSeries = function(series){
  var index = this.getSeriesIndex(series)
  updateSeries(series);

  if(index>=0){
    for(var x in this.cardSeries[index]){//delete all existing keys
      delete this.cardSeries[index][x];
    }
    for(var x in series){
      this.cardSeries[index][x] = series[x]//populate with new keys
    }
  }else{
    this.cardSeries.push(series)
  }
}

seriesNav.prototype.exportAll = function(){
  var setter = function(){
    var exp = this.cardSeries
    if(!this.exportImages){
      exp = angular.copy(exp)
      extractAllSeriesImages(exp)
    }
    this.export = this.AotpExport.getSeriesArrayExport(exp)
  }.bind(this)

  return this.fetchAll().then(setter)
}

seriesNav.prototype.createSeriesExport = function(){
  var exp = this.series
  if(!this.exportImages){
    exp = angular.copy(exp)
    extractSeriesImages(exp)
  }
  this.export = this.AotpExport.getSeriesExports(exp)
}

seriesNav.prototype.downloadZipExport = function(){
  this.FileSaver.saveAs(this.export.zip.blob, this.export.zip.name);
}

seriesNav.prototype.downloadJsonExport = function(){
  this.FileSaver.saveAs(this.export.json.blob, this.export.json.name);
}

seriesNav.prototype.getSeriesIndex = function(series){
  for(var x=this.cardSeries.length-1; x >= 0; --x){
    if(this.cardSeries[x].name==series.name){
      return x
    }
  }
}

seriesNav.prototype.paramSeries = function(series){
  if(series && series.chars){//already loaded?
    return this.$q.resolve(series)
    //return new Promise(function(resolve){resolve(series)})
  }

  return this.fetchSeries(series).then(updateSeries)
  //.then( this.selectFirstCard.bind(this) )
}

seriesNav.prototype.addSeries = function(){
  this.series = this.AotpDemoSeries.get()
  this.cardSeries.push(this.series)
  this.addCard()
}

seriesNav.prototype.addCard = function(){
  this.card = this.AotpDemoCharCard.get()
  this.series.images[this.card.id] = {avatar:{},figure:{}};
  this.series.chars.push(this.card)
  this.mode='editor'
}

seriesNav.prototype.selectSeriesByIndex = function(index){
  this.series = this.cardSeries[index]
  return this.paramSeries(this.series).then(this.selectFirstCard.bind(this))
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
  this.series.chars.splice(index,1)
  delete this.series.images[card.id]

  //select next card
  this.selectedIndex = index >= this.series.chars.length ? sLen-1 : index
  this.card = this.series.chars[ this.selectedIndex ]
}

seriesNav.prototype.selectFirstCard = function(){
  this.selectedIndex = 0;
  this.series = this.series || this.cardSeries[0]
  if(this.series.chars){
    this.card = this.series.chars[0]
    return;
  }
  return this.selectSeriesByIndex(this.seriesIndex)
  .then(function(){
    this.card=this.series.chars[0]
  }.bind(this))
}

seriesNav.prototype.fetchSeries = function(series){
  return this.AotpSeries.get(series.name)
  .then(this.setSeriesFetchRes.bind(this, series))
  .then(scanSeries)
}

seriesNav.prototype.setSeriesFetchRes = function(series, res){
  for(var x in series)delete series[x];//delete all keys of existing series
  for(x in res.data[0])series[x] = res.data[0][x];//paste retreived data
  return series
}

seriesNav.prototype.fetchAll = function(){
  var promise=this.$q.resolve()
  var cardSeries = this.cardSeries

  for(var x=0; x < cardSeries.length; ++x){
    var series = cardSeries[x]
    if(series.chars)continue;
    promise = promise
    .then( this.fetchSeries.bind(this,series) )
    .then(function(series){
      cardSeries[this]=series
    }.bind(x))
  }

  return promise
}

seriesNav.prototype.setFetchResult = function(res){
  this.cardSeries = res.data.series
  this.paramSeries( this.cardSeries[0] )
  //this.selectFirstCard()
}

seriesNav.prototype.fetchSeriesListing = function(){
  return this.AotpSeries.list()
  .then(this.setFetchResult.bind(this))
}







function mtgAotpCardCreator(AotpExport, AotpSeries, AotpDemoSeries, AotpDemoCharCard, $q, Upload, Blob, FileSaver, jsZip){
  this.mode='roster'
  seriesNav.apply(this,arguments)
  this.fetchSeriesListing().then(this.selectFirstCard.bind(this))
}
mtgAotpCardCreator.prototype = Object.create(seriesNav.prototype)










function AotpCharCardEditor(Upload){
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

      case 'firststrike':
        ab.title='First strike';
        ab.body='This squad deals combat damage before figures without first strike.';
        break;

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
  index = index==0? series.chars.length-1 : index-1;
  return series.chars[index]
}


function getNextCardBySeries(card, series){
  var index = getCardIndexBySeries(card, series)
  index = index+1 == series.chars.length ? 0 : index+1;
  return series.chars[index]
}

function getCardIndexBySeries(card, series){
  for(var x=series.chars.length-1; x >= 0; --x){
    if(series.chars[x].id==card.id){
      return x
    }
  }
}

/* detects things about an imported series */
function scanSeries(series){
  var hasRefs = false
  for(var x in series.images){//loop series images
    var avatar = series.images[x].avatar
    if(avatar && avatar.dataUrl){
      var url = avatar.dataUrl
      if(isExternalRef(url)){
        hasRefs = true;
      }
    }

    var figure = series.images[x].figure
    if(figure && figure.dataUrl){
      var url = figure.dataUrl
      if(isExternalRef(url)){
        hasRefs = true;
      }
    }
  }

  series.hasRefs = hasRefs

  return series
}

function updateSeries(series){
  if(!series.json){//v1
    if(!series.images)series.images={}
    series.json = {version:[1,0,0]}
  }

  //card loop
  for(var x=series.chars.length-1; x >= 0; --x){
    var card = series.chars[x];
    updateCardBySeries(card, series)
  }
}

function updateCardBySeries(card,series){
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

function extractSeriesImages(series){
  var images = series.images
  delete series.images
  return images
}

function extractAllSeriesImages(allseries){
  var images={}
  for(var x=allseries.length-1; x >= 0; --x){
    var series = allseries[x]
    images[series.id]=extractSeriesImages(series)
  }
  return images
}