require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_ID,
    "password": process.env.DB_PASSWORD,
    "database": "nodebird_dev",
    "host": process.env.DB_ADDRESS,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DB_ID,
    "password": process.env.DB_PASSWORD,
    "database": "nodebird_dev",
    "host": process.env.DB_ADDRESS,
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_ID,
    "password": process.env.DB_PASSWORD,
    "database": "nodebird_dev",
    "host": process.env.DB_ADDRESS,
    "dialect": "mysql"
  }
}
