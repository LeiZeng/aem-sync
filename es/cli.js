import 'babel-polyfill'
import watch from 'glob-watcher'
import program from 'commander'

import packageInfo from '../package.json'
import { updateNode } from './sling'
import { getWatchedFolders } from './utils'

program
  .version(packageInfo.version)
  .usage('[options] [<path ...>]')
  .parse(process.argv)

const watcher = watch(['./**/jcr_root/**/*.*', './**/jcr_root/**/.*.*'])
const cwd = process.cwd()

console.log('AEM Sync start watching:')

watcher
.on('ready', evt => console.log(getWatchedFolders(evt._watched)))
.on('nomatch', evt => console.log('no match'))
.on('change', evt => {
  console.log('Updated File:', evt.path.replace(cwd, ''))
  updateNode(evt.path)
    .catch(e => console.log('Process error:', e))
})
.on('error', evt => {
  console.log('Watcher error:', evt)
})
