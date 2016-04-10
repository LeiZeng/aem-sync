import 'babel-polyfill'
import watch from 'glob-watcher'
import program from 'commander'
import colors from 'colors'

import packageInfo from '../package.json'
import { updateNode, deleteFile } from './sling'
import { getWatchedFolders } from './utils'

program
  .version(packageInfo.version)
  .usage('[options] [<path ...>]')
  .parse(process.argv)

const watcher = watch([
  './**/jcr_root/**/*',
  './**/jcr_root/**/.*.*'
])
const cwd = process.cwd()

console.log(colors.cyan('AEM Sync'), 'start watching:')

watcher
.on('ready', evt => console.log(getWatchedFolders(evt._watched)))
.on('nomatch', evt => console.log(colors.red('No matched JRC_ROOT found!')))
.on('change', evt => {
  console.log(`Sync ${evt.type} File:`, evt.path.replace(cwd, ''))

  if (evt.type === 'deleted') {
    deleteFile(evt.path)
      .catch(e => console.log('Process error:', e))
  } else {
    updateNode(evt.path)
      .catch(e => console.log('Process error:', e))
  }
})
.on('error', evt => {
  console.log(colors.red('Watcher error:'), evt)
})
