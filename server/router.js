import * as Path from 'node:path'
import * as URL from 'node:url'

import express from 'express'
import hbs from 'express-handlebars'

import { ReadData, Length } from './readFile.js'

import WriteFile from './writeFile.js'

const router = express.Router()

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
  let newLength = await Length()
  let stringLength = JSON.stringify(newLength)
  req.params.id = stringLength
  console.log(stringLength)

  res.render('add')
})

export default router
