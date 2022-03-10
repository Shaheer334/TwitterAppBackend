import express from 'express'
import cors from 'cors'
import databaseConnect from './api/database/db.js'
import dotenv from 'dotenv'
import errorHandler from './api/helper/errorHandler.js'
import user_router from './api/twitter_app/routes/user_routes.js'

dotenv.config()

import path from 'path'
// const __dirname = path.resolve()

// routes will be imported here.
// example import here: import {router as userRouter} from './api/twitter_app/routes/userRoutes

const app = express()

app.use(cors())
// app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', user_router);

const port = process.env.PORT || 5000
const host = process.env.HOST || '127.0.0.1'
const api = process.env.API

// app.use(`${api}/user`, ('user Router goes here'))

app.get('/', (req, res) => {
    res.send('app is running')
})

// database connection goes here
databaseConnect()

// global error handler goes here
app.use(errorHandler)

app.listen(port, () => console.log(`server is running at http://${host}:${port}`))
