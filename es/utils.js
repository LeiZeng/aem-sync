import fs from 'fs'
import path from 'path'
import parser from 'xml2json'

const isNamespaceKey = /xmlns\:/i

export const getConfig = (filePath) => {
  let configJson

  if (!['.xml', '.json'].find(ext => filePath.indexOf(ext) > -1)) {
    return null
  }
  try {
    const xmlConfig = getFileContent(filePath)
    configJson = parser.toJson(xmlConfig.toString(), {
      object: true,
      reversible: true
    })
  } catch (e) {
    // console.log('File is not node', filePath, e.stack)
    return null
  }

  const jcr_root = configJson['jcr:root']

  if (!jcr_root) {
    return null
  }

  return Object.keys(jcr_root)
    .filter(key => !isNamespaceKey.test(key))
    .reduce((res, key) => {
      res[key] = jcr_root[key]
      return res
    }, {})
}

export const getFileContent = (filePath) => fs.readFileSync(filePath)

export const isFileNode = (filePath) => isContentXml(filePath)

export const isContentXml = (filePath) => getFileName(filePath) === '.content.xml'

export const parseConfig = (config) => config

export const getWatchedFolders = (watched) => {
  const cwd = process.cwd()

  return Object.keys(watched)
    .filter(key => /jcr\_root\/$/i.test(key))
    .map(key => key.replace(cwd, '.'))
}

export const isCqNode = (filePath) => {
  if (isContentXml(filePath)) {
    return getPathName(filePath).indexOf('_cq_') > -1
  } else {
    return (getFileName(filePath).indexOf('_cq_') > -1)
      || [
        'dialog.xml',
        'design_dialog.xml'
      ].indexOf(getFileName(filePath)) > -1
  }
}

export const getFileName = (filePath) => {
  if (filePath.indexOf('.') > -1) {
    return filePath.split(path.sep).reverse()[0]
  }
  return ''
}

export const getPathName = (filePath) => {
  if (filePath.indexOf('.') > -1) {
    return filePath.split(path.sep).reverse()[1]
  }
  return filePath.split(path.sep).reverse()[0]
}

export const getNodeParentPath = (filePath) => {
  const pathCollection = filePath.split(path.sep)

  pathCollection.pop()

  if (isContentXml(filePath)) {
    pathCollection.pop()
  }
  return pathCollection.join(path.sep).replace(/.*jcr_root/i, '')
}

export const getNodeName = (filePath) => {
  if (isContentXml(filePath)) {
    return getPathName(filePath).replace('_cq_', 'cq:')
  }
  return getFileName(filePath)
    .replace(/\_(\w+)\_/, (full, nodePath) => {
      return nodePath + ':'
    })
    .replace(/\..+$/, '')
}

const hasXmlConfig = (filePath) => {
  return fs.accessSync(`${filePath}${path.sep}.content.xml`, fs.R_OK | fs.W_OK)
}

const hasJsonConfig = (filePath) => {
  return fs.accessSync(`${filePath}.json`, fs.R_OK | fs.W_OK)
}
