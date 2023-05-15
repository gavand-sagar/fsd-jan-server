const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { songsRoutes } = require('./apis/songs-routes');
const { postRoutes } = require('./apis/posts-routes');
const { readAsJson, writeToFile } = require('./utilities/utils');
const { logger } = require('./logger');
const { authenticationRoutes } = require('./apis/authentication-routes');
const { signupRoutes } = require('./apis/sign-up-routes');
const dotenv = require('dotenv')
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
    try{
        const out = jwt.verify(token,'MySecretReceipe');
        next();
    }catch{
        res.json('Un Authorized!!!')
    }

}

//url here is a prefix for all child urls
app.use('/songs',  songsRoutes)

app.use('/posts', postRoutes)

app.use('/authenticate', authenticationRoutes)

app.use('/sign-up', signupRoutes)

// app.use('/users', usersRoutes)//

app.listen(3001, () => {
    console.log('Server started...')
})
