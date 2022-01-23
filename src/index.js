#!/usr/bin/env node

/* istanbul ignore file */

const fs = require('fs')
const path = require('path')
const clipboardy = require('clipboardy')
const readPkg = require('read-pkg-up')
const {
  generateCode,
  pull,
  commitAndPush,
  validateUrl,
  validateUnique,
  addProtocolIfMissing,
} = require('./utils')

const {packageJson, path: pkgPath} = readPkg.sync({
  cwd: path.join(__dirname, '../..'),
})
const baseUrl =
  packageJson.baseUrl ||
  packageJson.homepage ||
  'https://update-homepage-in-your-package.json'

const appLocation = packageJson.config.appLocation || 'appLoaction'

const repoRoot = path.dirname(pkgPath)
const redirectPath = path.join(
  repoRoot,
  appLocation,
  'staticwebapp.config.json',
)

pull(repoRoot)

const [, , longLink, codeRaw] = process.argv

let code
if (codeRaw) {
  code = encodeURIComponent(
    codeRaw.startsWith('/') ? codeRaw.substring(1) : codeRaw,
  )
}

const short = `/${code || generateCode()}`
const rawcontent = fs.readFileSync(redirectPath, 'utf8')
const contents = JSON.parse(rawcontent)
let formattedLink = null
let newRoute = null
if (longLink) {
  formattedLink = addProtocolIfMissing(longLink)
  validateUrl(formattedLink)
  newRoute = {
    route: `${short}`,
    redirect: `${formattedLink}`,
    statusCode: '301',
  }
  validateUnique(newRoute, [...contents.routes])
  contents.routes.push(newRoute)
}

fs.writeFileSync(redirectPath, JSON.stringify(contents, null, '\t'))
commitAndPush(short, formattedLink, repoRoot)

const link = `${baseUrl}${short}`
clipboardy.writeSync(link)

console.log(`"${link}" has been copied to your clipboard `)
