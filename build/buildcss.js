'use strict';
require('shelljs/global');
let fs = require('fs')
let os = require('os')
let platform = os.platform()
let child_process = require('child_process')

const cmpPath = 'src/style/variables'

fs.readdirSync(cmpPath).forEach((file) => {
  const fileName = file.replace('.css', '')
  exec(`node_modules/.bin/et --config src/style/variables/${file} --out dist/style/${fileName} --minimize`)
})

