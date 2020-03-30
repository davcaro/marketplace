module.exports = {
  ENV: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_PORT: process.env.NODE_PORT || process.env.PORT || 3000,
    DB: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    }
  },
  API: {
    prefix: '/api'
  }
};
