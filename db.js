const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const pgConfig = () => {
    
    return {
    	    user: 'postgres',
    	    host: 'localhost',
    	    database: 'cs',
    	    password: 'postgres',
    	    port: 5432
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