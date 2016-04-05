import 'isomorphic-fetch'
import FormData from 'form-data'
import path from 'path'

import { getConfig, getFileContent, isFileNode } from './utils'

let protocol = 'http://'
let host = 'localhost'
let port = '4502'
let user = 'admin'
let pass = 'admin'

export const init = (option) => {
  protocol = option.protocol || protocol
  host = option.host || host
  port = option.port || port
  user = option.user || user
  pass = option.pass || pass
}

export const updateNode = (filePath) => {
  if (isFileNode(filePath)) {
    return createFile(filePath, getFileContent(filePath))
  }
  return createNode(filePath, getConfig(filePath))
}

export const createNode = (filePath, props) => {
  const form = new FormData()

  try {
    if (props) {
      Object.keys(props)
        .map(key => form.append(key, props[key]))
    }
  } catch (e) {
    return Promise.reject(e.stack)
  }
  return fetch(
    getSlingUrl(
      getNodePath(filePath)
    ),
    Object.assign(getBaseReq(), {
      body: form
    })
  ).then(errorHandler)
}

export const createFile = (filePath, fileContent) => {
  const req = getBaseReq()
  const fileName = getFileName(filePath)
  const form = new FormData()

  try {
    form.append(fileName, prepareFile(fileContent), { filename: fileName })
  } catch (e) {
    return Promise.reject(e.stack)
  }
  req.body = form

  return fetch(getSlingUrl(getNodePath(filePath)), req)
    .then(errorHandler)
}

const getSlingUrl = (filePath) => `${protocol}${user}:${pass}@${host}:${port}${filePath}`

const getNodePath = (filePath) => filePath
  .replace(`${path.sep}${getFileName(filePath)}`, '')
  .replace(/.*jcr_root/i, '')

const getBaseReq = () => ({
  method: 'POST'
})

const getFileName = (filePath) => {
  if (filePath.indexOf('.') > -1) {
    return filePath.split(path.sep).reverse()[0]
  }
  return 'newFile.html'
}

const getFilePath = (filePath) => {
    if (filePath.indexOf('.') > -1) {
      return filePath.split(path.sep).slice(0, -1).join(path.sep)
    }
    return filePath
}

const prepareFile = (fileContent) => {
  if (fileContent && fileContent.pipe) {
    return fileContent
  }
  return new Buffer(fileContent)
}

const errorHandler = (response) => {
  if (response.status >= 400) {
    throw new Error({message: response.statusText})
  }
  return Promise.resolve(response)
}
