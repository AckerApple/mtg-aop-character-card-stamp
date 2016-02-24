var jh = require('/Library/Server/Web/Data/Sites/jsAA/jh')
var web = jh.web()
var app = web.website(3000)

app.static(__dirname)

web.start().then(function(){
  console.log('started')
})