//setting up connection with using .env

import mysql from 'mysql2';
import 'dotenv/config';

const connectDB = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PW,
        database: process.env.MYSQL_DB
    },
    console.log('Connected to Employee database')
);

export default connectDB