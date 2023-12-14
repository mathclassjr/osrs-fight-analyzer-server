export default {
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME || "postgres",
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRESS_HOST: process.env.POSTGRES_HOST,
    BCRYPT_SALT: process.env.BCRYPT_SALT || 10,
    JWT_SECRET: process.env.JWT_SECRET,    
}