const { MongoClient, ObjectId } = require('mongodb')

function getClient() {
    return new MongoClient(process.env.CONNECTION_STRING);
}

function getAllDocuments(collectionName) {
    return getClient().connect().then(connection => {
        const db = connection.db('lookup-demo');
        return db.collection(collectionName)
            .find()
            .toArray()
    })
}


function getFilteredDocuments(collectionName, query) {
    return getClient().connect().then(connection => {
        const db = connection.db('lookup-demo');
        return db.collection(collectionName)
            .find(query)
            .toArray()
    })
}


function insertDocument(collectionName, document) {
    return getClient().connect().then(connection => {
        const db = connection.db('lookup-demo')
        return db.collection(collectionName)
            .insertOne(document)
            .then(x => {
                return db.collection(collectionName)
                    .find()
                    .toArray()
            })
    })
}


function deleteDocument(collectionName, id) {
    return getClient().connect().then(connection => {
        const db = connection.db('lookup-demo')
        return db.collection(collectionName)
            .deleteOne({ "_id": new ObjectId(id) })
            .then(x => {
                return db.collection('songs')
                    .find()
                    .toArray()

            })
    })
}

module.exports = { getAllDocuments, insertDocument, deleteDocument, getFilteredDocuments }
