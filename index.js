const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { songsRoutes } = require('./apis/songs-routes');
const { postRoutes } = require('./apis/posts-routes');
const { readAsJson, writeToFile } = require('./utilities/utils');
const { logger } = require('./logger');
const { authenticationRoutes } = require('./apis/authentication-routes');
const { signupRoutes } = require('./apis/sign-up-routes');
const mongo = require('mongodb')
const dotenv = require('dotenv');
const { thoughtsRoutes } = require('./apis/thoughts-routes');
const { tagsRoutes } = require('./apis/tags-routes');
const { upload } = require('./utilities/grid-fs.util');
dotenv.config();
const app = express();
app.use(express.json())
app.use(cors())



const counter = (req, res, next) => {
  let obj = readAsJson('./post-count.json')
  obj.count = obj.count + 1;
  writeToFile('./post-count.json', obj);
  logger.emit('logMessage', new Date().toISOString())  // async
  next()
};




const authenticator = (req, res, next) => {
  let token = req.headers.token;
  try {
    const out = jwt.verify(token, 'MySecretReceipe');
    next();
  } catch {
    res.json('Un Authorized!!!')
  }

}


var bucket;

async function createGridStream() {
  return new Promise((resolve, reject) => {


    new mongo.MongoClient(process.env.CONNECTION_STRING).connect().then(client => {
      const db = client.db(process.env.DEFAULT_DATABASE);
      resolve(new mongo.GridFSBucket(db, { bucketName: 'uploads' }));
    }).catch(e => {
      reject(e)
    })
  })
}

//url here is a prefix for all child urls
app.use('/songs', songsRoutes)

app.use('/posts', postRoutes)

app.use('/authenticate', authenticationRoutes)

app.use('/sign-up', signupRoutes)

app.use('/thoughts', thoughtsRoutes)

app.use('/tags', tagsRoutes)


app.post('/app-image-upload', upload.single('myFile'), (req, res) => {
  console.log(req.file)
  res.json(req.file)

})



app.get('/image/:filename', (req, res) => {

  bucket.find({ filename: req.params.filename }).toArray().then((files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    const stream = bucket.openDownloadStreamByName(req.params.filename)
    stream.pipe(res)
  });
});


createGridStream().then(x => {
  bucket = x;

  server = app.listen(3001, () => {
    console.log('Server started...')
  })


})

