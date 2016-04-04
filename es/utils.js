import fs from 'fs'
import parser from 'xml2json'

const isNamespaceKey = /xmlns\:/i

export const getConfig = (filePath) => {
  try {
    const xmlConfig = getFileContent(filePath)
    const configJson = JSON.parse(parser.toJson(xmlConfig.toString()))['jcr:root']
    return Object.keys(configJson)
      .filter(key => !isNamespaceKey.test(key))
      .reduce((res, key) => {
        res[key] = configJson[key]
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
  return fs.accessSync(`${filePath}/.content.xml`, fs.R_OK | fs.W_OK)
}

const hasJsonConfig = (filePath) => {
  return fs.accessSync(`${filePath}.json`, fs.R_OK | fs.W_OK)
}

const getFileName = (filePath) => {
  if (filePath.indexOf('.') > -1) {
    return filePath.split('/').reverse()[0]
  }
  return null
}
