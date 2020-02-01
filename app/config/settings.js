const appName = "Bit API"


const config = {
    app_name: appName,
    api_server: {
        port: process.env.API_PORT
    },
    logging: {
        shouldLogToFile: process.env.ENABLE_FILE_LOGGING,
        file: process.env.LOG_PATH,
        level: process.env.LOG_LEVEL || 'warn',
        console: process.env.LOG_ENABLE_CONSOLE || true,
      },
      mongo: {
        salt_value: 10,
        connection: {
          host: process.env.MONGODB_HOST,
          username: process.env.MONGODB_USER,
          password: process.env.MONGODB_PASSWORD,
          port: process.env.MONGODB_PORT,
          dbProd: process.env.MONGODB_DATABASE_NAME
        },
        collections: {
          user: 'user',
          wallet: 'wallet',
          account: 'account',
          trade: 'trade',
          gift_card: 'gift_card',
          bitcoin: 'bitcoin',
        },
        queryLimit: process.env.MONGODB_QUERY_LIMIT,
        questionLimit: process.env.QUESTION_LIMIT
      },
}

module.exports = config;
