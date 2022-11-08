const fs = require('fs')
const path = require('path')

const src = fs.createWriteStream(path.join(__dirname, 'text.txt'))
const { stdout, stdin } = process

stdout.write('Enter the text\n')

stdin.on('data', data => {
  if (data.toString().trim('exit') == 'exit') {process.exit()}
  src.write(data)
})

process.on('exit', () => stdout.write('Good bye'))
process.on('SIGINT', () => process.exit())