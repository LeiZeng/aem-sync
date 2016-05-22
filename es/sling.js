import 'isomorphic-fetch'
import FormData from 'form-data'
import path from 'path'

import {
  getConfig,
  getFileContent,
  getNodeName,
  isFileNode,
  isContentXml,
  isCqNode
} from './utils'

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
  if (isCqNode(filePath) || isContentXml(filePath)) {
    return createNode(filePath, getConfig(filePath))
  }
  return createFile(filePath, getFileContent(filePath))
}

export const createNode = (filePath, props) => {
  const form = new FormData()

  console.log(getSlingUrl(getNodePath(filePath)), props);
  if (props) {
    Object.keys(props)
      .forEach(key => {
        console.log(key, props[key]);
        if (Object.prototype.toString.call(props[key]) !== '[object String]') {
          form.append(key, JSON.stringify(props[key]))
        } else {
          form.append(key, props[key])
        }
      })
  }

  return fetch(
    getSlingUrl(getNodePath(filePath)),
    Object.assign(getBaseReq(), { body: form })
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

  return fetch(
    getSlingUrl(getNodePath(filePath)),
    Object.assign(getBaseReq(), { body: form })
  )
  .then(errorHandler)
}

export const deleteFile = (filePath) => {
  return fetch(
    getSlingUrl(
      getDeleteFilePath(filePath)
    ),
    { method: 'DELETE' }
  ).then(errorHandler)
}

const getSlingUrl = (filePath) => `${protocol}${user}:${pass}@${host}:${port}${filePath}`

const getNodePath = (filePath) => {
  if (isCqNode(filePath)) {
    return isContentXml(filePath)
      ? filePath
        .replace(`${path.sep}${getFileName(filePath)}`, '')
        .replace(/.*jcr_root/i, '')
        .replace('_cq_', 'cq:')
      : filePath
        .replace(/\..+$/, '')
        .replace(/.*jcr_root/i, '')
        .replace('_cq_', 'cq:')
  }
  return filePath
    .replace(`${path.sep}${getFileName(filePath)}`, '')
    .replace(/.*jcr_root/i, '')
}

const getDeleteFilePath = (filePath) => filePath
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
    throw new Error(response.status + ': ' + response.statusText)
  }
  return Promise.resolve(response)
}
