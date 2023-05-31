import express from 'express'
import translateControllers from '../controllers/translateControllers.js'
const app = express()

app.post('/v1/translate', translateControllers.translateApi)

export default app