const dotenv = require("dotenv")
const connectDB = require("./src/db/db")
const app = require("./src/app")

dotenv.config()

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Shopping backend running on port ${PORT}`)
  })
})