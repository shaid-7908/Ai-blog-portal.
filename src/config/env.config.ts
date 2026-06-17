import env from 'dotenv'

env.config()


const envConfig = {
  PORT: process.env.PORT as string,
  DB_URL: process.env.DB_URL as string,
  DB_NAME: process.env.DB_NAME as string,
  JWT_SECRET:process.env.JWT_SECRET as string,
  JWT_EXPIERS_IN: process.env.JWT_EXPIERS_IN as string,
  AWS_REGION:process.env.AWS_REGION as string,
  AWS_ACCESSKEY:process.env.AWS_ACCESSKEY as string,
  AWS_SECRETKEY:process.env.AWS_SECRETKEY as string,
  AWS_BUCKET:process.env.AWS_BUCKET as string
};

export default envConfig