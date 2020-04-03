module.exports = {
  ENV: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_PORT: process.env.NODE_PORT || process.env.PORT || 3000,
    JWT_KEY: process.env.JWT_KEY,
    JWT_TTL: process.env.JWT_TTL,
    DB: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    }
  },
  API: {
    prefix: '/api',
    avatars_path: 'public/uploads/avatars'
  }
};
