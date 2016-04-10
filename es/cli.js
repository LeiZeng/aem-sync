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

const cwd = process.cwd()
const watcher = watch([
  '**/jcr_root/**/*',
  '**/jcr_root/**/.*.*'
], { cwd })
let isReady = false

console.log(colors.cyan('AEM Sync'), 'start')

watcher
.on('ready', evt => {
  if (isReady) {
    // Ensure it only trigger once,
    // Any new file adds to the watch list will trigger again
    console.log(colors.cyan('Watch'), getWatchedFolders(evt._watched))
    isReady = true
  }
})
.on('nomatch', evt => console.log(colors.red('No matched JRC_ROOT found!')))
.on('change', evt => {
  console.log(colors.cyan('Sync'), colors.yellow(evt.type), 'File:', colors.green(evt.path.replace(cwd, '')))

  if (evt.type === 'deleted') {
    deleteFile(evt.path)
      .catch(e => console.log(colors.red('Process error:'), e))
  } else {
    updateNode(evt.path)
      .catch(e => console.log(colors.red('Process error:'), e))
  }
})
.on('error', evt => {
  console.log(colors.red('Watcher error:'), evt)
})
