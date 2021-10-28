const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors')
require('dotenv').config();


const app = express();
// const port = 5000;
// or
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyeto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    console.log('connected to database');
    const database = client.db('carMechanic');
    const servicesCollection = database.collection('services');


    // GET Single Service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    })


    // GET API
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });


    // POST API
    app.post('/services', async (req, res) => {
      const service = req.body;
      console.log('hot the post api', service)

      /*    const service = {
           "name": "ENGINE DIAGNOSTIC",
           "price": "300",
           "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
           "img": "https://i.ibb.co/dGDkr4v/1.jpg"
         } */

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      // res.json('post hitted')
      res.json(result);

    })

    // DELETE API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })


  }


  finally {
    // await client.close();
  }
}


run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Genius Server');
});


app.get('/hello', (req, res) => {
  res.send('hello updated here');
})


app.listen(PORT, () => {
  console.log('Running Genius Server on port', port);
})





/*
one time:
1. heroku account open
2. Heroku software install
Every project
1. git init
2. .gitignore (node_module, .env)
3. push everything to git
4. make sure you have this script:  "start": "node index.js",
5. make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main
----
update:
1. save everything check locally
2. git add, git commit-m", git push
2. git push heroku main
*/