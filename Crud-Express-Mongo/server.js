console.log('May Node be with you')

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

MongoClient.connect("mongodb+srv://Zolere:Orpheus890!@cluster0.sw9fgmu.mongodb.net/?retryWrites=true&w=majority", {
    useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')
        app.use(express.static('public')) //app.use = these pieces of code are gonna be used for any request in my system
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.get('/', (req, res) => { //Read
            const cursor = db.collection('quotes').find().toArray()
                .then(results => {
                    console.log(results)
                res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
            })
        app.post('/quotes', (req, res) => { //Create new records and store in MongoDB
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
            })
        })
        app.put('/quotes', (req, res) => { //Is for updates
            console.log(req.body)
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' }, //Find anything that has a name of 'Yoda', then return it
                {
                    $set: { //Set new values for the properties of the object you returned prior
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true  //Upsert = Update + Insert
                }
            )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => { //Find a record and delete it
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json(`Deleted Darth Vader quote`)
            })
            .catch(error => console.error(error))
        })
        app.listen(3000, function() {
            console.log('listening on 3000')
            })    
})
.catch(error => console.error(error))



//Make sure you place body-parser before your CRUD handlers!


//All your handlers here...

// app.get(endpoint, callback)