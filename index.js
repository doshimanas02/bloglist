const app = require('./backend/app')
const logger = require('./backend/utils/logger')
const config = require('./backend/utils/config')

const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})