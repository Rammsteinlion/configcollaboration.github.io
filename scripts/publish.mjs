import { cp, copyFile, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const appDir = dirname(fileURLToPath(import.meta.url))
const dist = resolve(appDir, '../dist')
const projectRoot = resolve(appDir, '../..')
const publishedAssets = resolve(projectRoot, 'assets')
await rm(publishedAssets, { recursive: true, force: true })
await mkdir(publishedAssets, { recursive: true })
await copyFile(resolve(dist, 'index.html'), resolve(projectRoot, 'index.html'))
await cp(resolve(dist, 'assets'), publishedAssets, { recursive: true, force: true })
console.log('Versión Vue publicada en ' + projectRoot)
