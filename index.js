const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7ez2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function server(){
    try{
        await client.connect()
        const database = client.db('organic_toys');
        const toyCollection = database.collection('toys');
        const userCollection = database.collection('users');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews')
        // get api
        app.get('/toys', async(req,res)=>{
            const toys = await toyCollection.find({}).toArray()
            res.json(toys)
        })
        // get a single data 
        app.get('/toys/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const toy = await toyCollection.findOne(query)
            res.json(toy)
        })
        // create an user
        app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result)
        })
        // post a order
        app.post('/orders', async(req,res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })
        // get order
        app.get('/orders/:email', async(req,res)=>{
            const email = req.params.email;
            const query = { email: email }
            const orders = await orderCollection.find(query).toArray()
            res.json(orders)
        })
        // get all order
        app.get('/orders/', async(req,res)=>{
            const orders = await orderCollection.find({}).toArray()
            res.json(orders)
        })
        //get reviews
        app.get('/reviews', async(req,res)=>{
            const reviews = await reviewCollection.find({}).toArray();
            res.json(reviews);
        })
        // post data
        app.post('/reviews', async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.json(result)
        })
        // delete an order
        app.delete('/orders/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })
        // make a user email
        app.put('/users', async(req,res)=>{
            const user = req.body;
            const query = { email: user.email }
            const updateDoc = { $set:{ role : 'admin' }}
            const result = await userCollection.updateOne(query,updateDoc)
            res.json(result)
        })
        // get an user
        app.get('/users/:email', async(req,res)=>{
            const userEmail = req.params.email;
            const query = { email : userEmail }
            const user = await userCollection.findOne(query)
            res.json(user)
        })
        // update the order 
        app.put('/update/:id', async(req,res)=>{
            const id = req.params.id
            const user = req.body;
            const query = { _id: ObjectId(id) }
            const updateDoc = { $set: user }
            const result = await orderCollection.updateOne( query, updateDoc )
            res.json(result)
        })
        // post product
        app.post('/toys', async(req,res)=>{
            const product = req.body;
            const result = await toyCollection.insertOne(product)
            res.json(result)
        })
        // delete product
        app.delete('/toys/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.json(result)
        })
        // update toy/product info
        app.put('/products/:id', async(req,res)=>{
            const id = req.params.id;
            const product = req.body;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = { $set: product }
            const result = await toyCollection.updateOne(query,updateDoc,options)
            res.json(result)
        })
    }
    finally{

    }
}
server().catch(console.dir)

app.get('/',( req,res)=>{
    res.send('Assignment 12 node server is running');
})
app.listen( port, ()=>{
    console.log('server is running on :', port);
})
