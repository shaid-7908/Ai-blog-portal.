import express,{Request,Response} from 'express';
import cookieParser from 'cookie-parser'
import userRouter from './route/user.routes';
import { connectDB } from './config/db.connection';
import envConfig from './config/env.config';
import { errorHandler } from './common/middlewares/errorhandler.middleware';
import authRouter from './route/auth.routes';


const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)



app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(envConfig.PORT, () => {
      console.log(`Server running on http://localhost:${envConfig.PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB. Server not started.", err);
    process.exit(1); // Exit if DB fails
  }
};

startServer();