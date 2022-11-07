const fs = require('fs')
const path = require('path')
const stylesFolder = path.join(__dirname, 'styles')
const newFolder = path.join(__dirname, 'project-dist', 'bundle.css')

fs.writeFile(newFolder, '', (error) => {
  if (error) {
    throw error;
  }
});
const writeStream = fs.createWriteStream(newFolder);

fs.readdir(stylesFolder, { withFileTypes: true }, (error, files) => {
  if (!error) {
    files.forEach((el) => {
      let extname = path.extname(path.join(__dirname, 'styles', el.name))
      if (!el.isDirectory() && extname == '.css') {
        fs.readFile(path.join(stylesFolder, el.name), (error, data) => {
            writeStream.write(data)
        })
      }
    })
  } else {
    console.log(error)
  }
})