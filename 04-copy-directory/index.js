const fs = require('fs')
const fsPr = require('fs/promises')
const path = require('path')
const files = path.join(__dirname, 'files')
const filesCopy = path.join(__dirname, 'files-copy')

async function copyDirectory(dir, dirCopy) {
  await fsPr.rm(dirCopy, { recursive: true, force: true })
  await fsPr.mkdir(dirCopy, { recursive: true })

  fs.readdir(dir, { withFileTypes: true }, (err, items) => {
    if (!err) {
      items.forEach((it) => {
        let fromFile = path.join(dir, it.name)
        let toFile = path.join(dirCopy, it.name)
        if (it.isFile()) {
          fs.createReadStream(fromFile).pipe(fs.createWriteStream(toFile)).on('error', (err) => console.log(err))
        } else if (it.isDirectory()) {
          copyDirectory(fromFile, toFile)
        }
      })
    } else {
      return console.log(err)
    }
  })
}

copyDirectory(files, filesCopy)