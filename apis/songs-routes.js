const { Router } = require('express')
const { getAllDocuments, insertDocument, deleteDocument, getFilteredDocuments } = require('../utilities/db-utils');

const songsRoutes = Router();

songsRoutes.get('/', (req, res) => {
    getAllDocuments('songs')
        .then(data => {
            res.json(data)
        })
})


//       /songs/filtered?rating=3
songsRoutes.get('/filtered', (req, res) => {
    const rating = Number(req.query.rating);
    getFilteredDocuments('songs', { "rating":rating  })
        .then(data => {
            res.json(data)
        })
})

//       /songs/filtered-less-than?rating=3
songsRoutes.get('/filtered-less-than', (req, res) => {
    const rating = Number(req.query.rating);
    getFilteredDocuments('songs', { "rating": { $lte: rating } })
        .then(data => {
            res.json(data)
        })
})

songsRoutes.post('/', (req, res) => {
    const body = req.body;
    insertDocument('songs', body)
        .then(data => {
            res.json(data)
        })
})

songsRoutes.delete('/:id', (req, res) => {
    const id = req.params.id;

    deleteDocument('songs', id)
        .then(data => {
            res.json(data)
        })

})

module.exports = { songsRoutes };