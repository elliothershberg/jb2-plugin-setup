const fs = require('fs')

/* 
****************************
Update package.json
****************************
*/

let initialPackageJSON = require('../package.json')
let newPackageJSON = Object.assign({}, initialPackageJSON)
let projectName = initialPackageJSON.name

// ensure setup hasn't already been run
if (initialPackageJSON['jbrowse-plugin'].name !== 'MyProject') {
  console.log(
    'It appears that setup has already been run. Terminating to avoid overwriting information.',
  )
  process.exit(1)
}

// 1. Change "name" in the "jbrowse-plugin" field to the name of your project (e.g. "MyProject")
newPackageJSON['jbrowse-plugin'].name = projectName

// 2. In the "scripts" field, replace the default name with the name of your project, prefixed with "JBrowsePlugin" in the "start" and "build" entries
newPackageJSON.scripts.start = `tsdx watch --verbose --noClean --format umd --name JBrowsePlugin${projectName} --onFirstSuccess \"yarn serve --cors --listen 9000 .\""`

newPackageJSON.scripts.build = `tsdx build --format cjs,esm,umd --name JBrowsePlugin${projectName}`

// 3. In the "module" field, replace jbrowse-plugin-my-project with the name of your project (leave off the @myscope if using a scoped package name) (you can double-check that the filename is correct after running the build step below and comparing the filename to the file in the dist/ folder)
newPackageJSON.module = `dist/${projectName}.esm.js`

// this overwrites package.json
writeJSON(newPackageJSON, 'package.json')

/* 
****************************
Update jbrowse_config.json
****************************
*/

// replace default plugin name with project name
let initialJBrowseConfig = require('../jbrowse_config.json')
let newJBrowseConfig = Object.assign({}, initialJBrowseConfig)
newJBrowseConfig.plugins[0].name = projectName
writeJSON(newJBrowseConfig, 'jbrowse_config.json')

/* 
****************************
Update badge in README
****************************
*/

// Replace repo path for integration badge
let README = readFile('README.md').split(/\r?\n/)
README[0] = `jbrowse-plugin-template ![Integration](${initialPackageJSON.repository.slice(
  0,
  -4,
)}/workflows/Integration/badge.svg?branch=main)`
let stream = fs.createWriteStream('README.md')
README.forEach((line) => stream.write(`${line}\r\n`))

/* 
****************************
Helpers
****************************
*/

function writeJSON(data, path) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  }
}

function readFile(path) {
  try {
    return fs.readFileSync(path, 'utf8')
  } catch (err) {
    console.error(err)
    return false
  }
}
