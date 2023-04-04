
const mongoose = require('mongoose')
const app = require('./app')
const config = require('./db/config')


const PORT = process.env.PORT || 3000


async function start() {
  try {
    const db = await mongoose.connect(
      config.ATLAS_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    app.listen(PORT, () => {
      console.log('Server has been started...')
    })
    if(db){
      console.log("Successfully connected to MongoDB.");
    } else{
      throw new Error('Not connect DB')
    }
  } catch (e) {
    console.log(e)
  }
}

start()