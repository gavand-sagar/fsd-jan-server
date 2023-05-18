const { Router } = require('express');
const { getAllDocuments, insertDocument } = require('../utilities/db-utils.js');
const thoughtsRoutes = Router();



thoughtsRoutes.get('/', (req, res) => {
    getAllDocuments('thoughts')
        .then(data => {
            res.json(data)
        })
})


thoughtsRoutes.post('/', (req, res) => {
    insertDocument('thoughts', req.body)
        .then(data => {
            res.json(data)
        })
})



module.exports = { thoughtsRoutes }