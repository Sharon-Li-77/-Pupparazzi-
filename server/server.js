import * as Path from 'node:path'
import * as URL from 'node:url'
import puppiesRouter from './router.js'
import express from 'express'
import hbs from 'express-handlebars'

import { readFile } from 'fs/promises'
import { Length } from './readFile.js'

const server = express()

// Server configuration
const publicFolder = Path.resolve('public')
server.use(express.static(publicFolder))
server.use(express.urlencoded({ extended: false }))

// Handlebars configuration
server.engine('hbs', hbs.engine({ extname: 'hbs' }))
server.set('view engine', 'hbs')
server.set('views', Path.resolve('server/views'))

// Your routes/router(s) should go here

server.get('/', async (req, res) => {
  const data = await readFile('server/data/data.json', 'utf-8')
  let lengthSize = await Length()
  let stringData = JSON.parse(data)
  stringData.length = lengthSize

  // const newArray = stringData.puppies
  // let updatedArray = newArray.map((e) => ({ ...e, Length: lengthSize }))
  // updatedArray = { puppies: updatedArray }
  console.log(stringData)

  res.render('home', stringData)
})

server.use('/puppies', puppiesRouter)

export default server
