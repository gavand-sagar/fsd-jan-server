const { Router } = require('express');
const { getAllDocuments, insertDocument } = require('../utilities/db-utils.js');
const tagsRoutes = Router();



tagsRoutes.get('/', (req, res) => {
    getAllDocuments('tags')
        .then(data => {
            res.json(data)
        })
})


tagsRoutes.post('/', (req, res) => {
    insertDocument('tags', req.body)
        .then(data => {
            res.json(data)
        })
})



module.exports = { tagsRoutes }