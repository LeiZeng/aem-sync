import { expect } from 'chai'
import fetchMock from 'fetch-mock'

import { createFile, createNode } from '../es/sling'

const slingHost = 'http://admin:admin@localhost:4502'

afterEach(() => {
  fetchMock.reset()
})

describe('sling utils', () => {
  it('should create a new node', (done) => {
    const newNode = '/tmp/node'
    const newFile = '/tmp/node/.content.xml'
    const newNodeUrl = `${slingHost}${newNode}`

    fetchMock.mock(newNodeUrl, 'POST', 201)

    createNode(newNode)
      .then(response => {
        expect(fetchMock.called(newNodeUrl)).to.be.true
        done()
      })
  })
  it('should create a new file', (done) => {
    const newFilePath = '/tmp/node'
    const newFile = '/tmp/node/index.html'
    const newFileUrl = `${slingHost}${newFilePath}`

    fetchMock.mock(newFileUrl, 'POST', 201)

    createFile(newFile, 'text')
      .then(response => {
        expect(fetchMock.called(newFileUrl)).to.be.true
        done()
      })
  })
})
