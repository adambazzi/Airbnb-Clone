const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "postgres",
    database: "dev",
    host: "localhost",
    username: "adambazzi",
    password: null,
    port: 5431, // the default Postgres port
    logging: false, // set to true if you want to see SQL queries in the console
    typeValidation: true,
    seederStorage: "sequelize"
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};
