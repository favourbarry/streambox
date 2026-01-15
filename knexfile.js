import dotenv from 'dotenv';
dotenv.config();

const config = {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        },
        migrations: {
            directory: './migrations'
        },
        useNullAsDefault: true
    },
    test: {
        client: "sqlite3",
        connection: {
            filename: ":memory:"
        },
        migrations: {
            directory: './migrations'
        },
        useNullAsDefault: true
    }
};

export default config;