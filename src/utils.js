const {URL} = require('url')
const {spawnSync} = require('child_process')

function validateUnique(newRoute, content) {
  content.push(newRoute)
  const hasDuplicate = (arrayObj, colName) => {
    const hash = Object.create(null)
    return arrayObj.some(arr => {
      return (
        arr[colName] && (hash[arr[colName]] || !(hash[arr[colName]] = true))
      )
    })
  }
  const isDuplicate = hasDuplicate(content, 'route')
  console.log(isDuplicate)
  if (isDuplicate) {
    throw new Error(`A link with this code already exists.`)
  }
}

function pull(cwd) {
  console.log('pulling the latest changes')
  spawnSync('git', ['pull'], {stdio: 'inherit', cwd})
}

function commitAndPush(short, longLink, cwd) {
  const message = longLink ? `${short} -> ${longLink}` : 'format links'
  console.log(`committing: ${message}`)
  spawnSync('git', ['commit', '-am', message], {
    stdio: 'inherit',
    cwd,
  })
  console.log('pushing')
  spawnSync('git', ['push'], {stdio: 'inherit', cwd})
}

function validateUrl(url) {
  // eslint-disable-next-line no-new
  new URL(url)
}

function addProtocolIfMissing(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  } else {
    return `https://${url}`
  }
}

function generateCode() {
  let text = ''
  const possible = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

module.exports = {
  generateCode,
  pull,
  commitAndPush,
  validateUrl,
  validateUnique,
  addProtocolIfMissing,
}
