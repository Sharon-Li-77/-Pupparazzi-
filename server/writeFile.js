import { writeFile } from 'fs/promises'

async function WriteFile(updatedThings) {
  try {
    await writeFile('server/data/data.json', updatedThings)
  } catch (err) {
    console.log('This is error')
  }
}

export default WriteFile
