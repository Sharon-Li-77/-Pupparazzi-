import express from 'express'

import { ReadData, Length } from './readFile.js'
import multer from 'multer'

import WriteFile from './writeFile.js'

const router = express.Router()

//Set up Multer Middleware

const puppyImageNumber = await Length()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, 'puppy' + puppyImageNumber + '.jpg')
  },
})

const upload = multer({ storage: storage })

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)

  // const data = await readFile('server/data/data.json', 'utf-8')
  let newData = await ReadData()
  const dataObject = JSON.parse(newData)
  // console.log(dataObject, typeof dataObject)
  const array = dataObject.puppies
  // console.log('array', array)
  const idArray = array.find((e) => e.id === id)
  // console.log('id', idArray)
  res.render('details', idArray)
})

router.get('/:id/edit', async (req, res) => {
  const id = Number(req.params.id)
  // const data = await readFile('server/data/data.json', 'utf-8')
  let newData = await ReadData()
  const dataObject = JSON.parse(newData)
  const array = dataObject.puppies
  const idArray = array.find((e) => e.id === id)
  res.render('edit', idArray)
})

router.post('/:id/edit', async (req, res) => {
  const body = req.body
  const id = Number(req.params.id)
  body['id'] = id
  console.log('body', body, typeof body)
  // const data = await readFile('server/data/data.json', 'utf-8')
  let newData = await ReadData()
  const dataObject = JSON.parse(newData)
  const array = dataObject.puppies
  console.log('array', array)
  let idArray = array.map((e) => (e.id === id ? { ...e, ...body } : e))
  idArray = { puppies: idArray }
  idArray = JSON.stringify(idArray, null, 2)
  console.log('idArray', idArray, typeof idArray)

  await WriteFile(idArray)

  res.redirect(`/puppies/${id}`)
})

router.get('/:id/add', async (req, res) => {
  console.log('id/post', req.params.id)
  // let newLength = await Length()
  // let stringLength = JSON.stringify(newLength)
  // let lengthSize =req.params.id
  // let updatedLength = { length: req.params.id }
  let id2 = Number(req.params.id)
  let newData = await ReadData()
  const dataObject = JSON.parse(newData)
  let array = dataObject.puppies
  let newObject = {
    name: null,
    image: null,
    breed: null,
    owner: null,
    id: id2,
  }
  array.push(newObject)

  let newList = { puppies: array, length: id2 }

  let newListString = JSON.stringify(newList, null, 2)

  await WriteFile(newListString)

  res.render('add', newList)
})

router.post('/:id/add', upload.single('image'), async (req, res) => {
  const fileName = req.file.filename
  const body = req.body
  console.log('body', body)
  body.image = '/images/' + fileName
  let newData = await ReadData()
  const dataObject = JSON.parse(newData)
  const array = dataObject.puppies
  let id = Number(req.params.id)
  body.id = id
  let idArray = array.map((e) => (e.id === id ? { ...body } : e))
  idArray = { puppies: idArray }
  idArray = JSON.stringify(idArray, null, 2)

  await WriteFile(idArray)
  res.redirect(`/`)
})

router.delete('/:id/delete', async (req, res) => {
  // try {
  const id = Number(req.params.id)
  let newData = await ReadData()
  let dataObject = JSON.parse(newData)
  let array = dataObject.puppies
  let idArray = array.filter((e) => e.id !== id)
  let updatedLength = idArray.length
  let updatedId = idArray.map((e, index) => {
    e.id = index + 1
    return e
  })
  console.log(updatedId)

  let updatedObject = { puppies: idArray, length: updatedLength }
  updatedObject = JSON.stringify(updatedObject, null, 2)
  await WriteFile(updatedObject)

  res.redirect(`/`)
  // } catch (error) {
  //   console.error(error)
  //   res.status(500).send('Error!')
  // }
})

export default router
