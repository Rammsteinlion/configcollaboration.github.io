import { cp, copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const appDir = dirname(fileURLToPath(import.meta.url))
const dist = resolve(appDir, '../dist')
const projectRoot = resolve(appDir, '../..')
await mkdir(resolve(projectRoot, 'assets'), { recursive: true })
await copyFile(resolve(dist, 'index.html'), resolve(projectRoot, 'index.html'))
await cp(resolve(dist, 'assets'), resolve(projectRoot, 'assets'), { recursive: true, force: true })
console.log('Versión Vue publicada en ' + projectRoot)
