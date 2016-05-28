import fs from 'fs'
import path from 'path'
import { expect } from 'chai'

import { getConfig, getNodeName } from '../es/utils'

describe('Utils', () => {
  describe('getConfig', () => {
    it('expect to get xml config', () => {
      const nodePath = `${__dirname}/jcr_root/node/child/.content.xml`
      const config = getConfig(nodePath)
      expect(config).to.not.be.null
      expect(config['jcr:primaryType']).to.not.be.undefined
    })
    it('expect to null if a html file', () => {
      const nodePath = `${__dirname}/jcr_root/node/child/child.html`
      const config = getConfig(nodePath)
      expect(config).to.be.null
    })
    it('expect to null if a txt file not exists', () => {
      const nodePath = `${__dirname}/jcr_root/node/child/child.txt`
      const config = getConfig(nodePath)
      expect(config).to.be.null
    })
    it('expect to null if not a node config', () => {
      const nodePath = `${__dirname}/jcr_root/node/child/dialog.xml`
      const config = getConfig(nodePath)
      expect(config).to.not.be.null
      expect(config['jcr:primaryType']).to.not.be.undefined
    })
  })
  describe('getNodeName', () => {
    it('expect dialog', () => {
      const nodeName = getNodeName(`${__dirname}/jcr_root/node/child/dialog.xml`)
      expect(nodeName).to.be.equal('dialog')
    })
    it('expect cq:template', () => {
      const nodeName = getNodeName(`${__dirname}/jcr_root/node/child/_cq_template.xml`)
      expect(nodeName).to.be.equal('cq:template')
    })
    it('expect req:ac', () => {
      const nodeName = getNodeName(`${__dirname}/jcr_root/node/child/_req_ac.xml`)
      expect(nodeName).to.be.equal('req:ac')
    })
  })
})
