import express from 'express';
import morgan from 'morgan'
import routerAuth from './routes/auth.routes.js';
import dotenv from 'dotenv';

import routerCruds from './routes/cruds.routes.js';

dotenv.config()
const app = express()

app.use(morgan('dev'))
app.use(express.json())


app.use('/quiromark', routerAuth)
app.use('/quiromark', routerCruds)

export default app;