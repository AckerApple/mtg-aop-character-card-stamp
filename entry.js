require('angular');
require('angular-animate');
require('ng-fx');
require('angular-sanitize');//cleanse variables for html output
require('ng-file-upload');//used to add images and import files
require('angular-file-saver');//html5 file saving/exporting
toBlob = require('canvas-to-blob');//teamed with angular-file-saver, creates html5 "files"
toBlob.init();

require('ng-sortable');//drag-n-drop
require('ng-sortable/dist/ng-sortable.min.css')

require('ack-angular');//white-out-modal

JSZip = require('jszip');//create zip file in browser

require('font-awesome/css/font-awesome.min.css')
require('bootstrap/dist/css/bootstrap.min.css')

require('mtg-aotp-syms/css/mtg-aotp-syms.css')

require('./assets/styles/mtg-font/css/magic-font.css')

require('./assets/styles/Beleren-Bold/fonts.css')
require('./assets/styles/beleren-small-caps/fonts.css')

require('./assets/styles/main.css')
require('./assets/scripts/aotp-card-service.js')
require('./assets/scripts/aotp-card-creator.js')

