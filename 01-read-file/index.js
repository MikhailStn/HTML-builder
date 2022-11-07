const fs = require('fs')
const path = require('path')
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'))
let data = ''

stream.on('data', chunk => data = data + chunk)
stream.on('end', () => console.log(data))