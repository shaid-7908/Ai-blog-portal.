import env from 'dotenv'

env.config()

const envConfig = {
  PORT: process.env.PORT as string,
  DB_URL: process.env.DB_URL as string,
  DB_NAME: process.env.DB_NAME as string,
  JWT_SECRET:process.env.JWT_SECRET as string,
  JWT_EXPIERS_IN: process.env.JWT_EXPIERS_IN as string
};

export default envConfig