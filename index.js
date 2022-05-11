import express from 'express';
import router from './server/routes/api.js';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import errorMiddleware from './server/middlewares/errorMiddleware.js';
import cors from 'cors';
import 'dotenv/config';

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileupload({}));

app.use('/api', router);
app.use(errorMiddleware);

async function startApp() {
    try {
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT: ' + PORT))
    } catch (err) {
        console.log(err)
    }
}

startApp()
