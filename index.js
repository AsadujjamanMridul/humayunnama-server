const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hbmil.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error : ', err);
  const booksCollection = client.db("humayunnamaDb").collection("books");
  const ordersCollection = client.db("humayunnamaDb").collection("orders");


  //All Books
  app.get('/books', (req, res) => {
    booksCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })

  })


  //Add New Book
  app.post('/addBook', (req, res) => {
    const newBook = req.body;
    booksCollection.insertOne(newBook)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })


  //Place order
  app.post('/placeOrder', (req, res) => {
    const newBook = req.body;
    ordersCollection.insertOne(newBook)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })


  // Orders list of an user
  app.get('/orders', (req, res) => {
    ordersCollection.find({customerEmail : req.query.email})
      .toArray((err, items) => {
        res.send(items);
      })

  })


  // Delete Book
  app.delete('/delete/:id', (req, res) => {
    booksCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      res.send(result.deletedCount>0);
    })
  })


  //  client.close();
});


app.listen(port, () => { })