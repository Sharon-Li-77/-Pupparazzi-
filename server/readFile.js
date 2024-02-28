import { readFile } from 'fs/promises'

export async function ReadData() {
  const data = await readFile('server/data/data.json', 'utf-8')
  return data
}

export async function Length() {
  let size = await ReadData()
  let objectSize = JSON.parse(size)
  let newSize = objectSize.puppies.length + 1
  return newSize
}
