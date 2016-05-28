Content Sync Tool For AEM
--------------------------

## Install
`npm i -g aem-sync`

## Usage
`aem-sync`

- Watch the current project files under `jcr_root`
- Connect to `http://admin:admin@localhost:4502` automatically

## TODO LIST
- [x] Add new file support
- [x] Delete file support
- [x] Support CQ nodes like dialog.xml or some cq:template nodes
- [ ] Apply ignore list in .gitignore
- [ ] Server status check
- [ ] Server configuration, e.g. user:pass@host:port
- [ ] Project path as option

## Known issue
- Update one level of properties in .node.xml
- Replace the whole node which is not .node.xml
