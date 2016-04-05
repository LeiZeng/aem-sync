import fs from 'fs'
import path from 'path'
import parser from 'xml2json-light'

const isNamespaceKey = /xmlns\:/i

export const getConfig = (filePath) => {
  try {
    const xmlConfig = getFileContent(filePath)
    const configJson = parser.xml2json(xmlConfig.toString())
    const jcr_root = configJson.jcr

    return Object.keys(jcr_root)
      .filter(key => !isNamespaceKey.test(key))
      .reduce((res, key) => {
        res[key] = jcr_root[key]
        return res
      }, {})
  } catch (e) {
    return null
  }
  return null
}

export const getFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath)
  } catch (e) {
    return ""
  }
  return ""
}

export const isFileNode = (filePath) => {
  if (getFileName(filePath) === '.content.xml') {
    return false
  }
  return true
}

export const parseConfig = (config) => {
  return config
}

const hasXmlConfig = (filePath) => {
  return fs.accessSync(`${filePath}${path.sep}.content.xml`, fs.R_OK | fs.W_OK)
}

const hasJsonConfig = (filePath) => {
  return fs.accessSync(`${filePath}.json`, fs.R_OK | fs.W_OK)
}

const getFileName = (filePath) => {
  if (filePath.indexOf('.') > -1) {
    return filePath.split(path.sep).reverse()[0]
  }
  return null
}
