import env from 'dotenv'

env.config()

const envConfig = {
  PORT: process.env.PORT as string,
  DB_URL: process.env.DB_URL as string,
  DB_NAME: process.env.DB_NAME as string
};

export default envConfig