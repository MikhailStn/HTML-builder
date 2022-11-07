const fs = require('fs')
const path = require('path')


fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err)
  } else {
    files.forEach((el) => {
      if (!el.isDirectory()) {
        fs.stat(path.join(path.join(__dirname, 'secret-folder'), el.name), (err, options) => {
          if (err) {
            console.log(err)
          }
          console.log(el.name.split('.')[0], '-', path.extname(el.name), '-', options.size, 'bytes')
        })
      }
    })
  }
})