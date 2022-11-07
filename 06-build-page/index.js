const fs = require('fs');
const fsPr = require('fs/promises');
const path = require('path');

async function copyDirectory(dir, dirCopy) {
  await fsPr.rm(dirCopy, { recursive: true, force: true })
  await fsPr.mkdir(dirCopy, { recursive: true })

  fs.readdir(dir, { withFileTypes: true }, (err, items) => {
    if (!err) {
      items.forEach((it) => {
        let fromFile = path.join(dir, it.name);
        let toFile = path.join(dirCopy, it.name);
        if (it.isFile()) {
          fs.createReadStream(fromFile).pipe(fs.createWriteStream(toFile)).on('error', (err) => console.log(err))
        } else if (it.isDirectory()) {
          copyDirectory(fromFile, toFile);
        }
      })
    } else {
      return console.log(err)
    }
  }) 
}

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles')
  const newFolder = path.join(__dirname, 'project-dist', 'style.css')
  fs.writeFile(newFolder, '', (error) => {
    if (error) {
      throw error
    }
  })
  const writeStream = fs.createWriteStream(newFolder)

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
}

async function createHTML() {
  await fsPr.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'))
  let htmlContent = await fsPr.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8')
  let components = await fsPr.readdir(path.join(__dirname, 'components'), { withFileTypes: true })
  let ws = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))
  
  for (let item of components) {
    let extname = path.extname(path.join(path.join(__dirname, 'components'), item.name))
    if (item.isFile() && extname == '.html') {
      let sourceFileName = path.parse(path.join(path.join(__dirname, 'components'), item.name)).name
      let htmlContentComponent = await fsPr.readFile((path.join(path.join(__dirname, 'components'), item.name)), 'utf-8')
      htmlContent = htmlContent.replace(`{{${sourceFileName}}}`, htmlContentComponent)
    }
  }
  ws.write(htmlContent)
}
  
async function buildPage() {
  try {
    let assetsPath = path.join(__dirname, 'assets')
    let copiedAssets = path.join(__dirname, 'project-dist', 'assets')
    await fsPr.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true })
    await fsPr.mkdir(path.join(__dirname, 'project-dist'), { recursive: true })
    await copyDirectory(assetsPath, copiedAssets)
    await createHTML()
    await mergeStyles()
    console.log('Successfully created!')
  } catch (error) {
    console.log(error.message)
  }
}

buildPage()