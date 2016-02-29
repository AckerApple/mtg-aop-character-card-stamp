var jh = require('/Library/Server/Web/Data/Sites/jsAA/jh')
var web = jh.web()
var app = web.website(3000)
var path = require('path')

app.static( path.join(__dirname,'www') )

web.start().then(function(){
  console.log('started')
})