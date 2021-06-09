
const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const pgConfig = () => {
    
    const env = 'local'
    return {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE, 
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT
	}

}

const pool = new Pool(pgConfig()) 

module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
    },
    getClient: (callback) => {
        pool.connect((err, client, done) => {
            callback(err, client, done)
        })
    }
  }