import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const snapshot = path.join(root, 'contracts/openapi.yaml')
const output = path.join(root, 'src/api/generated/schema.d.ts')
const normalize = (value) => value.replace(/\r\n/g, '\n')
const check = process.argv.includes('--check')
let source
if (check) {
  source = await fs.readFile(snapshot, 'utf8')
  if (process.env.LAUNCHQUEUE_BACKEND_DIR) {
    const backend = await fs.readFile(path.join(process.env.LAUNCHQUEUE_BACKEND_DIR, 'openapi.yaml'), 'utf8')
    if (normalize(source) !== normalize(backend)) throw new Error('Frontend API snapshot differs from the pinned backend; regenerate contracts.')
  }
} else {
  const backend = process.env.LAUNCHQUEUE_BACKEND_DIR || path.resolve(root, '../launchqueue/server')
  source = await fs.readFile(path.join(backend, 'openapi.yaml'), 'utf8')
}
const types = astToString(await openapiTS(source))
if (check) {
  if (normalize(await fs.readFile(output, 'utf8')) !== normalize(types)) throw new Error('Generated API types are stale; run contracts:generate.')
} else {
  await fs.mkdir(path.dirname(snapshot), { recursive: true })
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(snapshot, normalize(source))
  await fs.writeFile(output, types)
}
console.log(`API snapshot and generated types ${check ? 'verified' : 'generated'}.`)
