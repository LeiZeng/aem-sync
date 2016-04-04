import fs from 'fs'
import path from 'path'
import { expect } from 'chai'

import { getConfig } from '../es/utils'

describe('Utils', () => {
  describe('getConfig', () => {
    const nodePath = `${__dirname}/jcr_root/node/child/.content.xml`
    it('expect to get xml config', () => {
      const config = getConfig(nodePath)
      expect(config).to.not.be.null
      expect(config['jcr:primaryType']).to.not.be.null
    })
  })
})
